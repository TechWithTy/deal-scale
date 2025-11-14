import { render, screen } from "@testing-library/react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import type { Plan } from "@/types/service/plans";

vi.mock("@/hooks/useHasMounted", () => ({
	useHasMounted: () => true,
}));

vi.mock("@/hooks/useWaitCursor", () => ({
	useWaitCursor: () => undefined,
}));

vi.mock("@stripe/react-stripe-js", () => ({
	PaymentElement: () => <div data-testid="payment-element" />,
	useStripe: () => ({}),
	useElements: () => ({}),
}));

vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DialogContent: ({
		children,
	}: {
		children: ReactNode;
		className?: string;
	}) => <div>{children}</div>,
	DialogDescription: ({ children }: { children: ReactNode }) => (
		<div>{children}</div>
	),
	DialogFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DialogTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
	Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
		<button {...props}>{children}</button>
	),
}));

vi.mock("@/lib/ui/stripeToast", () => ({
	startStripeToast: vi.fn(),
}));

const basePlan: Plan = {
	id: "plan_basic",
	name: "Basic Plan",
	price: {
		oneTime: { amount: 1500, description: "One time", features: [] },
		monthly: { amount: 500, description: "Monthly", features: [] },
		annual: { amount: 5000, description: "Annual", features: [] },
	},
	cta: { text: "Sign Up", type: "checkout" as const },
};

const renderCheckoutForm = (props?: Partial<ComponentProps<typeof CheckoutForm>>) =>
	render(
		<CheckoutForm
			clientSecret="secret"
			onSuccess={vi.fn()}
			plan={basePlan}
			planType="monthly"
			{...props}
		/>,
	);

describe("CheckoutForm pay button label", () => {
	it("shows default pay label for standard checkout", () => {
		renderCheckoutForm();
		expect(screen.getByRole("button", { name: "Pay" })).toBeInTheDocument();
	});

	it("uses provided payButtonLabel when passed", () => {
		renderCheckoutForm({ payButtonLabel: "Complete Deposit" });
		expect(
			screen.getByRole("button", { name: "Complete Deposit" }),
		).toBeInTheDocument();
	});

	it("prefers getPayButtonLabel for dynamic label", () => {
		renderCheckoutForm({
			getPayButtonLabel: ({ planType }) => `Pay for ${planType}`,
			planType: "oneTime",
		});

		expect(
			screen.getByRole("button", { name: "Pay for oneTime" }),
		).toBeInTheDocument();
	});
});

