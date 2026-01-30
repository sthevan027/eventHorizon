import { useParams } from "react-router";
import { useCreateMercadoPagoPix } from "../../../../../../queries/useCreateMercadoPagoPix.ts";
import { CheckoutContent } from "../../../../../layouts/Checkout/CheckoutContent";
import { HomepageInfoMessage } from "../../../../../common/HomepageInfoMessage";
import { t } from "@lingui/macro";
import { eventHomepagePath } from "../../../../../../utilites/urlHelper.ts";
import { LoadingMask } from "../../../../../common/LoadingMask";
import { Event } from "../../../../../../types.ts";
import { useGetEventPublic } from "../../../../../../queries/useGetEventPublic.ts";
import { Card, Text, Button, Group, CopyButton, Tooltip, Stack, Divider } from "@mantine/core";
import { orderClientPublic } from "../../../../../../api/order.client.ts";
import { useState, useEffect } from "react";
import { showError } from "../../../../../../utilites/notifications.tsx";

interface MercadoPagoPaymentMethodProps {
    enabled: boolean;
    setSubmitHandler: (submitHandler: () => () => Promise<void>) => void;
}

export const MercadoPagoPaymentMethod = ({ enabled, setSubmitHandler }: MercadoPagoPaymentMethodProps) => {
    const { eventId, orderShortId } = useParams();
    const { data: event } = useGetEventPublic(eventId);
    const [loadingCard, setLoadingCard] = useState(false);
    const {
        data: pixData,
        isFetched: isPixFetched,
        error: pixError,
        refetch: refetchPix,
    } = useCreateMercadoPagoPix(eventId, orderShortId, enabled);

    const handlePayWithCard = async () => {
        if (!eventId || !orderShortId) return;
        setLoadingCard(true);
        try {
            const data = await orderClientPublic.createMercadoPagoPreference(Number(eventId), orderShortId);
            if (data?.init_point) {
                window.location.href = data.init_point;
                return;
            }
        } catch (err: unknown) {
            showError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || t`Could not open payment page. Try again.`);
        } finally {
            setLoadingCard(false);
        }
    };

    useEffect(() => {
        setSubmitHandler(() => async () => {
            await refetchPix();
        });
    }, [setSubmitHandler, refetchPix]);

    if (!enabled) {
        return (
            <CheckoutContent>
                <HomepageInfoMessage
                    status="warning"
                    message={t`Payments not available`}
                    subtitle={t`Mercado Pago is not enabled for this event.`}
                    link={eventHomepagePath(event as Event)}
                    linkText={t`Return to Event`}
                />
            </CheckoutContent>
        );
    }

    if (pixError && event) {
        return (
            <CheckoutContent>
                <HomepageInfoMessage
                    status="error"
                    message={(pixError as { response?: { data?: { message?: string } } })?.response?.data?.message || t`Something went wrong`}
                    subtitle={t`Please restart the checkout process.`}
                    link={eventHomepagePath(event)}
                    linkText={t`Return to Event`}
                />
            </CheckoutContent>
        );
    }

    if (!isPixFetched || !pixData) {
        return <LoadingMask />;
    }

    return (
        <Stack gap="md">
            <Card withBorder padding="md">
                <Text size="sm" fw={600} mb="xs">{t`PIX`}</Text>
                <Text size="xs" c="dimmed" mb="sm">{t`Scan the QR code or copy the PIX code in your banking app.`}</Text>
                {pixData.qr_code_base64 && (
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <img
                            src={`data:image/png;base64,${pixData.qr_code_base64}`}
                            alt="PIX QR Code"
                            style={{ maxWidth: 220, height: "auto" }}
                        />
                    </div>
                )}
                {pixData.qr_code && (
                    <Group justify="center" gap="xs">
                        <CopyButton value={pixData.qr_code}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? t`Copied` : t`Copy PIX code`}>
                                    <Button size="xs" variant="light" onClick={copy}>
                                        {copied ? t`Copied` : t`Copy PIX code`}
                                    </Button>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Group>
                )}
                {pixData.ticket_url && (
                    <Button component="a" href={pixData.ticket_url} target="_blank" rel="noopener noreferrer" variant="subtle" size="xs" mt="xs">
                        {t`Open PIX in new tab`}
                    </Button>
                )}
            </Card>
            <Divider label={t`Or`} labelPosition="center" />
            <Button
                fullWidth
                variant="light"
                loading={loadingCard}
                onClick={handlePayWithCard}
            >
                {t`Pay with card (Mercado Pago)`}
            </Button>
        </Stack>
    );
};
