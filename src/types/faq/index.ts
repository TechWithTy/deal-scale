export interface FAQItem {
	question: string;
	answer: string;
}

export interface FAQProps {
	title: string;
	subtitle: string;
	faqItems: FAQItem[];
}
