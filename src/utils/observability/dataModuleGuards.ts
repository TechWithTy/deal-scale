import type { DataModuleKey } from "@/data/__generated__/manifest";
import type { DataModuleStatus } from "@/stores/useDataModuleStore";

const DEFAULT_ENDPOINT = "/api/internal/data-guards";

const resolveEndpoint = () => {
        const envValue = process.env.NEXT_PUBLIC_DATA_GUARD_ENDPOINT?.trim();
        return envValue && envValue.length > 0 ? envValue : DEFAULT_ENDPOINT;
};

const endpoint = resolveEndpoint();

export interface DataModuleGuardEvent {
        readonly key: DataModuleKey;
        readonly surface: string;
        readonly status: DataModuleStatus;
        readonly hasData: boolean;
        readonly error?: string;
        readonly detail?: Record<string, unknown>;
}

export function reportDataModuleGuard(event: DataModuleGuardEvent): void {
        if (typeof window === "undefined") {
                return;
        }

        const payload = {
                ...event,
                timestamp: Date.now(),
                environment: process.env.NODE_ENV,
        };

        const body = JSON.stringify(payload);

        try {
                if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
                        const beaconSent = navigator.sendBeacon(endpoint, body);
                        if (beaconSent) {
                                return;
                        }
                }
        } catch {
                // Ignore beacon errors and fall back to fetch.
        }

        void fetch(endpoint, {
                method: "POST",
                body,
                headers: { "Content-Type": "application/json" },
                keepalive: true,
        }).catch(() => {
                // Metrics transport failures should not surface to users.
        });
}
