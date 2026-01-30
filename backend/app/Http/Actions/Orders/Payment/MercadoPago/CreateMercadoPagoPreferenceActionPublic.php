<?php

namespace HiEvents\Http\Actions\Orders\Payment\MercadoPago;

use HiEvents\Exceptions\MercadoPago\CreatePaymentFailedException;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Services\Application\Handlers\Order\Payment\MercadoPago\CreateMercadoPagoPreferenceHandler;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CreateMercadoPagoPreferenceActionPublic extends BaseAction
{
    public function __construct(
        private readonly CreateMercadoPagoPreferenceHandler $handler,
    ) {
    }

    public function __invoke(int $eventId, string $orderShortId): JsonResponse
    {
        try {
            $data = $this->handler->handle($orderShortId, $eventId);
            return $this->jsonResponse($data);
        } catch (CreatePaymentFailedException $e) {
            return $this->errorResponse($e->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
