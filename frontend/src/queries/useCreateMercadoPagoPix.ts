import { useQuery } from "@tanstack/react-query";
import { orderClientPublic } from "../api/order.client.ts";
import { IdParam } from "../types.ts";

export const GET_MERCADOPAGO_PIX_QUERY_KEY = "getMercadoPagoPix";

export const useCreateMercadoPagoPix = (eventId: IdParam, orderShortId: IdParam, enabled: boolean) => {
    return useQuery({
        queryKey: [GET_MERCADOPAGO_PIX_QUERY_KEY, eventId, orderShortId],
        queryFn: async () => {
            return orderClientPublic.createMercadoPagoPix(Number(eventId), String(orderShortId));
        },
        enabled: !!eventId && !!orderShortId && enabled,
        retry: false,
        staleTime: 0,
        gcTime: 0,
    });
};
