"use client";

import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/types/testimonial";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import Header from "../common/Header";
import { TestimonialAvatar } from "./testimonials/TestimonialAvatar";
import { TestimonialStars } from "./testimonials/TestimonialStars";
import { TestimonialTabs } from "./testimonials/TestimonialTabs";
import type { TabKey } from "./testimonials/tabConfig";
interface TestimonialsProps {
	testimonials: Testimonial[];
	title: string;
	subtitle: string;
}

const Testimonials = ({ testimonials, title, subtitle }: TestimonialsProps) => {
	const totalTestimonials = testimonials.length;
	const [currentIndex, setCurrentIndex] = useState(0);
	const [activeTab, setActiveTab] = useState<TabKey>("review");
	const shouldReduceMotion = useReducedMotion();

	const nextTestimonial = useCallback(() => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials);
	}, [totalTestimonials]);

	const prevTestimonial = useCallback(() => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials,
		);
	}, [totalTestimonials]);

	const currentTestimonial = testimonials[currentIndex];

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
	);

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
	);

	return (
		<motion.section
			id="testimonials"
			className="glass-card w-full overflow-visible bg-background-dark px-4 py-12 sm:px-6 lg:px-8"
			initial={shouldReduceMotion ? undefined : { opacity: 0 }}
			animate={shouldReduceMotion ? undefined : { opacity: 1 }}
			transition={shouldReduceMotion ? undefined : { duration: 0.5 }}
		>
			<div className="mx-auto mb-10 max-w-4xl pt-16 pb-8 text-center">
				<Header
					title="What Our Clients Say"
					subtitle="Hear from our clients about their experiences with our services"
					size="lg" // or "sm", "md", "xl"
					className="mb-10" // optional additional classes
				/>
			</div>
			<div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-glow-gradient opacity-30 blur-3xl" />
			<motion.div
				className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-pulse opacity-30 blur-3xl"
				animate={
					shouldReduceMotion
						? undefined
						: {
								scale: [1, 1.2, 1],
								opacity: [0.3, 0.5, 0.3],
							}
				}
				transition={
					shouldReduceMotion
						? undefined
						: {
								duration: 5,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
								delay: 2.5,
							}
				}
			/>

			<div className="glass-card relative z-10 mx-auto max-w-6xl">
				<motion.div
					className="glass-card overflow-hidden rounded-2xl border border-white/10"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex flex-col p-6 sm:p-8 md:p-12">
						<motion.div
							className="mb-6 flex w-full items-center justify-center gap-2 sm:justify-center"
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
							className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
							{...fadeIn}
						>
							<TestimonialAvatar
								name={currentTestimonial.name}
								image={currentTestimonial.image}
							/>
							<div>
								<h4 className="font-semibold text-base sm:text-base">
									{currentTestimonial.name}
								</h4>
								<p className="text-black text-sm sm:text-sm dark:text-white/60">
									{currentTestimonial.role}
								</p>
							</div>
						</motion.div>

						<div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
							<div className="flex space-x-2">
								{testimonials.slice(0, 5).map((testimonial, index) => (
									<motion.button
										key={testimonial.id}
										className={`h-2 w-2 rounded-full border border-neutral-200 transition-all duration-300 sm:h-3 sm:w-3 dark:border-neutral-700 ${
											currentIndex === index
												? "w-4 bg-primary sm:w-6"
												: "bg-black/20 hover:bg-black/40 dark:bg-white/20 dark:hover:bg-white/40"
										}`}
										onClick={() => setCurrentIndex(index)}
										aria-label={`View testimonial ${index + 1}`}
										whileHover={{ scale: 1.2 }}
										whileTap={{ scale: 0.9 }}
									/>
								))}
							</div>

							<div className="flex space-x-2">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										size="sm"
										className="border-primary/30 text-primary hover:bg-primary/10"
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
										className="border-primary/30 text-primary hover:bg-primary/10"
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
			</div>
		</motion.section>
	);
};

export default Testimonials;
