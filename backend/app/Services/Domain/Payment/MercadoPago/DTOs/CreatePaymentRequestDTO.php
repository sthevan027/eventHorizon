<?php

namespace HiEvents\Services\Domain\Payment\MercadoPago\DTOs;

use HiEvents\DomainObjects\AccountDomainObject;
use HiEvents\DomainObjects\OrderDomainObject;
use HiEvents\Values\MoneyValue;
use Spatie\LaravelData\Data;

class CreatePaymentRequestDTO extends Data
{
    public function __construct(
        public MoneyValue $amount,
        public string $currencyCode,
        public AccountDomainObject $account,
        public OrderDomainObject $order,
        public string $description,
        public ?string $payerEmail = null,
        public ?string $payerName = null,
        public ?string $paymentMethodId = null, // 'pix' or 'card'
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            amount: $data['amount'],
            currencyCode: $data['currencyCode'],
            account: $data['account'],
            order: $data['order'],
            description: $data['description'],
            payerEmail: $data['payerEmail'] ?? null,
            payerName: $data['payerName'] ?? null,
            paymentMethodId: $data['paymentMethodId'] ?? null,
        );
    }
}
