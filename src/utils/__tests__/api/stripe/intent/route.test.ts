/**
 * @jest-environment node
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { POST, PUT } from "@/app/api/stripe/intent/route";
import { NextResponse } from "next/server";

const stripeMocks = vi.hoisted(() => ({
	retrieve: vi.fn(),
	update: vi.fn(),
	create: vi.fn(),
}));

vi.mock("@/lib/externalRequests/stripe", () => ({
	createPaymentIntent: stripeMocks.create,
	retrievePaymentIntent: stripeMocks.retrieve,
	updatePaymentIntent: stripeMocks.update,
	deletePaymentIntent: vi.fn(),
}));

const retrieveMock = stripeMocks.retrieve;
const updateMock = stripeMocks.update;
const createMock = stripeMocks.create;

const buildPutRequest = (body: unknown) =>
	new Request("http://localhost/api/stripe/intent", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

const buildPostRequest = (body?: unknown, raw?: string) =>
	new Request("http://localhost/api/stripe/intent", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
	});

afterEach(() => {
	vi.clearAllMocks();
});

describe("POST /api/stripe/intent validation", () => {
	it("returns 400 when body is missing", async () => {
		const response = (await POST(
			buildPostRequest(),
		)) as NextResponse<{ error: string; details?: string }>;

		expect(response.status).toBe(400);
		const payload = await response.json();
		expect(payload.error).toBe("Invalid request payload");
		expect(payload.details).toContain("Request body is required");
		expect(createMock).not.toHaveBeenCalled();
	});

	it("returns 400 when body is invalid JSON", async () => {
		const response = (await POST(
			buildPostRequest(undefined, "not-json"),
		)) as NextResponse<{ error: string; details?: string }>;

		expect(response.status).toBe(400);
		const payload = await response.json();
		expect(payload.error).toBe("Invalid request payload");
		expect(payload.details).toContain("Malformed JSON");
		expect(createMock).not.toHaveBeenCalled();
	});

	it("validates payload and creates payment intent", async () => {
		createMock.mockResolvedValueOnce({
			id: "pi_123",
			client_secret: "secret_123",
			amount: 1000,
			currency: "usd",
			description: "Test description",
			status: "requires_payment_method",
			metadata: { planId: "basic" },
			created: 123456,
		} as any);

		const response = (await POST(
			buildPostRequest({
				price: 1000,
				description: "Test description",
				metadata: { planId: "basic" },
			}),
		)) as NextResponse;

		expect(response.status).toBe(200);
		expect(createMock).toHaveBeenCalledWith({
			price: 1000,
			description: "Test description",
			metadata: { planId: "basic" },
		});
	});
});

describe("PUT /api/stripe/intent discount handling", () => {
	it("applies product discount when coupon matches product metadata", async () => {
		retrieveMock.mockResolvedValueOnce({
			id: "pi_product",
			amount: 10000,
			metadata: {
				productId: "ai-credits-bundle",
				productCategories: "credits,automation",
			},
			status: "requires_payment_method",
		} as any);

		updateMock.mockResolvedValueOnce({
			id: "pi_product",
			amount: 5000,
			metadata: {
				productId: "ai-credits-bundle",
				productCategories: "credits,automation",
			},
			status: "requires_payment_method",
		} as any);

		const response = (await PUT(
			buildPutRequest({
				intentId: "pi_product",
				discountCode: "SCALE50",
			}) as any,
		)) as NextResponse;

		expect(retrieveMock).toHaveBeenCalledWith("pi_product");
		expect(updateMock).toHaveBeenCalledWith({
			intentId: "pi_product",
			price: 5000,
			metadata: {
				productId: "ai-credits-bundle",
				productCategories: "credits,automation",
			},
		});

		const payload = await response.json();
		expect(payload.amount).toBe(5000);
	});

	it("applies plan discount when coupon matches recurring plan metadata", async () => {
		retrieveMock.mockResolvedValueOnce({
			id: "pi_plan",
			amount: 200000,
			metadata: {
				planId: "basic",
				pricingCategoryId: "lead_generation_plan",
			},
			status: "requires_payment_method",
		} as any);

		updateMock.mockResolvedValueOnce({
			id: "pi_plan",
			amount: 100000,
			metadata: {
				planId: "basic",
				pricingCategoryId: "lead_generation_plan",
			},
			status: "requires_payment_method",
		} as any);

		const response = (await PUT(
			buildPutRequest({
				intentId: "pi_plan",
				discountCode: "SCALE50",
			}) as any,
		)) as NextResponse;

		expect(retrieveMock).toHaveBeenCalledWith("pi_plan");
		expect(updateMock).toHaveBeenCalledWith({
			intentId: "pi_plan",
			price: 100000,
			metadata: {
				planId: "basic",
				pricingCategoryId: "lead_generation_plan",
			},
		});

		const payload = await response.json();
		expect(payload.amount).toBe(100000);
	});
});

