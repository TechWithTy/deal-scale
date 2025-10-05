"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Testimonial } from "@/types/testimonial";
import { AnimatePresence, motion } from "framer-motion";
import { TAB_KEYS, type TabKey } from "./tabConfig";

interface TestimonialTabsProps {
        activeTab: TabKey;
        onTabChange: (value: TabKey) => void;
        fadeInUp: {
                initial: Record<string, unknown>;
                animate: Record<string, unknown>;
                exit: Record<string, unknown>;
                transition: Record<string, unknown>;
        };
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
                <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as TabKey)} className="w-full">
                        <TabsList className="mb-6 flex w-full justify-between overflow-hidden rounded-full border border-white/10 bg-white/5 p-1">
                                <div className="scrollbar-hide flex w-full overflow-x-auto">
                                        {TAB_KEYS.map((tab) => (
                                                <TabsTrigger
                                                        key={tab}
                                                        value={tab}
                                                        className="flex min-w-[100px] flex-1 flex-shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-black transition-colors data-[state=active]:bg-primary/20 data-[state=active]:text-black dark:text-white dark:text-white/70 sm:text-base"
                                                >
                                                        {TAB_LABELS[tab]}
                                                </TabsTrigger>
                                        ))}
                                </div>
                        </TabsList>

                        <AnimatePresence mode="wait">
                                <motion.div key={activeTab} initial="initial" animate="animate" exit="exit" variants={fadeInUp}>
                                        <TabsContent value={activeTab} className="mt-0 text-center sm:text-left">
                                                {activeTab === "review" && (
                                                        <blockquote className="mb-8 font-light text-black text-lg italic sm:text-xl md:text-2xl dark:text-white/90">
                                                                “{testimonial.content}”
                                                        </blockquote>
                                                )}
                                                {activeTab === "problem" && (
                                                        <div className="mb-8">
                                                                <h3 className="mb-2 font-semibold text-base text-primary sm:text-lg">
                                                                        The Challenge:
                                                                </h3>
                                                                <p className="font-light text-black text-lg italic sm:text-xl md:text-xl dark:text-white/90">
                                                                        “{testimonial.problem}”
                                                                </p>
                                                        </div>
                                                )}
                                                {activeTab === "solution" && (
                                                        <div className="mb-8">
                                                                <h3 className="mb-2 font-semibold text-base text-tertiary sm:text-lg">
                                                                        Our Solution:
                                                                </h3>
                                                                <p className="font-light text-black text-lg italic sm:text-xl md:text-xl dark:text-white/90">
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
