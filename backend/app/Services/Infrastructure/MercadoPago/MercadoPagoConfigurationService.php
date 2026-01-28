<?php

namespace HiEvents\Services\Infrastructure\MercadoPago;

use Illuminate\Config\Repository;

class MercadoPagoConfigurationService
{
    public function __construct(
        private readonly Repository $config
    ) {
    }

    public function getAccessToken(): ?string
    {
        return $this->config->get('services.mercadopago.access_token');
    }

    public function getPublicKey(): ?string
    {
        return $this->config->get('services.mercadopago.public_key');
    }

    public function getWebhookSecret(): ?string
    {
        return $this->config->get('services.mercadopago.webhook_secret');
    }

    public function isEnabled(): bool
    {
        $accessToken = $this->getAccessToken();
        return !empty($accessToken);
    }
}
