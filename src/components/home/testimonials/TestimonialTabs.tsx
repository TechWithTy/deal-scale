import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Testimonial } from "@/types/testimonial";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import { TAB_KEYS, type TabKey } from "./tabConfig";

interface TestimonialTabsProps {
	activeTab: TabKey;
	onTabChange: (value: TabKey) => void;
	fadeInUp: Variants;
	testimonial: Testimonial;
}

const TAB_LABELS: Record<TabKey, string> = {
	review: "Review",
	problem: "Problem",
	solution: "Solution",
};

export function TestimonialTabs({
	activeTab,
	onTabChange,
	fadeInUp,
	testimonial,
}: TestimonialTabsProps) {
	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => onTabChange(value as TabKey)}
		>
			<TabsList className="mx-auto mb-6 flex w-full max-w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 shadow-lg shadow-primary/5 backdrop-blur sm:max-w-2xl">
				<div className="scrollbar-hide -mx-2 flex w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-1">
					{TAB_KEYS.map((tab) => {
						const isActive = activeTab === tab;
						return (
							<TabsTrigger
								key={tab}
								value={tab}
								className="flex min-w-[120px] flex-none items-center justify-center whitespace-nowrap rounded-full px-4 py-2 font-medium text-sm transition-colors data-[state=active]:bg-primary/25 data-[state=active]:text-black sm:min-w-[140px] sm:flex-1 sm:px-6 sm:text-base dark:text-white/70 data-[state=active]:dark:text-white"
								data-active={isActive}
							>
								{TAB_LABELS[tab]}
							</TabsTrigger>
						);
					})}
				</div>
			</TabsList>

			<AnimatePresence mode="wait">
				<motion.div
					key={activeTab}
					initial="initial"
					animate="animate"
					exit="exit"
					variants={fadeInUp}
				>
					<TabsContent
						value={activeTab}
						className="mt-0 text-center sm:text-center"
					>
						{activeTab === "review" && (
							<blockquote className="mx-auto mb-8 max-w-4xl font-light text-black text-lg italic leading-relaxed sm:text-xl md:text-2xl dark:text-white/90">
								“{testimonial.content}”
							</blockquote>
						)}
						{activeTab === "problem" && (
							<div className="mx-auto mb-8 max-w-4xl text-center">
								<h3 className="mb-2 font-semibold text-base text-primary sm:text-lg">
									The Challenge:
								</h3>
								<p className="font-light text-black text-lg italic leading-relaxed sm:text-xl md:text-xl dark:text-white/90">
									“{testimonial.problem}”
								</p>
							</div>
						)}
						{activeTab === "solution" && (
							<div className="mx-auto mb-8 max-w-4xl text-center">
								<h3 className="mb-2 font-semibold text-base text-tertiary sm:text-lg">
									Our Solution:
								</h3>
								<p className="font-light text-black text-lg italic leading-relaxed sm:text-xl md:text-xl dark:text-white/90">
									“{testimonial.solution}”
								</p>
							</div>
						)}
					</TabsContent>
				</motion.div>
			</AnimatePresence>
		</Tabs>
	);
}
