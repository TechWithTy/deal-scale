import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
        AnalyticsConfig,
        AnalyticsField,
        AnalyticsIssue,
} from "@/lib/analytics/config";

import { useDeferredLoad } from "./useDeferredLoad";

const Analytics = dynamic(
        () =>
                import("@/components/analytics/Analytics").then((mod) => ({
                        default: mod.Analytics,
                })),
        {
                ssr: false,
                loading: () => null,
        },
);

declare global {
        interface Window {
                $zoho?: {
                        salesiq?: {
                                widgetcode: string;
                                values: Record<string, unknown>;
                                ready: () => void;
                        };
                        support?: {
                                widgetcode: string;
                                values: Record<string, unknown>;
                                ready: () => void;
                        };
                };
        }
}

const DEFAULT_RETRY_DELAY_MS = 2000;
const DEFAULT_MAX_RETRIES = 3;

const warnLog = (message: string, data?: unknown) => {
        console.warn("DeferredThirdParties", message, data);
};

const MicrosoftClarityScript = ({ projectId }: { projectId?: string }) => {
        useEffect(() => {
                if (!projectId || typeof window === "undefined") {
                        return;
                }

                if (document.getElementById("clarity-script")) {
                        return;
                }

                const script = document.createElement("script");
                script.id = "clarity-script";
                script.type = "text/javascript";
                script.innerHTML = `
                        (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "${projectId}");
                `;
                document.head.appendChild(script);

                return () => {
                        document.getElementById("clarity-script")?.remove();
                };
        }, [projectId]);

        return null;
};

function useZohoLoader(enabled: boolean, zohoCode?: string) {
        useEffect(() => {
                if (!enabled || !zohoCode || typeof window === "undefined") {
                        return;
                }

                if (document.getElementById("zsiqscript")) {
                        return;
                }

                window.$zoho = window.$zoho || {};
                window.$zoho.salesiq = window.$zoho.salesiq || {
                        widgetcode: "",
                        values: {},
                        ready: () => undefined,
                };

                const script = document.createElement("script");
                script.id = "zsiqscript";
                script.src = `https://salesiq.zohopublic.com/widget?wc=${zohoCode}`;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);

                return () => {
                        document.getElementById("zsiqscript")?.remove();
                };
        }, [enabled, zohoCode]);
}

interface ProviderResponse extends AnalyticsConfig {
        warnings?: AnalyticsIssue[];
        fallbacksUsed?: Partial<Record<AnalyticsField, boolean>>;
}

interface DeferredThirdPartiesProps {
        clarityProjectId?: string;
        zohoWidgetCode?: string;
        retryDelayMs?: number;
        maxRetries?: number;
        maxWaitMs?: number;
}

export function DeferredThirdParties({
        clarityProjectId,
        zohoWidgetCode,
        retryDelayMs = DEFAULT_RETRY_DELAY_MS,
        maxRetries = DEFAULT_MAX_RETRIES,
        maxWaitMs,
}: DeferredThirdPartiesProps) {
        const shouldLoad = useDeferredLoad(maxWaitMs);
        const [providerData, setProviderData] = useState<ProviderResponse | null>(null);
        const [attempt, setAttempt] = useState(0);
        const retryTimerRef = useRef<number | null>(null);
        const hasPreconfiguredIds = Boolean(clarityProjectId || zohoWidgetCode);
        const activated = shouldLoad || hasPreconfiguredIds;

        useEffect(() => {
                return () => {
                        if (retryTimerRef.current) {
                                window.clearTimeout(retryTimerRef.current);
                                retryTimerRef.current = null;
                        }
                };
        }, []);

        useEffect(() => {
                if (activated) {
                        setAttempt(0);
                }
        }, [activated]);

        const scheduleRetry = useCallback(() => {
                if (typeof window === "undefined") {
                        return;
                }

                if (retryTimerRef.current) {
                        window.clearTimeout(retryTimerRef.current);
                }

                retryTimerRef.current = window.setTimeout(() => {
                        setAttempt((prev) => {
                                if (prev >= maxRetries) {
                                        return prev;
                                }

                                return prev + 1;
                        });
                        retryTimerRef.current = null;
                }, retryDelayMs);
        }, [maxRetries, retryDelayMs]);

        useEffect(() => {
                if (!activated || providerData || attempt > maxRetries) {
                        return;
                }

                let isCancelled = false;
                const controller = new AbortController();

                const fetchProviders = async () => {
                        try {
                                const response = await fetch("/api/init-providers", {
                                        cache: "no-store",
                                        signal: controller.signal,
                                });
                                const payload = await response.json();

                                if (!response.ok || payload.error) {
                                        throw { status: response.status, body: payload };
                                }

                                if (isCancelled) {
                                        return;
                                }

                                setProviderData(payload as ProviderResponse);

                                if (Array.isArray(payload.warnings)) {
                                        for (const issue of payload.warnings) {
                                                warnLog(issue.message, issue);
                                        }
                                }
                        } catch (error) {
                                if (isCancelled) {
                                        return;
                                }

                                warnLog("Failed to load provider configuration.", error);
                                if (attempt < maxRetries) {
                                        scheduleRetry();
                                }
                        }
                };

                fetchProviders();

                return () => {
                        isCancelled = true;
                        controller.abort();
                };
        }, [activated, attempt, maxRetries, providerData, scheduleRetry]);

        const clarityId = providerData?.clarityId ?? clarityProjectId;
        const zohoCode = providerData?.zohoCode ?? zohoWidgetCode;
        const analyticsConfig = useMemo<Pick<AnalyticsConfig, "gaId" | "gtmId">>(() => ({
                gaId: providerData?.gaId,
                gtmId: providerData?.gtmId,
        }), [providerData?.gaId, providerData?.gtmId]);

        const shouldRender = Boolean(analyticsConfig.gaId || analyticsConfig.gtmId || clarityId || zohoCode);

        useZohoLoader(shouldRender, zohoCode);

        if (!shouldRender) {
                return null;
        }

        return (
                <>
                        <Analytics config={analyticsConfig} />
                        <MicrosoftClarityScript projectId={clarityId} />
                </>
        );
}
