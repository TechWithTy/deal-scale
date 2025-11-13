/**
 * @jest-environment node
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { PUT } from "@/app/api/stripe/intent/route";
import { NextResponse } from "next/server";

const stripeMocks = vi.hoisted(() => ({
	retrieve: vi.fn(),
	update: vi.fn(),
}));

vi.mock("@/lib/externalRequests/stripe", () => ({
	createPaymentIntent: vi.fn(),
	retrievePaymentIntent: stripeMocks.retrieve,
	updatePaymentIntent: stripeMocks.update,
	deletePaymentIntent: vi.fn(),
}));

const retrieveMock = stripeMocks.retrieve;
const updateMock = stripeMocks.update;

const buildPutRequest = (body: unknown) =>
	new Request("http://localhost/api/stripe/intent", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

afterEach(() => {
	vi.clearAllMocks();
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

