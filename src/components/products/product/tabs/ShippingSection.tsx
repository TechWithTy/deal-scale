import type { ShippingTimeEstimate } from "@/types/products/shipping";

interface ShippingSectionProps {
	shipping?: ShippingTimeEstimate;
}

const ShippingSection = ({ shipping }: ShippingSectionProps) => (
	<section className="my-8 rounded-md border border-muted bg-muted/40 p-4">
		<h3 className="mb-4 font-semibold text-lg text-primary">Shipping</h3>
		{shipping ? (
			<p className="text-muted-foreground">
				{shipping.minDays === shipping.maxDays
					? `Estimated delivery: ${shipping.minDays} day${shipping.minDays > 1 ? "s" : ""}`
					: `Estimated delivery: ${shipping.minDays}-${shipping.maxDays} days`}
				{shipping.guaranteed && (
					<span className="ml-2 text-green-600">(Guaranteed)</span>
				)}
				{shipping.deliveryWindow && (
					<span className="mt-1 block text-muted-foreground text-xs">
						Delivery window: {shipping.deliveryWindow.from} -{" "}
						{shipping.deliveryWindow.to}
					</span>
				)}
			</p>
		) : (
			<p className="text-muted-foreground">N/A</p>
		)}
	</section>
);

export default ShippingSection;
