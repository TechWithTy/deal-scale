import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sanitizeMetricPayload } from "../sanitize";

describe("sanitizeMetricPayload", () => {
	beforeEach(() => {
		vi.spyOn(Date, "now").mockReturnValue(111);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns normalized web-vital payloads", () => {
		const result = sanitizeMetricPayload({
			type: "web-vital",
			id: "test-id",
			name: "LCP",
			label: "web-vital",
			value: 4.1234,
			page: "/",
			navigationType: "navigate",
			rating: "poor",
			delta: 0.33219,
			timestamp: 42,
		});

		expect(result).toEqual({
			type: "web-vital",
			id: "test-id",
			name: "LCP",
			label: "web-vital",
			value: 4.123,
			page: "/",
			navigationType: "navigate",
			rating: "poor",
			delta: 0.332,
			timestamp: 42,
		});
	});

	it("supports resource timing payloads for third-party analysis", () => {
		const result = sanitizeMetricPayload({
			type: "resource-timing",
			id: "resource-1",
			name: "https://example-cdn.com/script.js",
			initiatorType: "script",
			transferSize: 102938,
			encodedBodySize: 1024,
			decodedBodySize: 2048,
			duration: 783.129,
			startTime: 23.984,
			isThirdParty: true,
			renderBlockingStatus: "blocking",
		});

		expect(result).toEqual({
			type: "resource-timing",
			id: "resource-1",
			name: "https://example-cdn.com/script.js",
			initiatorType: "script",
			transferSize: 102938,
			encodedBodySize: 1024,
			decodedBodySize: 2048,
			duration: 783.129,
			startTime: 23.984,
			isThirdParty: true,
			renderBlockingStatus: "blocking",
			page: undefined,
			timestamp: 111,
		});
	});

	it("normalizes long-task payloads", () => {
		const result = sanitizeMetricPayload({
			type: "long-task",
			id: "long-1",
			name: "self",
			duration: 210.553,
			startTime: 200.1,
			attribution: "self",
		});

		expect(result).toEqual({
			type: "long-task",
			id: "long-1",
			name: "self",
			duration: 210.553,
			startTime: 200.1,
			attribution: "self",
			page: undefined,
			timestamp: 111,
		});
	});

	it("rejects invalid payloads", () => {
		expect(sanitizeMetricPayload(null)).toBeNull();
		expect(
			sanitizeMetricPayload({
				type: "web-vital",
				name: "LCP",
				value: 1.2,
			}),
		).toBeNull();
	});
});
