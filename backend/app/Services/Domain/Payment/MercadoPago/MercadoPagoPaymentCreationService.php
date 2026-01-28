<?php

namespace HiEvents\Services\Domain\Payment\MercadoPago;

use HiEvents\Exceptions\MercadoPago\CreatePaymentFailedException;
use HiEvents\Services\Domain\Payment\MercadoPago\DTOs\CreatePaymentRequestDTO;
use HiEvents\Services\Domain\Payment\MercadoPago\DTOs\CreatePaymentResponseDTO;
use HiEvents\Services\Infrastructure\MercadoPago\MercadoPagoClientFactory;
use Illuminate\Support\Str;
use MercadoPago\Exceptions\MPApiException;
use Psr\Log\LoggerInterface;
use Throwable;

class MercadoPagoPaymentCreationService
{
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly MercadoPagoClientFactory $clientFactory,
    ) {
    }

    /**
     * Cria um pagamento PIX
     * 
     * @throws CreatePaymentFailedException
     */
    public function createPixPayment(CreatePaymentRequestDTO $request): CreatePaymentResponseDTO
    {
        try {
            $paymentClient = $this->clientFactory->createPaymentClient();

            $paymentData = [
                'transaction_amount' => $request->amount->toFloat(),
                'description' => Str::limit($request->description, 500),
                'payment_method_id' => 'pix',
                'payer' => [
                    'email' => $request->payerEmail ?? $request->order->getEmail(),
                    'first_name' => $request->payerName ?? $request->order->getFullName(),
                ],
                'metadata' => [
                    'order_id' => $request->order->getId(),
                    'order_short_id' => $request->order->getShortId(),
                    'event_id' => $request->order->getEventId(),
                ],
            ];

            $payment = $paymentClient->create($paymentData);

            if ($payment->status === 'error') {
                throw new CreatePaymentFailedException(
                    $payment->message ?? __('Failed to create PIX payment')
                );
            }

            $qrCode = null;
            $qrCodeBase64 = null;
            $ticketUrl = null;

            if (isset($payment->point_of_interaction->transaction_data->qr_code)) {
                $qrCode = $payment->point_of_interaction->transaction_data->qr_code;
            }

            if (isset($payment->point_of_interaction->transaction_data->qr_code_base64)) {
                $qrCodeBase64 = $payment->point_of_interaction->transaction_data->qr_code_base64;
            }

            if (isset($payment->point_of_interaction->transaction_data->ticket_url)) {
                $ticketUrl = $payment->point_of_interaction->transaction_data->ticket_url;
            }

            $this->logger->debug('Mercado Pago PIX payment created', [
                'paymentId' => $payment->id,
                'orderShortId' => $request->order->getShortId(),
            ]);

            return new CreatePaymentResponseDTO(
                paymentId: (string) $payment->id,
                qrCode: $qrCode,
                qrCodeBase64: $qrCodeBase64,
                ticketUrl: $ticketUrl,
                status: $payment->status,
            );
        } catch (MPApiException $exception) {
            $this->logger->error("Mercado Pago PIX payment creation failed: {$exception->getMessage()}", [
                'exception' => $exception,
                'request' => $request->toArray(),
            ]);

            throw new CreatePaymentFailedException(
                __('There was an error communicating with the payment provider. Please try again later.')
            );
        } catch (Throwable $exception) {
            $this->logger->error("Mercado Pago PIX payment creation failed: {$exception->getMessage()}", [
                'exception' => $exception,
            ]);

            throw new CreatePaymentFailedException(
                __('There was an error creating the payment. Please try again later.')
            );
        }
    }

    /**
     * Cria uma preferência para Checkout Pro (cartão)
     * 
     * @throws CreatePaymentFailedException
     */
    public function createCheckoutProPreference(CreatePaymentRequestDTO $request, string $successUrl, string $failureUrl, string $pendingUrl): CreatePaymentResponseDTO
    {
        try {
            $preferenceClient = $this->clientFactory->createPreferenceClient();

            $preferenceData = [
                'items' => [
                    [
                        'title' => Str::limit($request->description, 256),
                        'quantity' => 1,
                        'unit_price' => $request->amount->toFloat(),
                        'currency_id' => $this->mapCurrencyToMercadoPago($request->currencyCode),
                    ],
                ],
                'payer' => [
                    'email' => $request->payerEmail ?? $request->order->getEmail(),
                    'name' => $request->payerName ?? $request->order->getFullName(),
                ],
                'back_urls' => [
                    'success' => $successUrl,
                    'failure' => $failureUrl,
                    'pending' => $pendingUrl,
                ],
                'auto_return' => 'approved',
                'payment_methods' => [
                    'installments' => 12, // Permitir até 12x
                    'excluded_payment_types' => [
                        ['id' => 'pix'], // Excluir PIX do Checkout Pro (usar método separado)
                    ],
                ],
                'metadata' => [
                    'order_id' => $request->order->getId(),
                    'order_short_id' => $request->order->getShortId(),
                    'event_id' => $request->order->getEventId(),
                ],
            ];

            $preference = $preferenceClient->create($preferenceData);

            if ($preference->status === 'error') {
                throw new CreatePaymentFailedException(
                    $preference->message ?? __('Failed to create Checkout Pro preference')
                );
            }

            $this->logger->debug('Mercado Pago Checkout Pro preference created', [
                'preferenceId' => $preference->id,
                'orderShortId' => $request->order->getShortId(),
            ]);

            return new CreatePaymentResponseDTO(
                paymentId: (string) $preference->id,
                initPoint: $preference->init_point,
                status: 'pending',
            );
        } catch (MPApiException $exception) {
            $this->logger->error("Mercado Pago Checkout Pro creation failed: {$exception->getMessage()}", [
                'exception' => $exception,
                'request' => $request->toArray(),
            ]);

            throw new CreatePaymentFailedException(
                __('There was an error communicating with the payment provider. Please try again later.')
            );
        } catch (Throwable $exception) {
            $this->logger->error("Mercado Pago Checkout Pro creation failed: {$exception->getMessage()}", [
                'exception' => $exception,
            ]);

            throw new CreatePaymentFailedException(
                __('There was an error creating the payment. Please try again later.')
            );
        }
    }

    private function mapCurrencyToMercadoPago(string $currencyCode): string
    {
        // Mercado Pago usa códigos de moeda específicos
        return match (strtoupper($currencyCode)) {
            'USD' => 'USD',
            'EUR' => 'EUR',
            'BRL' => 'BRL',
            default => 'BRL', // Default para BRL (Brasil)
        };
    }
}
