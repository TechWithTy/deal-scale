import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { v4 as uuid } from "uuid";

interface FAQ {
	question: string;
	answer: string;
}

interface FaqTabContentProps {
	faqs: FAQ[];
}

const FaqTabContent = ({ faqs }: FaqTabContentProps) => (
	<div>
		<h3 className="mb-4 font-medium text-lg text-primary">
			Frequently Asked Questions
		</h3>
		<Accordion type="single" collapsible className="w-full">
			{faqs.map((faq, index) => (
				<AccordionItem key={uuid()} value={`item-${index}`}>
					<AccordionTrigger className="text-left">
						{faq.question}
					</AccordionTrigger>
					<AccordionContent className="text-muted-foreground">
						{faq.answer}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	</div>
);

export default FaqTabContent;
