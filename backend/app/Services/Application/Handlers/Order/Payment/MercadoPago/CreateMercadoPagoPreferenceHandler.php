<?php

namespace HiEvents\Services\Application\Handlers\Order\Payment\MercadoPago;

use HiEvents\DomainObjects\EventDomainObject;
use HiEvents\DomainObjects\OrderItemDomainObject;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\DomainObjects\Status\OrderStatus;
use HiEvents\Exceptions\MercadoPago\CreatePaymentFailedException;
use HiEvents\Exceptions\ResourceConflictException;
use HiEvents\Exceptions\UnauthorizedException;
use HiEvents\Repository\Eloquent\Value\Relationship;
use HiEvents\Repository\Interfaces\AccountRepositoryInterface;
use HiEvents\Repository\Interfaces\MercadoPagoPaymentsRepositoryInterface;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Services\Domain\Payment\MercadoPago\DTOs\CreatePaymentRequestDTO;
use HiEvents\Services\Domain\Payment\MercadoPago\MercadoPagoPaymentCreationService;
use HiEvents\Services\Infrastructure\Session\CheckoutSessionManagementService;
use HiEvents\Values\MoneyValue;
use Illuminate\Contracts\Config\Repository as Config;
use Illuminate\Support\Str;
use Throwable;

readonly class CreateMercadoPagoPreferenceHandler
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private MercadoPagoPaymentCreationService $mercadoPagoPaymentService,
        private CheckoutSessionManagementService $sessionIdentifierService,
        private MercadoPagoPaymentsRepositoryInterface $mercadoPagoPaymentsRepository,
        private AccountRepositoryInterface $accountRepository,
        private Config $config,
    ) {
    }

    private function getFrontendUrl(): string
    {
        return rtrim($this->config->get('app.frontend_url', 'http://localhost'), '/');
    }

    /**
     * @throws CreatePaymentFailedException
     * @throws ResourceConflictException
     * @throws UnauthorizedException
     * @throws Throwable
     */
    public function handle(string $orderShortId, int $eventId): array
    {
        $order = $this->orderRepository
            ->loadRelation(new Relationship(OrderItemDomainObject::class))
            ->loadRelation(new Relationship(EventDomainObject::class, name: 'event'))
            ->findByShortId($orderShortId);

        if (!$order || !$this->sessionIdentifierService->verifySession($order->getSessionId())) {
            throw new UnauthorizedException(__('Sorry, we could not verify your session. Please create a new order.'));
        }

        if ($order->getStatus() !== OrderStatus::RESERVED->name || $order->isReservedOrderExpired()) {
            throw new ResourceConflictException(__('Sorry, order is expired or not in a valid state.'));
        }

        if ((int) $order->getEventId() !== $eventId) {
            throw new UnauthorizedException(__('Order does not belong to this event.'));
        }

        $account = $this->accountRepository->findByEventId($order->getEventId());
        if (!$account) {
            throw new ResourceConflictException(__('Account not found for this event.'));
        }

        $basePath = $this->getFrontendUrl();
        $successUrl = "{$basePath}/checkout/{$eventId}/{$orderShortId}/summary";
        $failureUrl = "{$basePath}/checkout/{$eventId}/{$orderShortId}/payment?failed=1";
        $pendingUrl = "{$basePath}/checkout/{$eventId}/{$orderShortId}/payment?pending=1";

        $description = __(':item_count item(s) for event: :event_name (Order :order_short_id)', [
            'event_name' => Str::limit($order->getEvent()?->getTitle() ?? __('Event'), 75),
            'order_short_id' => $orderShortId,
            'item_count' => $order->getOrderItems()->sum(fn(OrderItemDomainObject $item) => $item->getQuantity()),
        ]);

        $requestDTO = CreatePaymentRequestDTO::fromArray([
            'amount' => MoneyValue::fromFloat($order->getTotalGross(), $order->getCurrency()),
            'currencyCode' => $order->getCurrency(),
            'account' => $account,
            'order' => $order,
            'description' => Str::limit($description, 500),
        ]);

        $response = $this->mercadoPagoPaymentService->createCheckoutProPreference(
            $requestDTO,
            $successUrl,
            $failureUrl,
            $pendingUrl
        );

        $this->mercadoPagoPaymentsRepository->create([
            'order_id' => $order->getId(),
            'payment_id' => $response->paymentId,
            'payment_type' => 'checkout_pro',
            'status' => 'pending',
            'init_point' => $response->init_point,
            'currency' => $order->getCurrency(),
        ]);

        return [
            'payment_id' => $response->paymentId,
            'init_point' => $response->init_point,
            'status' => $response->status ?? 'pending',
        ];
    }
}
