"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FAQProps } from "@/types/faq";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type React from "react";
import { useState } from "react";
import Header from "../common/Header";

const FAQ: React.FC<FAQProps> = ({ title, subtitle, faqItems }) => {
	const [showAll, setShowAll] = useState(false);
	const DEFAULT_SHOW_COUNT = 5;
	const visibleItems = showAll
		? faqItems
		: faqItems.slice(0, DEFAULT_SHOW_COUNT);
	const hasMore = faqItems.length > DEFAULT_SHOW_COUNT;

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
					defaultValue={faqItems.length > 0 ? "item-0" : undefined}
					className="flex flex-col gap-3"
				>
					{visibleItems.map((item, index) => {
						// Since we slice from the start, index matches original index
						const isHero = index === 0;
						return (
							<AccordionItem
								value={`item-${index}`}
								key={`${item.question}-${index}`}
								data-testid={isHero ? "homepage-faq-hero" : undefined}
								className={cn(
									"overflow-hidden border border-transparent transition duration-300 ease-out",
									isHero
										? "rounded-3xl border-cyan-400/60 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-slate-100 shadow-cyan-500/20 shadow-xl dark:from-cyan-500/25 dark:via-blue-600/20 dark:to-slate-950 dark:shadow-cyan-500/30"
										: "rounded-xl border-border/40 bg-card/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg",
								)}
							>
								<AccordionTrigger
									className={cn(
										"px-6 py-4 text-left text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:text-foreground",
										isHero
											? "flex flex-col gap-2 text-black sm:flex-row sm:items-center sm:justify-between dark:text-cyan-100"
											: "hover:text-primary",
									)}
								>
									{isHero ? (
										<>
											<span className="inline-flex items-center gap-2 font-semibold text-black/80 text-xs uppercase tracking-wide dark:text-cyan-200/90">
												<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/70 font-bold text-slate-950 text-sm">
													★
												</span>
												Featured Insight · Investors
											</span>
											<span className="text-base sm:text-lg">
												{item.question}
											</span>
										</>
									) : (
										item.question
									)}
								</AccordionTrigger>
								<AccordionContent
									className={cn(
										"px-6 pb-4 text-muted-foreground dark:text-muted-foreground",
										isHero
											? "text-black/80 sm:text-base dark:text-cyan-50/95"
											: undefined,
									)}
								>
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>

				{hasMore && !showAll && (
					<div className="mt-8 flex justify-center">
						<Button
							variant="outline"
							onClick={() => setShowAll(true)}
							className="group flex items-center gap-2 border-primary/40 bg-background/80 hover:bg-primary/10 hover:border-primary/60"
						>
							Load More FAQs
							<ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
						</Button>
					</div>
				)}

				<div className="mt-16 text-center">
					<p className="mb-4 text-muted-foreground">
						Join the Founders Circle to shape Deal Scale.
						<br />
						Get <span className="font-semibold text-primary">5 AI credits</span>
						, priority onboarding, and first dibs when we launch.
					</p>
					<a
						href="/contact"
						className="glow inline-flex items-center justify-center rounded-md bg-gradient-to-r from-primary to-focus px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
					>
						Request Founders Circle Access
					</a>
				</div>
			</div>
		</motion.div>
	);
};

export default FAQ;
