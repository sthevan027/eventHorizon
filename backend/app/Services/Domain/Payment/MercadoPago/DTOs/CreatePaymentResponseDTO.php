<?php

namespace HiEvents\Services\Domain\Payment\MercadoPago\DTOs;

use Spatie\LaravelData\Data;

class CreatePaymentResponseDTO extends Data
{
    public function __construct(
        public string $paymentId,
        public ?string $qrCode = null,
        public ?string $qrCodeBase64 = null,
        public ?string $ticketUrl = null,
        public ?string $initPoint = null, // Para Checkout Pro
        public ?string $status = null,
    ) {
    }
}
