import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutDialogProps } from "./types";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
	: null;

const CheckoutDialog = ({
	isOpen,
	onClose,
	clientSecret,
	price,
	name,
	sku,
	categories = [],
}: CheckoutDialogProps) => {
	if (!isOpen || !clientSecret) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl dark:bg-background-darker">
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<CheckoutForm
						clientSecret={clientSecret}
						onSuccess={() => {
							onClose();
						}}
						plan={{
							id: sku || name,
							name,
							price: {
								oneTime: {
									amount: price,
									description: "One-time payment",
									features: [],
								},
								monthly: { amount: 0, description: "", features: [] },
								annual: { amount: 0, description: "", features: [] },
							},
							cta: { text: "Complete Purchase", type: "checkout" },
						}}
						planType="oneTime"
						productCategories={categories}
					/>
				</Elements>
				<Button variant="ghost" className="mt-4 w-full" onClick={onClose}>
					Cancel
				</Button>
			</div>
		</div>
	);
};

export default CheckoutDialog;
