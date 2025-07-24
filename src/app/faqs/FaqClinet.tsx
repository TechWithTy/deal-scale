import Faq from "@/components/faq";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/faq/default";
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
		<>
			<div className="my-24 h-full">
				<Faq title={title} subtitle={subtitle} faqItems={faqItems} />
			</div>
		</>
	);
};

export default FAQs;
