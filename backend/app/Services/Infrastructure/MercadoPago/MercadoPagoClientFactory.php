<?php

namespace HiEvents\Services\Infrastructure\MercadoPago;

use HiEvents\Exceptions\MercadoPago\MercadoPagoClientConfigurationException;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

class MercadoPagoClientFactory
{
    public function __construct(
        private readonly MercadoPagoConfigurationService $configurationService
    ) {
    }

    /**
     * @throws MercadoPagoClientConfigurationException
     */
    public function createPaymentClient(): PaymentClient
    {
        $accessToken = $this->configurationService->getAccessToken();

        if (empty($accessToken)) {
            throw new MercadoPagoClientConfigurationException(
                __('Mercado Pago access token not configured')
            );
        }

        MercadoPagoConfig::setAccessToken($accessToken);

        return new PaymentClient();
    }

    /**
     * @throws MercadoPagoClientConfigurationException
     */
    public function createPreferenceClient(): PreferenceClient
    {
        $accessToken = $this->configurationService->getAccessToken();

        if (empty($accessToken)) {
            throw new MercadoPagoClientConfigurationException(
                __('Mercado Pago access token not configured')
            );
        }

        MercadoPagoConfig::setAccessToken($accessToken);

        return new PreferenceClient();
    }
}
