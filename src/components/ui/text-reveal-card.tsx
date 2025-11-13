"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type React from "react";
import { memo, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export const TextRevealCard = ({
	text,
	revealText,
	children,
	className,
}: {
	text: string;
	revealText: string;
	children?: React.ReactNode;
	className?: string;
}) => {
	const [widthPercentage, setWidthPercentage] = useState(0);
	const cardRef = useRef<HTMLDivElement | any>(null);
	const [left, setLeft] = useState(0);
	const [localWidth, setLocalWidth] = useState(0);
	const [isMouseOver, setIsMouseOver] = useState(false);

	useEffect(() => {
		if (cardRef.current) {
			const { left, width: localWidth } =
				cardRef.current.getBoundingClientRect();
			setLeft(left);
			setLocalWidth(localWidth);
		}
	}, []);

	function mouseMoveHandler(event: any) {
		event.preventDefault();

		const { clientX } = event;
		if (cardRef.current) {
			const relativeX = clientX - left;
			setWidthPercentage((relativeX / localWidth) * 100);
		}
	}

	function mouseLeaveHandler() {
		setIsMouseOver(false);
		setWidthPercentage(0);
	}
	function mouseEnterHandler() {
		setIsMouseOver(true);
	}
	function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
		event.preventDefault();
		const clientX = event.touches[0]!.clientX;
		if (cardRef.current) {
			const relativeX = clientX - left;
			setWidthPercentage((relativeX / localWidth) * 100);
		}
	}

	const rotateDeg = (widthPercentage - 50) * 0.1;
	return (
		<div
			onMouseEnter={mouseEnterHandler}
			onMouseLeave={mouseLeaveHandler}
			onMouseMove={mouseMoveHandler}
			onTouchStart={mouseEnterHandler}
			onTouchEnd={mouseLeaveHandler}
			onTouchMove={touchMoveHandler}
			ref={cardRef}
			className={cn(
				"relative w-[40rem] overflow-hidden rounded-lg border border-white/[0.08] bg-[#1d1c20] p-8",
				className,
			)}
		>
			{children}

			<div className="relative flex min-h-[12rem] flex-col justify-center overflow-hidden">
				<motion.div
					style={{
						width: "100%",
					}}
					className="pr-4"
					animate={
						isMouseOver
							? {
									opacity: widthPercentage > 0 ? 1 : 0,
									clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
								}
							: {
									clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
								}
					}
					transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
					className="-translate-y-1/2 absolute top-1/2 left-0 z-20 bg-[#1d1c20] pr-4 will-change-transform"
				>
					<p
						style={{
							textShadow: "4px 4px 15px rgba(0,0,0,0.5)",
						}}
						className="bg-gradient-to-b from-white to-neutral-300 bg-clip-text py-6 font-bold text-2xl text-transparent text-white sm:text-[2.75rem]"
					>
						{revealText}
					</p>
				</motion.div>
				<motion.div
					animate={{
						left: `${widthPercentage}%`,
						rotate: `${rotateDeg}deg`,
						opacity: widthPercentage > 0 ? 1 : 0,
					}}
					transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
					className="-translate-y-1/2 absolute z-50 h-[70%] w-[6px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent will-change-transform"
					style={{ top: "50%" }}
				></motion.div>

				<div className=" overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
					<p className="bg-[#323238] bg-clip-text py-6 font-bold text-2xl text-transparent sm:text-[2.75rem]">
						{text}
					</p>
					<MemoizedStars />
				</div>
			</div>
		</div>
	);
};

export const TextRevealCardTitle = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<h2 className={twMerge("mb-2 text-lg text-white", className)}>
			{children}
		</h2>
	);
};

export const TextRevealCardDescription = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<p className={twMerge("text-[#a9a9a9] text-sm", className)}>{children}</p>
	);
};

const Stars = () => {
	const randomMove = () => Math.random() * 4 - 2;
	const randomOpacity = () => Math.random();
	const random = () => Math.random();
	return (
		<div className="absolute inset-0">
			{[...Array(80)].map((_, i) => (
				<motion.span
					key={`star-${i}`}
					animate={{
						top: `calc(${random() * 100}% + ${randomMove()}px)`,
						left: `calc(${random() * 100}% + ${randomMove()}px)`,
						opacity: randomOpacity(),
						scale: [1, 1.2, 0],
					}}
					transition={{
						duration: random() * 10 + 20,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
					style={{
						position: "absolute",
						top: `${random() * 100}%`,
						left: `${random() * 100}%`,
						width: `2px`,
						height: `2px`,
						backgroundColor: "white",
						borderRadius: "50%",
						zIndex: 1,
					}}
					className="inline-block"
				></motion.span>
			))}
		</div>
	);
};

export const MemoizedStars = memo(Stars);
