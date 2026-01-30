<?php

namespace HiEvents\Repository\Eloquent;

use HiEvents\DomainObjects\MercadoPagoPaymentDomainObject;
use HiEvents\Models\MercadoPagoPayment;
use HiEvents\Repository\Interfaces\MercadoPagoPaymentsRepositoryInterface;

class MercadoPagoPaymentsRepository extends BaseRepository implements MercadoPagoPaymentsRepositoryInterface
{
    protected function getModel(): string
    {
        return MercadoPagoPayment::class;
    }

    public function getDomainObject(): string
    {
        return MercadoPagoPaymentDomainObject::class;
    }
}
