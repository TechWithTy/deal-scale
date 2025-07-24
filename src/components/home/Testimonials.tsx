"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Testimonial } from "@/types/testimonial";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../common/Header";
import { cn } from "@/lib/utils";
interface TestimonialsProps {
	testimonials: Testimonial[];
	title: string;
	subtitle: string;
}

const Testimonials = ({ testimonials, title, subtitle }: TestimonialsProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [activeTab, setActiveTab] = useState("review");

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex(
			(prevIndex) =>
				(prevIndex - 1 + testimonials.length) % testimonials.length,
		);
	};

	const currentTestimonial = testimonials[currentIndex];

	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
		transition: { duration: 0.3 },
	};

	const fadeIn = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.3 },
	};

	return (
		<motion.section
			id="testimonials"
			className="glass-card w-full overflow-visible bg-background-dark px-4 py-12 sm:px-6 lg:px-8"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
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
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 5,
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "reverse",
					delay: 2.5,
				}}
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
							{Array.from({ length: 5 }).map((_, i) => (
								<Star
									key={uuidv4()}
									className={cn(
										"h-24 w-24 sm:h-6 sm:w-6 md:h-7 md:w-7",
										i < currentTestimonial.rating
											? "fill-primary text-primary"
											: "text-gray-400",
										"transition-all duration-200",
									)}
									strokeWidth={2.5}
									fill={i < currentTestimonial.rating ? "currentColor" : "none"}
								/>
							))}
						</motion.div>

						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="mb-6 flex w-full justify-between overflow-hidden rounded-full border border-white/10 bg-white/5 p-1">
								<div className="scrollbar-hide flex w-full overflow-x-auto">
									{["review", "problem", "solution"].map((tab) => (
										<TabsTrigger
											key={tab}
											value={tab}
											// biome-ignore lint/nursery/useSortedClasses: <explanation>
											className="flex min-w-[100px] flex-1 flex-shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-black transition-colors data-[state=active]:bg-primary/20 data-[state=active]:text-black dark:text-white dark:text-white/70 sm:text-base"
										>
											{tab.charAt(0).toUpperCase() + tab.slice(1)}
										</TabsTrigger>
									))}
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
										className="mt-0 text-center sm:text-left"
									>
										{activeTab === "review" && (
											<blockquote className="mb-8 font-light text-black text-lg italic sm:text-xl md:text-2xl dark:text-white/90">
												"{currentTestimonial.content}"
											</blockquote>
										)}
										{activeTab === "problem" && (
											<div className="mb-8">
												<h3 className="mb-2 font-semibold text-base text-primary sm:text-lg">
													The Challenge:
												</h3>
												<p className="font-light text-black text-lg italic sm:text-xl md:text-xl dark:text-white/90">
													"{currentTestimonial.problem}"
												</p>
											</div>
										)}
										{activeTab === "solution" && (
											<div className="mb-8">
												<h3 className="mb-2 font-semibold text-base text-tertiary sm:text-lg">
													Our Solution:
												</h3>
												<p className="font-light text-black text-lg italic sm:text-xl md:text-xl dark:text-white/90">
													"{currentTestimonial.solution}"
												</p>
											</div>
										)}
									</TabsContent>
								</motion.div>
							</AnimatePresence>
						</Tabs>

						<motion.div
							className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
							{...fadeIn}
						>
							{currentTestimonial.image ? (
								<Image
									src={currentTestimonial.image}
									width={36}
									height={36}
									alt={currentTestimonial.name}
									className="mb-4 h-16 w-16 rounded-full border-2 border-primary/30 object-cover sm:mr-4 sm:mb-0 sm:h-12 sm:w-12"
								/>
							) : (
								<div
									className={cn(
										"mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30",
										"bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground",
										"dark:from-primary/90 dark:to-secondary/90 dark:text-primary-foreground",
										"font-bold text-lg sm:mr-4 sm:mb-0 sm:h-12 sm:w-12 sm:text-base",
									)}
								>
									{currentTestimonial.name
										.split(" ")
										.filter(Boolean)
										.map((n) => n[0])
										.join("")
										.slice(0, 2)
										.toUpperCase()}
								</div>
							)}
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
