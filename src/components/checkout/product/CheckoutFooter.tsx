import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { CheckoutFooterProps } from "@/types/checkout";

export function CheckoutFooter({
	isLoading,
	total,
	error,
	onPay,
}: CheckoutFooterProps) {
	return (
		<div className="mt-8">
			<Button
				type="submit"
				form="payment-form"
				disabled={isLoading}
				className="w-full"
				onClick={onPay}
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Processing...
					</>
				) : (
					`Pay $${total.toFixed(2)}`
				)}
			</Button>
			{error && (
				<div className="mt-4 text-center text-destructive text-sm">{error}</div>
			)}

			<p className="mt-4 text-center text-muted-foreground text-xs">
				Your payment is secure and encrypted. By completing your purchase, you
				agree to our{" "}
				<a href="/terms" className="text-primary hover:underline">
					Terms of Service
				</a>{" "}
				and{" "}
				<a href="/privacy" className="text-primary hover:underline">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	);
}
