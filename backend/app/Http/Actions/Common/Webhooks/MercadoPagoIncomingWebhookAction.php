<?php

namespace HiEvents\Http\Actions\Common\Webhooks;

use HiEvents\Http\Actions\BaseAction;
use HiEvents\Http\ResponseCodes;
use HiEvents\Services\Application\Handlers\Order\Payment\MercadoPago\IncomingWebhookHandler;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use JsonException;
use Throwable;

class MercadoPagoIncomingWebhookAction extends BaseAction
{
    public function __construct(
        private readonly IncomingWebhookHandler $webhookHandler,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        try {
            $payload = $request->getContent();
            $this->webhookHandler->handle($payload);
        } catch (JsonException $e) {
            logger()->error('Invalid Mercado Pago webhook payload: ' . $e->getMessage());
            return $this->noContentResponse(ResponseCodes::HTTP_BAD_REQUEST);
        } catch (Throwable $exception) {
            logger()->error($exception->getMessage(), $exception->getTrace());
            return $this->noContentResponse(ResponseCodes::HTTP_BAD_REQUEST);
        }

        return $this->noContentResponse();
    }
}
