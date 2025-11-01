"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

import type { TeamMember } from "@/types/about/team";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export const AnimatedTestimonials = ({
        testimonials,
        autoplay = false,
}: {
        testimonials: TeamMember[];
        autoplay?: boolean;
}) => {
        const [active, setActive] = useState(0);

        if (testimonials.length === 0) {
                return (
                        <div className="mx-auto max-w-sm px-4 py-20 text-center font-sans text-muted-foreground antialiased md:max-w-4xl md:px-8 lg:px-12">
                                Team information is coming soon.
                        </div>
                );
        }

        const handleNext = () => {
                setActive((prev) => (prev + 1) % testimonials.length);
        };

	const handlePrev = () => {
		setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
	};

	const isActive = (index: number) => {
		return index === active;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (autoplay) {
			const interval = setInterval(handleNext, 5000);
			return () => clearInterval(interval);
		}
	}, [autoplay]);

	const randomRotateY = () => {
		return Math.floor(Math.random() * 21) - 10;
	};
	return (
		<div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
			<div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
				<div>
					<div className="relative h-80 w-full">
						<AnimatePresence>
							{testimonials.map((member, index) => (
								<motion.div
									key={uuid()}
									initial={{
										opacity: 0,
										scale: 0.9,
										z: -100,
										rotate: randomRotateY(),
									}}
									animate={{
										opacity: isActive(index) ? 1 : 0.7,
										scale: isActive(index) ? 1 : 0.95,
										z: isActive(index) ? 0 : -100,
										rotate: isActive(index) ? 0 : randomRotateY(),
										zIndex: isActive(index)
											? 40
											: testimonials.length + 2 - index,
										y: isActive(index) ? [0, -80, 0] : 0,
									}}
									exit={{
										opacity: 0,
										scale: 0.9,
										z: 100,
										rotate: randomRotateY(),
									}}
									transition={{
										duration: 0.4,
										ease: "easeInOut",
									}}
									className="absolute inset-0 origin-bottom"
								>
									<img
										src={member.photoUrl}
										alt={member.name}
										width={500}
										height={500}
										draggable={false}
										className="h-full w-full rounded-3xl object-cover object-center"
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</div>
				<div className="flex flex-col justify-between py-4">
					<motion.div
						key={active}
						initial={{
							y: 20,
							opacity: 0,
						}}
						animate={{
							y: 0,
							opacity: 1,
						}}
						exit={{
							y: -20,
							opacity: 0,
						}}
						transition={{
							duration: 0.2,
							ease: "easeInOut",
						}}
					>
						<h3 className="flex items-center gap-2 font-bold text-2xl text-black dark:text-white">
							{testimonials[active].name}
							{testimonials[active].linkedin && (
								<a
									href={testimonials[active].linkedin}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`LinkedIn profile of ${testimonials[active].name}`}
									className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="20"
										height="20"
										fill="currentColor"
									>
										<title>LinkedIn</title>
										<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.792-1.75-1.768 0-.977.784-1.764 1.75-1.764s1.75.787 1.75 1.764c0 .976-.784 1.768-1.75 1.768zm13.5 11.268h-3v-5.604c0-1.337-.025-3.062-1.867-3.062-1.868 0-2.154 1.459-2.154 2.967v5.699h-3v-10h2.881v1.367h.041c.401-.76 1.379-1.562 2.841-1.562 3.039 0 3.6 2.002 3.6 4.604v5.591z" />
									</svg>
								</a>
							)}
						</h3>
						<div className="mt-1 flex flex-wrap items-center gap-2">
							<span className="text-gray-500 text-sm dark:text-neutral-500">
								{testimonials[active].role}
							</span>
							<span className="text-gray-400 text-xs dark:text-neutral-600">
								• Joined {testimonials[active].joined}
							</span>
						</div>
						<div className="mt-2 flex flex-wrap gap-2">
							{testimonials[active].expertise.map((skill) => (
								<span
									key={skill}
									className="inline-block rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 font-medium text-blue-800 text-xs dark:border-blue-700 dark:bg-blue-900 dark:text-blue-100"
								>
									{skill}
								</span>
							))}
						</div>
						<motion.p className="mt-8 text-gray-500 text-lg dark:text-neutral-300">
							{testimonials[active].bio.split(" ").map((word, index) => (
								<motion.span
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={index}
									initial={{
										filter: "blur(10px)",
										opacity: 0,
										y: 5,
									}}
									animate={{
										filter: "blur(0px)",
										opacity: 1,
										y: 0,
									}}
									transition={{
										duration: 0.2,
										ease: "easeInOut",
										delay: 0.02 * index,
									}}
									className="inline-block"
								>
									{word}&nbsp;
								</motion.span>
							))}
						</motion.p>
					</motion.div>
					<div className="flex gap-4 pt-12 md:pt-0">
						<button
							type="button"
							onClick={handlePrev}
							className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
						>
							<IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
						</button>
						<button
							type="button"
							onClick={handleNext}
							className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
						>
							<IconArrowRight className="group-hover/button:-rotate-12 h-5 w-5 text-black transition-transform duration-300 dark:text-neutral-400" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
