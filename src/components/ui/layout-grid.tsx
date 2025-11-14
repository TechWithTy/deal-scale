"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";

type Card = {
	id: number;
	content?: JSX.Element | React.ReactNode | string;
	contentClassName?: string;
	className: string;
	thumbnail?: string;
	overlay?: React.ReactNode;
};

type LayoutGridProps = {
	cards: Card[];
	interactive?: boolean;
	showThumbnails?: boolean;
	baseCardClassName?: string;
};

export const LayoutGrid = ({
	cards,
	interactive = true,
	showThumbnails = true,
	baseCardClassName = "rounded-xl bg-white",
}: LayoutGridProps) => {
	if (!interactive) {
		return (
			<div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-4 p-6 sm:p-8 md:grid-cols-2 md:p-10 xl:grid-cols-3">
				{cards.map((card) => {
					const needsPositioning =
						(showThumbnails && Boolean(card.thumbnail)) ||
						Boolean(card.overlay);
					return (
						<div
							key={card.id}
							className={cn(
								baseCardClassName,
								needsPositioning && "relative",
								card.className,
							)}
						>
							{showThumbnails && card.thumbnail ? (
								<ImageComponent card={card} />
							) : null}
							{card.overlay ? (
								<div className="absolute inset-0 z-10">{card.overlay}</div>
							) : null}
							{card.content ? (
								<div
									className={cn(
										"relative z-20 h-full w-full",
										card.contentClassName,
									)}
								>
									{card.content}
								</div>
							) : null}
						</div>
					);
				})}
			</div>
		);
	}

	const [selected, setSelected] = useState<Card | null>(null);
	const [lastSelected, setLastSelected] = useState<Card | null>(null);

	const handleClick = (card: Card) => {
		if (!interactive) {
			return;
		}
		setLastSelected(selected);
		setSelected(card);
	};

	const handleOutsideClick = () => {
		if (!interactive) {
			return;
		}
		setLastSelected(selected);
		setSelected(null);
	};

	return (
		<div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-4 p-6 sm:p-8 md:grid-cols-2 md:p-10 xl:grid-cols-3">
			{cards.map((card) => (
				<div key={card.id} className={cn(baseCardClassName, card.className)}>
					<motion.div
						onClick={() => handleClick(card)}
						className={cn(
							"relative overflow-hidden",
							selected?.id === card.id
								? "absolute inset-0 z-50 m-auto flex h-1/2 w-full cursor-pointer flex-col flex-wrap items-center justify-center rounded-lg md:w-1/2"
								: lastSelected?.id === card.id
									? "z-40 h-full w-full"
									: "h-full w-full",
						)}
						layoutId={`card-${card.id}`}
					>
						{interactive && selected?.id === card.id && (
							<SelectedCard selected={selected} />
						)}
						{showThumbnails ? <ImageComponent card={card} /> : null}
						{card.overlay ? (
							<div className="absolute inset-0 z-10">{card.overlay}</div>
						) : null}
						{card.content ? (
							<div
								className={cn(
									"relative z-20 h-full w-full",
									card.contentClassName,
								)}
							>
								{card.content}
							</div>
						) : null}
					</motion.div>
				</div>
			))}
			{interactive ? (
				<motion.div
					onClick={handleOutsideClick}
					className={cn(
						"absolute top-0 left-0 z-10 h-full w-full bg-black opacity-0",
						selected?.id ? "pointer-events-auto" : "pointer-events-none",
					)}
					animate={{ opacity: selected?.id ? 0.3 : 0 }}
				/>
			) : null}
		</div>
	);
};

const ImageComponent = ({ card }: { card: Card }) => {
	return card.thumbnail ? (
		<motion.img
			layoutId={`image-${card.id}-image`}
			src={card.thumbnail}
			height="500"
			width="500"
			className={cn(
				"absolute inset-0 h-full w-full object-cover object-top transition duration-200",
			)}
			alt="thumbnail"
		/>
	) : null;
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
	return (
		<div className="relative z-[60] flex h-full w-full flex-col justify-end rounded-lg bg-transparent shadow-2xl">
			<motion.div
				initial={{
					opacity: 0,
				}}
				animate={{
					opacity: 0.6,
				}}
				className="absolute inset-0 z-10 h-full w-full bg-black opacity-60"
			/>
			<motion.div
				layoutId={`content-${selected?.id}`}
				initial={{
					opacity: 0,
					y: 100,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				exit={{
					opacity: 0,
					y: 100,
				}}
				transition={{
					duration: 0.3,
					ease: "easeInOut",
				}}
				className="relative z-[70] px-8 pb-4"
			>
				{selected?.content}
			</motion.div>
		</div>
	);
};
