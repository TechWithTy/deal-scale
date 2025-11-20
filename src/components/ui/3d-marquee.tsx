"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type MarqueeImage =
	| string
	| {
			src: string;
			alt?: string;
	  };

interface ThreeDMarqueeProps {
	images: MarqueeImage[];
	className?: string;
	itemClassName?: string;
	variant?: "card" | "hero";
}

export const ThreeDMarquee = ({
	images,
	className,
	itemClassName,
	variant = "card",
}: ThreeDMarqueeProps) => {
	const normalizedImages = images.map((image, index) =>
		typeof image === "string"
			? { src: image, alt: `Logo ${index + 1}` }
			: { alt: `Logo ${index + 1}`, ...image },
	);

	const chunkSize = Math.ceil(normalizedImages.length / 4) || 1;
	const chunks = Array.from({ length: 4 }, (_, colIndex) => {
		const start = colIndex * chunkSize;
		return normalizedImages.slice(start, start + chunkSize);
	});

	const isHeroVariant = variant === "hero";

	return (
		<div
			className={cn(
				"mx-auto block w-full overflow-hidden rounded-2xl border border-black/5",
				"h-[500px] sm:h-[560px] lg:h-[640px]",
				"bg-gradient-to-b from-white via-slate-50 to-slate-100",
				"pt-4 pb-14 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20",
				"dark:border-white/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900",
				isHeroVariant &&
					"h-full min-h-full rounded-none border-none bg-transparent pt-0 pb-0 dark:bg-transparent",
				className,
			)}
		>
			<div className="relative flex size-full items-center justify-center">
				<div
					className={cn(
						"relative h-full w-full max-w-[980px] px-6 sm:px-8 lg:px-10",
						isHeroVariant && "max-w-none px-0",
					)}
				>
					<div
						className="absolute inset-0"
						style={{
							top: "50%",
							left: "50%",
							transform:
								"perspective(1400px) translate3d(-48%, -52%, 0) rotateX(48deg) rotateZ(-32deg)",
						}}
					>
						<div
							className={cn(
								"grid h-[min(96vw,_700px)] w-[min(96vw,_700px)] origin-center grid-cols-4 gap-5 sm:h-[min(92vw,_780px)] sm:w-[min(92vw,_780px)] sm:gap-7 lg:h-[900px] lg:w-[900px] lg:gap-8",
								isHeroVariant &&
									"h-[min(120vw,_960px)] w-[min(120vw,_960px)] sm:h-[min(110vw,_1040px)] sm:w-[min(110vw,_1040px)] lg:h-[1100px] lg:w-[1100px]",
							)}
						>
							{chunks.map((subarray, columnIndex) => {
								const columnKey = `marquee-column-${columnIndex}`;

								return (
									<motion.div
										animate={{ y: columnIndex % 2 === 0 ? 96 : -96 }}
										transition={{
											duration: columnIndex % 2 === 0 ? 12 : 14,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
										}}
										key={columnKey}
										className={cn(
											"flex flex-col items-start gap-6 sm:gap-8",
											isHeroVariant && "gap-8 sm:gap-10",
										)}
									>
										<GridLineVertical className="-left-4" offset="72px" />
										{subarray.map(({ src, alt }, itemIndex) => {
											const key = `marquee-image-${columnIndex}-${itemIndex}`;

											return (
												<div className="relative" key={key}>
													<GridLineHorizontal
														className="-top-4"
														offset="24px"
													/>
													<motion.div
														whileHover={{ y: -6, scale: 1.02 }}
														transition={{
															type: "spring",
															stiffness: 260,
															damping: 22,
														}}
														className={cn(
															"flex h-28 w-40 items-center justify-center rounded-2xl bg-white/95 p-5 shadow-black/10 shadow-lg ring-1 ring-black/5 backdrop-blur-sm sm:h-32 sm:w-44 sm:p-6",
															"dark:bg-slate-900/80 dark:shadow-slate-900/40 dark:ring-white/10",
															isHeroVariant &&
																"bg-white/85 dark:bg-slate-900/75",
															itemClassName,
														)}
													>
														<motion.img
															key={key}
															src={src}
															alt={alt}
															loading="lazy"
															decoding="async"
															draggable={false}
															className="h-full w-full object-contain"
															width={176}
															height={128}
														/>
													</motion.div>
												</div>
											);
										})}
									</motion.div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const GridLineHorizontal = ({
	className,
	offset,
}: {
	className?: string;
	offset?: string;
}) => {
	return (
		<div
			style={
				{
					"--background": "#ffffff",
					"--color": "rgba(0, 0, 0, 0.2)",
					"--height": "1px",
					"--width": "5px",
					"--fade-stop": "90%",
					"--offset": offset || "200px", //-100px if you want to keep the line inside
					"--color-dark": "rgba(255, 255, 255, 0.2)",
					maskComposite: "exclude",
				} as React.CSSProperties
			}
			className={cn(
				"absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
				"bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
				"[background-size:var(--width)_var(--height)]",
				"[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
				"[mask-composite:exclude]",
				"z-30",
				"dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
				className,
			)}
		/>
	);
};

const GridLineVertical = ({
	className,
	offset,
}: {
	className?: string;
	offset?: string;
}) => {
	return (
		<div
			style={
				{
					"--background": "#ffffff",
					"--color": "rgba(0, 0, 0, 0.2)",
					"--height": "5px",
					"--width": "1px",
					"--fade-stop": "90%",
					"--offset": offset || "150px", //-100px if you want to keep the line inside
					"--color-dark": "rgba(255, 255, 255, 0.2)",
					maskComposite: "exclude",
				} as React.CSSProperties
			}
			className={cn(
				"absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
				"bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
				"[background-size:var(--width)_var(--height)]",
				"[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
				"[mask-composite:exclude]",
				"z-30",
				"dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
				className,
			)}
		/>
	);
};
