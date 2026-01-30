<?php

namespace HiEvents\Http\Actions\Orders\Payment\MercadoPago;

use HiEvents\Exceptions\MercadoPago\CreatePaymentFailedException;
use HiEvents\Http\Actions\BaseAction;
use HiEvents\Services\Application\Handlers\Order\Payment\MercadoPago\CreateMercadoPagoPixPaymentHandler;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CreateMercadoPagoPixPaymentActionPublic extends BaseAction
{
    public function __construct(
        private readonly CreateMercadoPagoPixPaymentHandler $handler,
    ) {
    }

    public function __invoke(int $eventId, string $orderShortId): JsonResponse
    {
        try {
            $data = $this->handler->handle($orderShortId);
            return $this->jsonResponse($data);
        } catch (CreatePaymentFailedException $e) {
            return $this->errorResponse($e->getMessage(), Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
