import type { PaymentSectionProps } from "@/types/checkout";
import { PaymentElement } from "@stripe/react-stripe-js";

export function PaymentSection({ error }: PaymentSectionProps) {
	return (
		<div className="space-y-4">
			<PaymentElement
				options={{
					layout: "tabs",
					fields: {
						billingDetails: {
							address: {
								country: "auto",
								postalCode: "auto",
							},
						},
					},
				}}
			/>
			{error && <div className="text-destructive text-sm">{error}</div>}
		</div>
	);
}
