<?php

namespace HiEvents\Services\Application\Handlers\Order\Payment\MercadoPago;

use HiEvents\Services\Domain\Payment\MercadoPago\MercadoPagoPaymentApprovedHandler;
use HiEvents\Services\Infrastructure\MercadoPago\MercadoPagoClientFactory;
use Illuminate\Support\Facades\DB;
use JsonException;
use Psr\Log\LoggerInterface;
use Throwable;

class IncomingWebhookHandler
{
    public function __construct(
        private readonly MercadoPagoPaymentApprovedHandler $approvedHandler,
        private readonly MercadoPagoClientFactory $clientFactory,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * @throws JsonException
     */
    public function handle(string $payload): void
    {
        $data = json_decode($payload, true, 512, JSON_THROW_ON_ERROR);

        $type = $data['type'] ?? null;
        $resourceId = $data['data']['id'] ?? null;

        if (!$type || !$resourceId) {
            $this->logger->warning('Mercado Pago webhook: missing type or data.id', ['payload' => $data]);
            return;
        }

        $externalId = $type . '_' . $resourceId;

        if ($this->hasEventBeenProcessed($externalId)) {
            $this->logger->debug('Mercado Pago webhook already processed', ['external_id' => $externalId]);
            return;
        }

        try {
            if ($type === 'payment') {
                $this->processPaymentNotification((string) $resourceId, $externalId);
            }
            // merchant_order, preference, etc. can be handled here if needed
        } catch (Throwable $e) {
            $this->logger->error('Mercado Pago webhook processing failed: ' . $e->getMessage(), [
                'external_id' => $externalId,
                'exception' => $e,
            ]);
            $this->markWebhookEvent($externalId, 'failed', $e->getMessage(), $data);
            throw $e;
        }
    }

    private function processPaymentNotification(string $paymentId, string $externalId): void
    {
        $paymentClient = $this->clientFactory->createPaymentClient();
        $payment = $paymentClient->get($paymentId);

        if (!$payment || isset($payment->status) && $payment->status === 'error') {
            $this->logger->warning('Mercado Pago payment not found or error', ['payment_id' => $paymentId]);
            $this->markWebhookEvent($externalId, 'processed', null, ['payment_id' => $paymentId]);
            return;
        }

        $status = $payment->status ?? null;
        $amountReceived = null;
        if (isset($payment->transaction_amount)) {
            $amountReceived = (int) round((float) $payment->transaction_amount * 100);
        }
        $preferenceId = $payment->preference_id ?? null;

        if ($status === 'approved') {
            $this->approvedHandler->handle($paymentId, $preferenceId, $amountReceived);
        }

        $this->markWebhookEvent($externalId, 'processed', null, [
            'payment_id' => $paymentId,
            'status' => $status,
        ]);
    }

    private function hasEventBeenProcessed(string $externalId): bool
    {
        return DB::table('webhook_events')
            ->where('external_id', $externalId)
            ->where('provider', 'mercadopago')
            ->where('status', 'processed')
            ->exists();
    }

    private function markWebhookEvent(string $externalId, string $status, ?string $errorMessage, array $payload): void
    {
        if ($this->hasEventBeenProcessed($externalId) && $status === 'processed') {
            return;
        }

        $exists = DB::table('webhook_events')->where('external_id', $externalId)->exists();
        if ($exists) {
            DB::table('webhook_events')->where('external_id', $externalId)->update([
                'payload' => json_encode($payload),
                'status' => $status,
                'error_message' => $errorMessage,
                'processed_at' => $status === 'processed' ? now() : null,
                'updated_at' => now(),
            ]);
        } else {
            DB::table('webhook_events')->insert([
                'external_id' => $externalId,
                'provider' => 'mercadopago',
                'event_type' => 'payment.notification',
                'payload' => json_encode($payload),
                'status' => $status,
                'error_message' => $errorMessage,
                'processed_at' => $status === 'processed' ? now() : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
