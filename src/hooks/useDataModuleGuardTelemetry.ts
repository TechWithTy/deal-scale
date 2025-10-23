import { useEffect, useRef } from "react";

import type { DataModuleKey } from "@/data/__generated__/manifest";
import type { DataModuleStatus } from "@/stores/useDataModuleStore";
import { reportDataModuleGuard } from "@/utils/observability/dataModuleGuards";

interface GuardDetail {
        readonly [key: string]: unknown;
}

interface GuardOptions {
        readonly key: DataModuleKey;
        readonly surface: string;
        readonly status: DataModuleStatus;
        readonly hasData: boolean;
        readonly error?: unknown;
        readonly detail?: GuardDetail;
}

function toErrorMessage(error: unknown): string | undefined {
        if (!error) {
                return undefined;
        }

        if (error instanceof Error) {
                return error.message;
        }

        if (typeof error === "string") {
                return error;
        }

        try {
                return JSON.stringify(error);
        } catch {
                return String(error);
        }
}

function createSignature({
        status,
        hasData,
        errorMessage,
        detail,
}: {
        status: DataModuleStatus;
        hasData: boolean;
        errorMessage?: string;
        detail?: GuardDetail;
}): string {
        const detailString = detail ? JSON.stringify(detail) : "";
        return [status, hasData ? "1" : "0", errorMessage ?? "", detailString].join("|");
}

export function useDataModuleGuardTelemetry({
        key,
        surface,
        status,
        hasData,
        error,
        detail,
}: GuardOptions): void {
        const lastSignature = useRef<string | null>(null);

        useEffect(() => {
                const errorMessage = toErrorMessage(error);
                const shouldReport =
                        status === "error" ||
                        status === "loading" ||
                        status === "idle" ||
                        (status === "ready" && !hasData);

                const signature = createSignature({ status, hasData, errorMessage, detail });

                if (!shouldReport) {
                        lastSignature.current = signature;
                        return;
                }

                if (lastSignature.current === signature) {
                        return;
                }

                reportDataModuleGuard({
                        key,
                        surface,
                        status,
                        hasData,
                        error: errorMessage,
                        detail,
                });

                lastSignature.current = signature;
        }, [detail, error, hasData, key, status, surface]);
}
