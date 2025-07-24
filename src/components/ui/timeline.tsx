"use client";
import {
	motion,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AuroraText } from "../magicui/aurora-text";
export interface TimelineEntry {
	title: string;
	subtitle?: string;
	content: React.ReactNode;
}

/**
 * TimelineDealScales renders a timeline using the provided data.
 * Pass any TimelineEntry[] as the `data` prop.
 */
export const TimelineDealScales = ({ data }: { data: TimelineEntry[] }) => (
	<Timeline data={data} />
);

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
	const ref = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (ref.current) {
			const rect = ref.current.getBoundingClientRect();
			setHeight(rect.height);
		}
	}, [ref]);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start 10%", "end 50%"],
	});

	const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
	const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

	return (
		<div
			className="w-full rounded-lg bg-card font-sans md:px-10"
			ref={containerRef}
		>
			<div ref={ref} className="relative mx-auto max-w-7xl pb-20">
				{data.map((item, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="flex justify-start pt-10 md:gap-10 md:pt-40"
					>
						<div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
							<div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full md:left-3">
								<div className="h-4 w-4 rounded-full border border-neutral-300 p-2 dark:border-neutral-700" />
							</div>
							<div className="hidden flex-col md:flex md:pl-20">
								<AuroraText className="font-bold text-neutral-500 text-xl md:text-5xl dark:text-neutral-500 ">
									{item.title}
								</AuroraText>
								{item.subtitle && (
									<p className="mt-2 text-lg text-muted-foreground">
										{item.subtitle}
									</p>
								)}
							</div>
						</div>
						<div className="relative w-full pr-4 pl-20 md:pl-4">
							<div className="md:hidden">
								<h3 className="mb-1 block text-left font-bold text-2xl text-neutral-500 dark:text-neutral-500">
									{item.title}
								</h3>
								{item.subtitle && (
									<p className="mb-4 text-md text-muted-foreground">
										{item.subtitle}
									</p>
								)}
							</div>
							{item.content}{" "}
						</div>
					</div>
				))}
				<div
					style={{
						height: `${height}px`,
					}}
					className="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[0%] from-transparent via-neutral-200 to-[99%] to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8 dark:via-neutral-700 "
				>
					<motion.div
						style={{
							height: heightTransform,
							opacity: opacityTransform,
						}}
						className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[0%] from-purple-500 via-[10%] via-blue-500 to-transparent"
					/>
				</div>
			</div>
		</div>
	);
};
