import StatusPageClient from "@/components/ui/StatusPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Success | DealScale",
	description: "Your action was successful",
	openGraph: {
		title: "Success | DealScale",
		description: "Your action was completed successfully",
	},
};

export default function SuccessPage() {
	return <StatusPageClient type="success" />;
}
