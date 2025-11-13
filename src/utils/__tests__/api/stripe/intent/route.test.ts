/**
 * @jest-environment node
 */

import { PUT } from "@/app/api/stripe/intent/route";
import { NextResponse } from "next/server";

jest.mock("@/lib/externalRequests/stripe", () => ({
	createPaymentIntent: jest.fn(),
	retrievePaymentIntent: jest.fn(),
	updatePaymentIntent: jest.fn(),
	deletePaymentIntent: jest.fn(),
}));

import {
	retrievePaymentIntent,
	updatePaymentIntent,
} from "@/lib/externalRequests/stripe";

const mockedRetrieve = retrievePaymentIntent as jest.MockedFunction<
	typeof retrievePaymentIntent
>;
const mockedUpdate = updatePaymentIntent as jest.MockedFunction<
	typeof updatePaymentIntent
>;

const buildPutRequest = (body: unknown) =>
	new Request("http://localhost/api/stripe/intent", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

describe("PUT /api/stripe/intent discount handling", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("applies product discount when coupon matches product metadata", async () => {
		mockedRetrieve.mockResolvedValueOnce({
			id: "pi_product",
			amount: 10000,
			metadata: {
				productId: "ai-credits-bundle",
				productCategories: "credits,automation",
			},
			status: "requires_payment_method",
		} as any);

		mockedUpdate.mockResolvedValueOnce({
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

		expect(mockedRetrieve).toHaveBeenCalledWith("pi_product");
		expect(mockedUpdate).toHaveBeenCalledWith({
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
		mockedRetrieve.mockResolvedValueOnce({
			id: "pi_plan",
			amount: 200000,
			metadata: {
				planId: "basic",
				pricingCategoryId: "lead_generation_plan",
			},
			status: "requires_payment_method",
		} as any);

		mockedUpdate.mockResolvedValueOnce({
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

		expect(mockedRetrieve).toHaveBeenCalledWith("pi_plan");
		expect(mockedUpdate).toHaveBeenCalledWith({
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

