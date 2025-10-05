/**
 * @jest-environment node
 */

import { describeIfExternal, skipExternalTest } from "../../../testHelpers/external";
import { getTestBaseUrl } from "@/utils/env";
import axios from "axios";
import { AxiosError } from "axios";

// Helper to get the base URL for testing
const BASE_URL = getTestBaseUrl();
const ENDPOINT = `${BASE_URL}/api/stripe`;

// Helper to create, retrieve, update, and delete a payment intent via the API
async function createIntent(
	price: number,
	description: string,
	metadata?: Record<string, string>,
) {
	try {
		const res = await axios.post(ENDPOINT, { price, description, metadata });
		console.log("[TEST] createIntent response:", res.data);
		expect(res.status).toBe(200);
		expect(res.data.id).toBeDefined();
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err) && err.response) {
			console.log("[TEST] createIntent error response:", err.response.data);
		} else if (axios.isAxiosError(err)) {
			// Log only safe fields
			console.log("[TEST] createIntent error (safe):", {
				message: err.message,
				code: err.code,
				stack: err.stack,
				config: err.config,
			});
		} else {
			// For non-Axios errors, just log the message
			console.log(
				"[TEST] createIntent error:",
				err && (err as any).message ? (err as any).message : err,
			);
		}
		throw err;
	}
}

async function retrieveIntent(intentId: string) {
	try {
		const res = await axios.get(`${ENDPOINT}?intentId=${intentId}`);
		console.log("[TEST] retrieveIntent response:", res.data);
		expect(res.status).toBe(200);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err) && err.response) {
			console.log("[TEST] retrieveIntent error response:", err.response.data);
		} else {
			console.log("[TEST] retrieveIntent error:", err);
		}
		throw err;
	}
}

async function updateIntent(
	intentId: string,
	price: number,
	metadata?: Record<string, string>,
) {
	try {
		const res = await axios.put(ENDPOINT, { intentId, price, metadata });
		console.log("[TEST] updateIntent response:", res.data);
		expect(res.status).toBe(200);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err) && err.response) {
			console.log("[TEST] updateIntent error response:", err.response.data);
		} else {
			console.log("[TEST] updateIntent error:", err);
		}
		throw err;
	}
}

async function deleteIntent(intentId: string) {
	try {
		const res = await axios.delete(`${ENDPOINT}?intentId=${intentId}`);
		console.log("[TEST] deleteIntent response:", res.data);
		expect(res.status).toBe(200);
		return res.data;
	} catch (err: unknown) {
		if (axios.isAxiosError(err) && err.response) {
			console.log("[TEST] deleteIntent error response:", err.response.data);
			// Accept 400 if error is 'already canceled'
			if (
				err.response.status === 400 &&
				err.response.data &&
				typeof err.response.data.error === "string" &&
				err.response.data.error.includes("already canceled")
			) {
				// Treat as pass (idempotent delete)
				return err.response.data;
			}
		}
		throw err;
	}
}

skipExternalTest("[E2E] Stripe Payment Intent CRUD Flow");
describeIfExternal("[E2E] Stripe Payment Intent CRUD Flow", () => {
	let intentId: string;
	const testPrice = 1234;
	const updatedPrice = 2345;
	const testDescription = "E2E CRUD Test";
	const testMetadata = { test: "true", suite: "crud" };

	it("should create a payment intent", async () => {
		const intent = await createIntent(testPrice, testDescription, testMetadata);
		intentId = intent.id;
		expect(intent.amount).toBe(testPrice);
		expect(intent.description).toBe(testDescription);
		expect(intent.metadata.test).toBe("true");
	});

	it("should retrieve the payment intent", async () => {
		const intent = await retrieveIntent(intentId);
		expect(intent.id).toBe(intentId);
		expect(intent.amount).toBe(testPrice);
		expect(intent.metadata.suite).toBe("crud");
	});

	it("should update the payment intent", async () => {
		const intent = await updateIntent(intentId, updatedPrice, {
			...testMetadata,
			updated: "yes",
		});
		expect(intent.id).toBe(intentId);
		expect(intent.amount).toBe(updatedPrice);
		expect(intent.metadata.updated).toBe("yes");
	});

	it("should delete (cancel) the payment intent", async () => {
		const intent = await deleteIntent(intentId);
		if (
			intent &&
			typeof intent === "object" &&
			"id" in intent &&
			"status" in intent
		) {
			expect(intent.id).toBe(intentId);
			expect(intent.status).toBe("canceled");
		} else if (
			intent &&
			typeof intent.error === "string" &&
			intent.error.includes("already canceled")
		) {
			// Accept this as a valid outcome (idempotent delete)
			expect(intent.error).toMatch(/already canceled/);
		} else {
			throw new Error(
				`Unexpected deleteIntent response: ${JSON.stringify(intent)}`,
			);
		}
	});

	it("should not retrieve a deleted payment intent", async () => {
		try {
			await retrieveIntent(intentId);
			throw new Error("Should not retrieve a canceled intent");
		} catch (err: unknown) {
			if (axios.isAxiosError(err) && err.response) {
				expect(err.response.status).toBe(400);
			} else {
				throw err; // Re-throw if it's not the error you expect
			}
		}
	});
});
