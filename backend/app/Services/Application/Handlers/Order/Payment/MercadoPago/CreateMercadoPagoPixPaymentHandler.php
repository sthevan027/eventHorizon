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
use Illuminate\Support\Str;
use Throwable;

readonly class CreateMercadoPagoPixPaymentHandler
{
    public function __construct(
        private OrderRepositoryInterface $orderRepository,
        private MercadoPagoPaymentCreationService $mercadoPagoPaymentService,
        private CheckoutSessionManagementService $sessionIdentifierService,
        private MercadoPagoPaymentsRepositoryInterface $mercadoPagoPaymentsRepository,
        private AccountRepositoryInterface $accountRepository,
    ) {
    }

    /**
     * @throws CreatePaymentFailedException
     * @throws ResourceConflictException
     * @throws UnauthorizedException
     * @throws Throwable
     */
    public function handle(string $orderShortId): array
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

        $account = $this->accountRepository->findByEventId($order->getEventId());
        if (!$account) {
            throw new ResourceConflictException(__('Account not found for this event.'));
        }

        $existing = $this->mercadoPagoPaymentsRepository->findFirstWhere([
            'order_id' => $order->getId(),
            'payment_type' => 'pix',
            'status' => 'pending',
        ]);

        if ($existing && $existing->getPaymentId()) {
            return [
                'payment_id' => $existing->getPaymentId(),
                'qr_code' => $existing->qr_code,
                'qr_code_base64' => $existing->qr_code_base64,
                'ticket_url' => $existing->ticket_url,
                'status' => $existing->getStatus(),
            ];
        }

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

        $response = $this->mercadoPagoPaymentService->createPixPayment($requestDTO);

        $this->mercadoPagoPaymentsRepository->create([
            'order_id' => $order->getId(),
            'payment_id' => $response->paymentId,
            'payment_type' => 'pix',
            'status' => $response->status ?? 'pending',
            'qr_code' => $response->qrCode,
            'qr_code_base64' => $response->qrCodeBase64,
            'ticket_url' => $response->ticketUrl,
            'currency' => $order->getCurrency(),
        ]);

        return [
            'payment_id' => $response->paymentId,
            'qr_code' => $response->qrCode,
            'qr_code_base64' => $response->qrCodeBase64,
            'ticket_url' => $response->ticketUrl,
            'status' => $response->status,
        ];
    }
}
