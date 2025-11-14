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
	return [status, hasData ? "1" : "0", errorMessage ?? "", detailString].join(
		"|",
	);
}

export function useDataModuleGuardTelemetry({
	key,
	surface,
	status,
	hasData,
	error,
	detail,
}: GuardOptions): void {
	console.log(
		`[useDataModuleGuardTelemetry] Hook starting for key: "${key}", surface: "${surface}"`,
	);
	console.log(`[useDataModuleGuardTelemetry] Hook 1: useRef(lastSignature)`);
	const lastSignature = useRef<string | null>(null);

	console.log(`[useDataModuleGuardTelemetry] Hook 2: useEffect`);
	useEffect(() => {
		console.log(
			`[useDataModuleGuardTelemetry] useEffect executing for key: "${key}"`,
			{ status, hasData },
		);
		const errorMessage = toErrorMessage(error);
		const shouldReport =
			status === "error" ||
			status === "loading" ||
			status === "idle" ||
			(status === "ready" && !hasData);

		const signature = createSignature({
			status,
			hasData,
			errorMessage,
			detail,
		});

		if (!shouldReport) {
			console.log(
				`[useDataModuleGuardTelemetry] Skipping report for key: "${key}" (shouldReport=false)`,
			);
			lastSignature.current = signature;
			return;
		}

		if (lastSignature.current === signature) {
			console.log(
				`[useDataModuleGuardTelemetry] Skipping report for key: "${key}" (signature unchanged)`,
			);
			return;
		}

		console.log(
			`[useDataModuleGuardTelemetry] Reporting guard for key: "${key}"`,
			{ signature },
		);
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
