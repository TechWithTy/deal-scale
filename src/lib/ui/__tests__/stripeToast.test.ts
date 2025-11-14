import { beforeEach, describe, expect, it, vi } from "vitest";

const toastMocks = {
	loading: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
};

vi.mock("react-hot-toast", () => ({
	toast: {
		loading: (...args: Parameters<typeof toastMocks.loading>) =>
			toastMocks.loading(...args),
		success: (...args: Parameters<typeof toastMocks.success>) =>
			toastMocks.success(...args),
		error: (...args: Parameters<typeof toastMocks.error>) =>
			toastMocks.error(...args),
	},
}));

let startStripeToast: typeof import("@/lib/ui/stripeToast").startStripeToast;

beforeEach(async () => {
	toastMocks.loading.mockReset().mockReturnValue("toast-id");
	toastMocks.success.mockReset();
	toastMocks.error.mockReset();
	({ startStripeToast } = await import("@/lib/ui/stripeToast"));
});

describe("startStripeToast", () => {
	it("creates a persistent loading toast and returns handlers", () => {
		const handlers = startStripeToast("Working…");

		expect(toastMocks.loading).toHaveBeenCalledWith("Working…", {
			duration: Infinity,
		});
		expect(handlers.id).toBe("toast-id");
	});

	it("updates toast to success with consistent id", () => {
		const handlers = startStripeToast("Working…");

		handlers.success("All set!");

		expect(toastMocks.success).toHaveBeenCalledWith("All set!", {
			id: "toast-id",
			duration: 5000,
		});
	});

	it("updates toast to error with consistent id", () => {
		const handlers = startStripeToast("Working…");

		handlers.error("Something went wrong");

		expect(toastMocks.error).toHaveBeenCalledWith("Something went wrong", {
			id: "toast-id",
			duration: 6000,
		});
	});
});

