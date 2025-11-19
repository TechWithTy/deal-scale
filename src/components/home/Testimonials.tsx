"use client";

import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import {
	DEFAULT_PERSONA_KEY,
	PERSONA_LABELS,
	type PersonaKey,
} from "@/data/personas/catalog";
import { getTestimonialsForPersona } from "@/data/personas/testimonialsByPersona";
import { usePersonaStore } from "@/stores/usePersonaStore";
import type { Testimonial } from "@/types/testimonial";
import { type Variants, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../common/Header";
import { PersonaSwitcher } from "./testimonials/TestimonialPersonaSwitcher";
import { TestimonialAvatar } from "./testimonials/TestimonialAvatar";
import { TestimonialStars } from "./testimonials/TestimonialStars";
import { TestimonialTabs } from "./testimonials/TestimonialTabs";
import type { TabKey } from "./testimonials/tabConfig";
import { useGpuOptimizations } from "@/hooks/useGpuOptimizations";

interface TestimonialsProps {
	testimonials: Testimonial[];
	title: string;
	subtitle: string;
}

const fallbackTestimonials = getTestimonialsForPersona(DEFAULT_PERSONA_KEY);

const usePersonaTestimonials = (
	persona: PersonaKey,
	externalTestimonials: Testimonial[],
) => {
	return useMemo(() => {
		const personaSpecific = getTestimonialsForPersona(persona);
		if (personaSpecific.length > 0) {
			return personaSpecific;
		}

		if (externalTestimonials.length > 0) {
			return externalTestimonials.map((item, index) => ({
				...item,
				id: item.id ?? index,
			}));
		}

		return fallbackTestimonials;
	}, [externalTestimonials, persona]);
};

const Testimonials = ({ testimonials, title, subtitle }: TestimonialsProps) => {
	const persona = usePersonaStore((state) => state.persona);
	const goal = usePersonaStore((state) => state.goal);
	const personaLabel =
		PERSONA_LABELS[persona] ?? PERSONA_LABELS[DEFAULT_PERSONA_KEY];
	const personaSpecificTestimonials = usePersonaTestimonials(
		persona,
		testimonials,
	);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [activeTab, setActiveTab] = useState<TabKey>("review");
	const shouldReduceMotion = useReducedMotion();
	const enableGpu = useGpuOptimizations();
	const gpuShellClass = enableGpu
		? "transform-gpu will-change-transform will-change-opacity"
		: "";
	const gpuDepthClass = enableGpu
		? "transform-gpu will-change-transform will-change-opacity translate-z-0"
		: "";

	const totalTestimonials = personaSpecificTestimonials.length || 1;

	const nextTestimonial = useCallback(() => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
	}, [totalTestimonials]);

	const prevTestimonial = useCallback(() => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials,
		);
	}, [totalTestimonials]);

	const currentTestimonial =
		personaSpecificTestimonials[currentIndex] ?? fallbackTestimonials[0];

	useEffect(() => {
		setCurrentIndex(0);
		setActiveTab("review");
	}, [persona]);

	const fadeInUp = useMemo(
		() =>
			shouldReduceMotion
				? {
						initial: { opacity: 1, y: 0 },
						animate: { opacity: 1, y: 0 },
						exit: { opacity: 1, y: 0 },
						transition: { duration: 0 },
					}
				: {
						initial: { opacity: 0, y: 20 },
						animate: { opacity: 1, y: 0 },
						exit: { opacity: 0, y: -20 },
						transition: { duration: 0.3 },
					},
		[shouldReduceMotion],
	) as Variants;

	const fadeIn = useMemo(
		() =>
			shouldReduceMotion
				? {
						initial: { opacity: 1 },
						animate: { opacity: 1 },
						exit: { opacity: 1 },
						transition: { duration: 0 },
					}
				: {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: { opacity: 0 },
						transition: { duration: 0.3 },
					},
		[shouldReduceMotion],
	) as Variants;

	return (
    <motion.section
        id="testimonials"
        className={`relative w-full overflow-visible bg-background-dark px-4 py-12 sm:px-6 lg:px-8 ${gpuShellClass}`}
        style={{ overflowClipMargin: '24px' }}
			initial={shouldReduceMotion ? undefined : { opacity: 0 }}
			animate={shouldReduceMotion ? undefined : { opacity: 1 }}
			transition={shouldReduceMotion ? undefined : { duration: 0.5 }}
		>
			<div
				data-testid="testimonial-spotlight-container"
				className="pointer-events-none absolute inset-0 -z-10"
			>
            <div
					className={`absolute top-10 left-[12%] h-72 w-72 rounded-full bg-glow-gradient opacity-25 blur-3xl ${gpuDepthClass}`}
				/>
            <motion.div
                data-testid="testimonial-orbit-accent"
                className={`absolute right-[14%] bottom-5 h-72 w-72 rounded-full bg-blue-pulse opacity-20 blur-3xl ${gpuDepthClass}`}
					animate={
						shouldReduceMotion
							? undefined
							: {
									scale: [1, 1.15, 1],
									opacity: [0.2, 0.45, 0.2],
								}
					}
					transition={
						shouldReduceMotion
							? undefined
							: {
									duration: 6,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "reverse",
									delay: 1.5,
								}
					}
				/>
			</div>

			<div className="mx-auto max-w-5xl pt-16 pb-10 text-center">
				<Header title={title} subtitle={subtitle} size="lg" className="mb-6" />
				<div className="mx-auto flex max-w-xl flex-col items-center gap-3">
					<PersonaSwitcher />
					{goal ? (
						<p className="text-sm font-medium text-black/70 dark:text-white/70">
							<span className="mr-1 text-black/60 dark:text-white/60">Primary goal:</span>
							<span className="font-semibold text-black dark:text-white">{goal}</span>
						</p>
					) : null}
				</div>
			</div>

			<div className="relative z-10 mx-auto max-w-6xl">
				<MagicCard className="overflow-visible rounded-[28px]">
					<motion.div
						className="glass-card overflow-hidden rounded-[inherit] border border-white/10"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="relative flex flex-col p-6 sm:p-8 md:p-12">
							<div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 to-transparent" />
							<motion.div
								className="mb-6 flex w-full items-center justify-center gap-2"
								{...fadeIn}
							>
								<TestimonialStars rating={currentTestimonial.rating} />
							</motion.div>

							<TestimonialTabs
								activeTab={activeTab}
								onTabChange={(value) => setActiveTab(value)}
								fadeInUp={fadeInUp}
								testimonial={currentTestimonial}
							/>

							<motion.div
								className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-6 sm:text-left"
								{...fadeIn}
							>
								<TestimonialAvatar
									name={currentTestimonial.name}
									image={currentTestimonial.image}
								/>
								<div className="text-center sm:text-left">
									<h4 className="font-semibold text-base sm:text-lg">
										{currentTestimonial.name}
									</h4>
									<p className="text-black text-sm sm:text-sm dark:text-white/60">
										{currentTestimonial.role}
									</p>
									<p className="mt-1 text-xs uppercase tracking-widest text-primary/80">
										{personaLabel}
									</p>
								</div>
							</motion.div>

							<div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between sm:gap-8">
								<div className="flex items-center justify-center gap-2">
									{personaSpecificTestimonials
										.slice(0, 5)
										.map((testimonial, index) => (
										<motion.button
											key={testimonial.id}
											className={`h-2 w-2 rounded-full border border-white/20 transition-all duration-300 sm:h-3 sm:w-3 ${
												currentIndex === index
													? "w-4 bg-primary sm:w-6"
													: "bg-white/10 hover:bg-white/20"
											}`}
											onClick={() => setCurrentIndex(index)}
											aria-label={`View testimonial ${index + 1}`}
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
										/>
									))}
								</div>

								<div className="flex items-center justify-center gap-2">
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											variant="outline"
											size="sm"
											className="border-transparent bg-white/5 text-white hover:bg-white/10 dark:border-primary/30"
											onClick={prevTestimonial}
											aria-label="Previous testimonial"
										>
											<ArrowLeft className="h-4 w-4" />
										</Button>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											variant="outline"
											size="sm"
											className="border-transparent bg-white/5 text-white hover:bg-white/10 dark:border-primary/30"
											onClick={nextTestimonial}
											aria-label="Next testimonial"
										>
											<ArrowRight className="h-4 w-4" />
										</Button>
									</motion.div>
								</div>
							</div>
						</div>
					</motion.div>
				</MagicCard>
			</div>
		</motion.section>
	);
};

export default Testimonials;
