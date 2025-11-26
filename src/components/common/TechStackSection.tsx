"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TechStack } from "@/types/service/services";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

// ! Only render Lucide icons if they're valid React components, not utility functions
function getLucideIconComponent(
	iconName?: string,
	size = 20,
	className = "text-primary",
) {
	if (iconName) {
		// eslint-disable-next-line no-console
		console.log("TechStackSection icon mapping:", {
			iconName,
			mapped: LucideIcons[iconName as keyof typeof LucideIcons],
			type: typeof LucideIcons[iconName as keyof typeof LucideIcons],
			available: Object.keys(LucideIcons).includes(iconName),
		});
	}
	if (!iconName) return null;
	const maybeIcon = LucideIcons[iconName as keyof typeof LucideIcons];
	if (
		(typeof maybeIcon === "function" || typeof maybeIcon === "object") &&
		maybeIcon !== null
	) {
		const Icon = maybeIcon as React.ElementType;
		return <Icon size={size} className={className} />;
	}
	// fallback to HelpCircle icon
	const HelpIcon = LucideIcons.HelpCircle as React.ElementType;
	return <HelpIcon size={size} className={className} />;
}

interface TechStackSectionProps {
	title?: string;
	description?: string;
	stacks: TechStack[];
}

export const TechStackSection = ({
	title,
	description,
	stacks,
}: TechStackSectionProps) => {
	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const tabsListRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const tabsList = tabsListRef.current;
		if (tabsList) {
			let isDown = false;
			let startX: number;
			let scrollLeft: number;

			tabsList.addEventListener("mousedown", (e) => {
				isDown = true;
				startX = e.pageX - tabsList.offsetLeft;
				scrollLeft = tabsList.scrollLeft;
			});

			tabsList.addEventListener("mouseleave", () => {
				isDown = false;
			});

			tabsList.addEventListener("mouseup", () => {
				isDown = false;
			});

			tabsList.addEventListener("mousemove", (e) => {
				if (!isDown) return;
				e.preventDefault();
				const x = e.pageX - tabsList.offsetLeft;
				const walk = (x - startX) * 2;
				tabsList.scrollLeft = scrollLeft - walk;
			});
		}
	}, []);

	if (!stacks || stacks.length === 0) {
		return null;
	}

	const getGridColumns = (itemCount: number) => {
		if (itemCount <= 2) return "grid-cols-2";
		if (itemCount === 3) return "grid-cols-1 sm:grid-cols-3";
		if (itemCount <= 4) return "grid-cols-2 md:grid-cols-4";
		return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
	};

	return (
		<section className="relative z-10 overflow-visible bg-background-dark/50 px-4 pt-16 pb-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={fadeIn}
				>
					<SectionHeading
						title={title}
						description={description}
						centered={true}
						className="!mb-8 !leading-tight relative z-20 overflow-visible break-words"
					/>
				</motion.div>

				<Tabs
					defaultValue={stacks[0].category.toLowerCase()}
					className="w-full"
				>
					<div
						ref={tabsListRef}
						className="scrollbar-hide mb-8 flex justify-center overflow-x-auto"
					>
						<TabsList className="!justify-center inline-flex whitespace-nowrap bg-background-dark/60 backdrop-blur-md">
							{stacks.map((stack, index) => (
								<TabsTrigger
									key={stack.category}
									value={stack.category.toLowerCase()}
									className="px-4 py-2"
								>
									{stack.category}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{stacks.map((stack) => (
						<TabsContent
							key={stack.category}
							value={stack.category.toLowerCase()}
							className="mt-0"
						>
							<div className="rounded-xl bg-background-dark/30 p-4 shadow-lg backdrop-blur-md sm:p-8">
								<div
									className={`grid ${getGridColumns(stack.libraries.length)} gap-4 justify-items-center`}
								>
									{stack.libraries.map((lib) => (
										<TooltipProvider key={lib.name}>
											<Tooltip>
												<TooltipTrigger asChild>
													{lib.link ? (
														<a
															href={lib.link}
															target="_blank"
															rel="noopener noreferrer"
															className="w-full"
														>
															<div className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-border/20 bg-background-dark/50 p-3 text-center shadow-inner backdrop-blur-sm hover:bg-background-dark/70 sm:p-4">
																<div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 sm:mb-3 sm:h-12 sm:w-12">
																	{lib.customSvg ? (
																		<Image
																			src={lib.customSvg}
																			alt={lib.name}
																			width={100}
																			height={100}
																			className="opacity-80"
																		/>
																	) : (
																		getLucideIconComponent(lib.lucideIcon)
																	)}
																</div>
																<p className="font-medium text-primary text-sm sm:text-base">
																	{lib.name}
																</p>
															</div>
														</a>
													) : (
														<div className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-border/20 bg-background-dark/50 p-3 text-center shadow-inner backdrop-blur-sm hover:bg-background-dark/70 sm:p-4">
															<div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 sm:mb-3 sm:h-12 sm:w-12">
																{lib.customSvg ? (
																	<Image
																		src={lib.customSvg}
																		alt={lib.name}
																		width={100}
																		height={100}
																		className="opacity-80"
																	/>
																) : (
																	getLucideIconComponent(lib.lucideIcon)
																)}
															</div>
															<p className="font-medium text-primary text-sm sm:text-base">
																{lib.name}
															</p>
														</div>
													)}
												</TooltipTrigger>
												<TooltipContent className="border border-primary/30 bg-background-dark/90">
													<p className="text-primary/80">{lib.description}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									))}
								</div>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	);
};
