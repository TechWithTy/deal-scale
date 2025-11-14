import { DynamicFaqSection } from "@/components/sections/DynamicFaqSection";
import type React from "react";

interface FAQsProps {
	title?: string;
	subtitle?: string;
}

const FAQs: React.FC<FAQsProps> = ({
	title = "Frequently Asked Questions",
	subtitle = "Find answers to common questions about our services, process, and technology expertise.",
}) => {
	return (
		<div className="my-24 h-full">
			<DynamicFaqSection title={title} subtitle={subtitle} />
		</div>
	);
};

export default FAQs;
