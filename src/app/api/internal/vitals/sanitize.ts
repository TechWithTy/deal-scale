type MetricType = "web-vital" | "resource-timing" | "long-task";

interface BaseMetricPayload {
	type: MetricType;
	id: string;
	page?: string;
	timestamp?: number;
}

interface WebVitalPayload extends BaseMetricPayload {
	type: "web-vital";
	name: string;
	label: string;
	value: number;
	navigationType?: string;
	rating?: string;
	delta?: number;
}

interface ResourceTimingPayload extends BaseMetricPayload {
	type: "resource-timing";
	name: string;
	initiatorType?: string;
	transferSize?: number;
	encodedBodySize?: number;
	decodedBodySize?: number;
	duration: number;
	startTime?: number;
	isThirdParty?: boolean;
	renderBlockingStatus?: string;
}

interface LongTaskPayload extends BaseMetricPayload {
	type: "long-task";
	name: string;
	duration: number;
	startTime?: number;
	attribution?: string;
}

export type MetricPayload =
	| WebVitalPayload
	| ResourceTimingPayload
	| LongTaskPayload;

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function toRounded(value: number) {
	return Number(value.toFixed(3));
}

export function sanitizeMetricPayload(payload: unknown): MetricPayload | null {
	if (!isRecord(payload)) {
		return null;
	}

	const type = payload.type;

	if (type === "web-vital") {
		const { id, name, label, value } = payload as Partial<WebVitalPayload>;

		if (!id || !name || !label || !isFiniteNumber(value)) {
			return null;
		}

		return {
			type,
			id,
			name,
			label,
			value: toRounded(value),
			page: typeof payload.page === "string" ? payload.page : undefined,
			navigationType:
				typeof payload.navigationType === "string"
					? payload.navigationType
					: undefined,
			rating: typeof payload.rating === "string" ? payload.rating : undefined,
			delta: isFiniteNumber((payload as Partial<WebVitalPayload>).delta)
				? toRounded((payload as Partial<WebVitalPayload>).delta as number)
				: undefined,
			timestamp: isFiniteNumber(payload.timestamp)
				? Number(payload.timestamp)
				: Date.now(),
		} satisfies WebVitalPayload;
	}

	if (type === "resource-timing") {
		const candidate = payload as Partial<ResourceTimingPayload>;
		const { id, name, duration } = candidate;

		if (!id || !name || !isFiniteNumber(duration)) {
			return null;
		}

		return {
			type,
			id,
			name,
			duration: Number(duration),
			initiatorType:
				typeof candidate.initiatorType === "string"
					? candidate.initiatorType
					: undefined,
			transferSize: isFiniteNumber(candidate.transferSize)
				? Math.round(candidate.transferSize)
				: undefined,
			encodedBodySize: isFiniteNumber(candidate.encodedBodySize)
				? Math.round(candidate.encodedBodySize)
				: undefined,
			decodedBodySize: isFiniteNumber(candidate.decodedBodySize)
				? Math.round(candidate.decodedBodySize)
				: undefined,
			startTime: isFiniteNumber(candidate.startTime)
				? Number(candidate.startTime)
				: undefined,
			isThirdParty:
				typeof candidate.isThirdParty === "boolean"
					? candidate.isThirdParty
					: undefined,
			renderBlockingStatus:
				typeof candidate.renderBlockingStatus === "string"
					? candidate.renderBlockingStatus
					: undefined,
			page: typeof candidate.page === "string" ? candidate.page : undefined,
			timestamp: isFiniteNumber(candidate.timestamp)
				? Number(candidate.timestamp)
				: Date.now(),
		} satisfies ResourceTimingPayload;
	}

	if (type === "long-task") {
		const candidate = payload as Partial<LongTaskPayload>;
		const { id, name, duration } = candidate;

		if (!id || !name || !isFiniteNumber(duration)) {
			return null;
		}

		return {
			type,
			id,
			name,
			duration: Number(duration),
			startTime: isFiniteNumber(candidate.startTime)
				? Number(candidate.startTime)
				: undefined,
			attribution:
				typeof candidate.attribution === "string"
					? candidate.attribution
					: undefined,
			page: typeof candidate.page === "string" ? candidate.page : undefined,
			timestamp: isFiniteNumber(candidate.timestamp)
				? Number(candidate.timestamp)
				: Date.now(),
		} satisfies LongTaskPayload;
	}

	return null;
}
