"use client";
import type { PriorityPilotFormValues } from "@/data/contact/pilotFormFields";
import { mockDiscountCodes } from "@/data/discount/mockDiscountCodes";
import type { DiscountCode } from "@/types/discount/discountCode"; // * Discount code type
import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

interface ContactPilotPaymentFormProps {
	clientSecret: string;
	formData: PriorityPilotFormValues;
	onSuccess: () => void;
}

// * Payment form for Priority Pilot, assumes <Elements> context
export default function ContactPilotPaymentForm({
	clientSecret,
	formData,
	onSuccess,
}: ContactPilotPaymentFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [discountCode, setDiscountCode] = useState("");
	const [discountError, setDiscountError] = useState<string | null>(null);
	const [discountApplied, setDiscountApplied] = useState<DiscountCode | null>(
		null,
	);
	const [isCheckingCode, setIsCheckingCode] = useState(false);

	// * Validate discount code using mockDiscountCodes
	const handleCheckDiscount = async () => {
		setIsCheckingCode(true);
		setDiscountError(null);
		await new Promise((r) => setTimeout(r, 400));
		const code = discountCode.trim().toUpperCase();
		const found = mockDiscountCodes.find(
			(dc) => dc.code.toUpperCase() === code,
		);
		if (!found) {
			setDiscountApplied(null);
			setDiscountError("Discount code not found.");
			setIsCheckingCode(false);
			return;
		}
		if (!found.isActive) {
			setDiscountApplied(null);
			setDiscountError("This discount code is no longer active.");
			setIsCheckingCode(false);
			return;
		}
		if (found.expires && new Date(found.expires) < new Date()) {
			setDiscountApplied(null);
			setDiscountError("This discount code has expired.");
			setIsCheckingCode(false);
			return;
		}
		setDiscountApplied(found);
		setDiscountError(null);
		setIsCheckingCode(false);
	};

	const handlePayment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!stripe || !elements) {
			toast.error("Stripe not loaded");
			return;
		}
		setIsProcessing(true);
		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/contact-pilot?paid=1`,
				},
				redirect: "if_required",
			});
			if (error) throw error;
			// SendGrid email after payment
			const sgRes = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (!sgRes.ok) throw new Error("Failed to send confirmation email");
			toast.success("Payment and application successful! Check your email.");
			onSuccess();
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "Submission failed. Please try again.";
			toast.error(message);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<form
			onSubmit={handlePayment}
			className="mx-auto max-w-lg space-y-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg transition-colors dark:border-zinc-800 dark:bg-zinc-900/90"
		>
			<div className="mb-6 text-center">
				<h2 className="mb-2 font-bold text-2xl text-primary dark:text-blue-400">
					Reserve Your Priority Pilot Spot
				</h2>
				<p className="mb-1 text-gray-700 dark:text-zinc-200">
					Secure your place in the Deal Scale Priority Pilot Program.
				</p>
				<p className="text-gray-500 text-sm dark:text-zinc-400">
					Pay your $50 deposit to unlock early access, premium onboarding, and
					exclusive pilot features.
				</p>
			</div>

			<div className="mb-4 flex items-center justify-center gap-3">
				{discountApplied ? (
					<>
						<span className="font-semibold text-gray-500 text-lg line-through dark:text-zinc-500">
							$50
						</span>
						<span className="font-bold text-2xl text-green-600 dark:text-green-400">
							{discountApplied.discountPercent === 100
								? "$0"
								: discountApplied.discountAmount
									? `$${((5000 - discountApplied.discountAmount) / 100).toFixed(2)}`
									: discountApplied.discountPercent
										? `$${(50 * (1 - discountApplied.discountPercent / 100)).toFixed(2)}`
										: "$50"}
						</span>
					</>
				) : (
					<span className="font-bold text-2xl text-primary dark:text-blue-400">
						$50
					</span>
				)}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="discount"
					className="block font-semibold text-black dark:text-zinc-100"
				>
					Discount Code
				</label>
				<div className="flex gap-2">
					<input
						id="discount"
						type="text"
						placeholder="Enter code (if any)"
						value={discountCode}
						onChange={(e) => setDiscountCode(e.target.value)}
						className="flex-1 rounded border border-zinc-200 bg-white px-3 py-2 text-black transition-colors placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500 dark:placeholder:text-zinc-500"
						disabled={!!discountApplied}
						autoComplete="off"
					/>
					<button
						type="button"
						className="rounded bg-focus px-4 py-2 font-semibold text-white transition-colors hover:bg-primary/80 dark:bg-blue-700 dark:hover:bg-blue-600"
						onClick={handleCheckDiscount}
						disabled={isCheckingCode || !!discountApplied || !discountCode}
					>
						{discountApplied
							? "Applied"
							: isCheckingCode
								? "Checking..."
								: "Apply"}
					</button>
				</div>
				{discountError && (
					<p className="mt-1 text-red-600 text-xs dark:text-red-400">
						{discountError}
					</p>
				)}
				{discountApplied && (
					<div className="mt-1 flex items-center gap-2 text-green-600 text-xs dark:text-green-400">
						<span>
							Discount <b>{discountApplied.code}</b> applied!
						</span>
						{discountApplied.discountPercent && (
							<span>({discountApplied.discountPercent}% off)</span>
						)}
						{discountApplied.discountAmount && (
							<span>
								(${(discountApplied.discountAmount / 100).toFixed(2)} off)
							</span>
						)}
					</div>
				)}
			</div>

			<div className="my-6">
				<div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm transition-colors dark:border-zinc-700 dark:bg-zinc-800">
					<PaymentElement options={{ layout: "tabs" }} />
				</div>
			</div>

			<ul className="mb-4 list-disc pl-5 text-gray-600 text-xs dark:text-zinc-400">
				<li>
					Fully refundable if not accepted or if you cancel before onboarding.
				</li>
				<li>
					Deposit applies toward your first month if you continue after the
					pilot.
				</li>
				<li>
					Exclusive features, hands-on support, and priority feedback channel.
				</li>
			</ul>

			<button
				type="submit"
				className="w-full rounded bg-primary px-6 py-3 font-semibold text-lg text-white shadow-md transition-colors hover:bg-focus dark:bg-blue-700 dark:hover:bg-blue-600"
				disabled={isProcessing}
			>
				{isProcessing
					? "Processing..."
					: discountApplied
						? "Pay Discounted & Submit"
						: "Pay $50 & Submit"}
			</button>
		</form>
	);
}
