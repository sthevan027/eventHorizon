<?php

namespace HiEvents\DomainObjects;

use HiEvents\DomainObjects\Interfaces\DomainObjectInterface;

class MercadoPagoPaymentDomainObject implements DomainObjectInterface
{
    public ?int $id = null;
    public ?int $order_id = null;
    public ?string $payment_id = null;
    public ?string $payment_type = null;
    public ?string $status = null;
    public ?string $qr_code = null;
    public ?string $qr_code_base64 = null;
    public ?string $ticket_url = null;
    public ?string $init_point = null;
    public ?int $amount_received = null;
    public ?string $currency = null;
    public ?array $metadata = null;
    public ?array $last_error = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;
    public ?string $deleted_at = null;

    public ?OrderDomainObject $order = null;

    public static function hydrate($data): DomainObjectInterface
    {
        if ($data instanceof \Illuminate\Database\Eloquent\Model) {
            return self::hydrateFromArray($data->toArray());
        }
        if (is_array($data)) {
            return self::hydrateFromArray($data);
        }
        throw new \InvalidArgumentException(sprintf('Cannot hydrate from type %s', gettype($data)));
    }

    public static function hydrateFromArray(array $array): DomainObjectInterface
    {
        $obj = new self();
        foreach ($array as $key => $value) {
            $setter = 'set' . str_replace('_', '', ucwords($key, '_'));
            if (method_exists($obj, $setter)) {
                $obj->{$setter}($value);
            } elseif (property_exists($obj, $key)) {
                $obj->{$key} = $value;
            }
        }
        return $obj;
    }

    public function setId(?int $id): self { $this->id = $id; return $this; }
    public function setOrderId(?int $orderId): self { $this->order_id = $orderId; return $this; }
    public function setPaymentId(?string $paymentId): self { $this->payment_id = $paymentId; return $this; }
    public function setPaymentType(?string $paymentType): self { $this->payment_type = $paymentType; return $this; }
    public function setStatus(?string $status): self { $this->status = $status; return $this; }
    public function setQrCode(?string $qrCode): self { $this->qr_code = $qrCode; return $this; }
    public function setQrCodeBase64(?string $qrCodeBase64): self { $this->qr_code_base64 = $qrCodeBase64; return $this; }
    public function setTicketUrl(?string $ticketUrl): self { $this->ticket_url = $ticketUrl; return $this; }
    public function setInitPoint(?string $initPoint): self { $this->init_point = $initPoint; return $this; }
    public function setAmountReceived(?int $amountReceived): self { $this->amount_received = $amountReceived; return $this; }
    public function setCurrency(?string $currency): self { $this->currency = $currency; return $this; }
    public function setMetadata(?array $metadata): self { $this->metadata = $metadata; return $this; }
    public function setLastError(?array $lastError): self { $this->last_error = $lastError; return $this; }
    public function setCreatedAt(?string $createdAt): self { $this->created_at = $createdAt; return $this; }
    public function setUpdatedAt(?string $updatedAt): self { $this->updated_at = $updatedAt; return $this; }
    public function setDeletedAt(?string $deletedAt): self { $this->deleted_at = $deletedAt; return $this; }

    public function getOrderId(): ?int { return $this->order_id; }
    public function getOrder(): ?OrderDomainObject { return $this->order; }
    public function setOrder(?OrderDomainObject $order): self { $this->order = $order; return $this; }
    public function getPaymentId(): ?string { return $this->payment_id; }
    public function getStatus(): ?string { return $this->status; }
}
