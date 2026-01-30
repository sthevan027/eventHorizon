<?php

namespace HiEvents\Services\Domain\Payment\MercadoPago;

use Carbon\Carbon;
use HiEvents\DomainObjects\Enums\PaymentProviders;
use HiEvents\DomainObjects\EventSettingDomainObject;
use HiEvents\DomainObjects\Generated\EventSettingDomainObjectAbstract;
use HiEvents\DomainObjects\Generated\OrderDomainObjectAbstract;
use HiEvents\DomainObjects\MercadoPagoPaymentDomainObject;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\DomainObjects\OrderItemDomainObject;
use HiEvents\DomainObjects\Status\AttendeeStatus;
use HiEvents\DomainObjects\Status\OrderPaymentStatus;
use HiEvents\DomainObjects\Status\OrderStatus;
use HiEvents\Events\OrderStatusChangedEvent;
use HiEvents\Exceptions\CannotAcceptPaymentException;
use HiEvents\Repository\Eloquent\Value\Relationship;
use HiEvents\Repository\Interfaces\AffiliateRepositoryInterface;
use HiEvents\Repository\Interfaces\AttendeeRepositoryInterface;
use HiEvents\Repository\Interfaces\EventSettingsRepositoryInterface;
use HiEvents\Repository\Interfaces\MercadoPagoPaymentsRepositoryInterface;
use HiEvents\Repository\Interfaces\OrderRepositoryInterface;
use HiEvents\Services\Domain\Product\ProductQuantityUpdateService;
use HiEvents\Services\Infrastructure\DomainEvents\DomainEventDispatcherService;
use HiEvents\Services\Infrastructure\DomainEvents\Enums\DomainEventType;
use HiEvents\Services\Infrastructure\DomainEvents\Events\OrderEvent;
use Illuminate\Cache\Repository;
use Illuminate\Database\DatabaseManager;
use Psr\Log\LoggerInterface;
use Throwable;

class MercadoPagoPaymentApprovedHandler
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly MercadoPagoPaymentsRepositoryInterface $mercadoPagoPaymentsRepository,
        private readonly AffiliateRepositoryInterface $affiliateRepository,
        private readonly ProductQuantityUpdateService $quantityUpdateService,
        private readonly AttendeeRepositoryInterface $attendeeRepository,
        private readonly DatabaseManager $databaseManager,
        private readonly LoggerInterface $logger,
        private readonly Repository $cache,
        private readonly DomainEventDispatcherService $domainEventDispatcherService,
        private readonly EventSettingsRepositoryInterface $eventSettingsRepository,
    ) {
    }

    /**
     * @throws Throwable
     */
    public function handle(string $paymentId, ?string $preferenceId = null, ?int $amountReceived = null): void
    {
        $cacheKey = $paymentId . ($preferenceId ? "_$preferenceId" : '');
        if ($this->isPaymentAlreadyHandled($cacheKey)) {
            $this->logger->info('Mercado Pago payment already handled', ['payment_id' => $paymentId]);
            return;
        }

        $this->databaseManager->transaction(function () use ($paymentId, $preferenceId, $amountReceived, $cacheKey) {
            $mpPayment = $this->mercadoPagoPaymentsRepository
                ->loadRelation(new Relationship(OrderDomainObject::class, name: 'order'))
                ->findFirstWhere(['payment_id' => $paymentId]);

            if (!$mpPayment && $preferenceId) {
                $mpPayment = $this->mercadoPagoPaymentsRepository
                    ->loadRelation(new Relationship(OrderDomainObject::class, name: 'order'))
                    ->findFirstWhere(['payment_id' => $preferenceId]);
            }

            if (!$mpPayment) {
                $this->logger->error('Mercado Pago payment not found when handling approved event', [
                    'payment_id' => $paymentId,
                    'preference_id' => $preferenceId,
                ]);
                return;
            }

            $this->validatePaymentAndOrderStatus($mpPayment);

            $this->mercadoPagoPaymentsRepository->updateWhere(
                attributes: [
                    'status' => 'approved',
                    'amount_received' => $amountReceived,
                ],
                where: [
                    'payment_id' => $mpPayment->getPaymentId(),
                    'order_id' => $mpPayment->getOrderId(),
                ]
            );

            $updatedOrder = $this->updateOrderStatuses($mpPayment);
            $this->updateAttendeeStatuses($updatedOrder);
            $this->quantityUpdateService->updateQuantitiesFromOrder($updatedOrder);

            /** @var EventSettingDomainObject|null $eventSettings */
            $eventSettings = $this->eventSettingsRepository->findFirstWhere([
                EventSettingDomainObjectAbstract::EVENT_ID => $updatedOrder->getEventId(),
            ]);

            event(new OrderStatusChangedEvent($updatedOrder, createInvoice: $eventSettings?->getEnableInvoicing() ?? false));

            $this->domainEventDispatcherService->dispatch(
                new OrderEvent(
                    type: DomainEventType::ORDER_CREATED,
                    orderId: $updatedOrder->getId()
                ),
            );

            $this->markPaymentAsHandled($paymentId, $updatedOrder);
        });
    }

    private function updateOrderStatuses(MercadoPagoPaymentDomainObject $mpPayment): OrderDomainObject
    {
        $updatedOrder = $this->orderRepository
            ->loadRelation(OrderItemDomainObject::class)
            ->updateFromArray($mpPayment->getOrderId(), [
                OrderDomainObjectAbstract::PAYMENT_STATUS => OrderPaymentStatus::PAYMENT_RECEIVED->name,
                OrderDomainObjectAbstract::STATUS => OrderStatus::COMPLETED->name,
                OrderDomainObjectAbstract::PAYMENT_PROVIDER => PaymentProviders::MERCADOPAGO->value,
            ]);

        if ($updatedOrder->getAffiliateId()) {
            $this->affiliateRepository->incrementSales(
                affiliateId: $updatedOrder->getAffiliateId(),
                amount: $updatedOrder->getTotalGross()
            );
        }

        return $updatedOrder;
    }

    private function validatePaymentAndOrderStatus(MercadoPagoPaymentDomainObject $mpPayment): void
    {
        $order = $mpPayment->getOrder();
        if (!$order) {
            $order = $this->orderRepository->findById($mpPayment->getOrderId());
        }

        if (!in_array($order->getPaymentStatus(), [
            OrderPaymentStatus::AWAITING_PAYMENT->name,
            OrderPaymentStatus::PAYMENT_FAILED->name,
        ], true)) {
            throw new CannotAcceptPaymentException(
                __('Order is not awaiting payment. Order: :id', ['id' => $mpPayment->getOrderId()])
            );
        }

        if ((new Carbon($order->getReservedUntil()))->isPast()) {
            throw new CannotAcceptPaymentException(
                __('Payment was successful, but order has expired. Order: :id', ['id' => $mpPayment->getOrderId()])
            );
        }
    }

    private function updateAttendeeStatuses(OrderDomainObject $updatedOrder): void
    {
        $this->attendeeRepository->updateWhere(
            attributes: ['status' => AttendeeStatus::ACTIVE->name],
            where: [
                'order_id' => $updatedOrder->getId(),
                'status' => AttendeeStatus::AWAITING_PAYMENT->name,
            ],
        );
    }

    private function markPaymentAsHandled(string $cacheKey, OrderDomainObject $updatedOrder): void
    {
        $this->logger->info('Mercado Pago payment approved event handled', [
            'cache_key' => $cacheKey,
            'order_id' => $updatedOrder->getId(),
        ]);
        $this->cache->put('mercado_pago_payment_handled_' . $cacheKey, true, 3600);
    }

    private function isPaymentAlreadyHandled(string $cacheKey): bool
    {
        return $this->cache->has('mercado_pago_payment_handled_' . $cacheKey);
    }
}
