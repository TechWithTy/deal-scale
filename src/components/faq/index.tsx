"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQProps } from "@/types/faq";
import { motion } from "framer-motion";
import type React from "react";
import Header from "../common/Header";

const FAQ: React.FC<FAQProps> = ({ title, subtitle, faqItems }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
			className="container mx-auto px-4 md:px-6"
		>
			<div className="mx-auto max-w-4xl">
				<Header
					title={title}
					subtitle={subtitle}
					size="lg" // or "sm", "md", "xl"
					className="mb-10" // optional additional classes
				/>

				<Accordion
					type="single"
					collapsible
					className="divide-y divide-border/10 rounded-lg border border-border bg-card/80 backdrop-blur-sm"
				>
					{faqItems.map((item, index) => (
						<AccordionItem
							value={`item-${index}`}
							key={item.answer}
							className="border-border/10"
						>
							<AccordionTrigger className="px-6 py-4 text-left text-foreground transition-colors hover:text-primary focus:ring-2 focus:ring-focus dark:text-foreground">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-4 text-muted-foreground dark:text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<div className="mt-16 text-center">
					<p className="mb-4 text-muted-foreground">
						Become a Beta Tester for Deal Scale!
						<br />
						Get <span className="font-semibold text-primary">5 free leads</span>
						, first dibs when we launch, and exclusive early access perks.
					</p>
					<a
						href="/contact"
						className="glow inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary to-focus px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
					>
						Become a Beta Tester
					</a>
				</div>
			</div>
		</motion.div>
	);
};

export default FAQ;
