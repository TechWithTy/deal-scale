"use client";
import { AuroraText } from "@/components/magicui/aurora-text";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

let interval: any;

type Card = {
	id: number;
	name: string;
	designation: string;
	content: React.ReactNode;
};

export const CardStack = ({
	items,
	offset,
	scaleFactor,
	height,
	className,
}: {
	items: Card[];
	offset?: number;
	scaleFactor?: number;
	height?: number;
	className?: string;
}) => {
	const CARD_OFFSET = offset || 10;
	const SCALE_FACTOR = scaleFactor || 0.06;
	const CARD_HEIGHT = height ?? 220;
	const [cards, setCards] = useState<Card[]>(items);

	useEffect(() => {
		startFlipping();

		return () => clearInterval(interval);
	}, []);
	const startFlipping = () => {
		interval = setInterval(() => {
			setCards((prevCards: Card[]) => {
				const newArray = [...prevCards]; // create a copy of the array
				newArray.unshift(newArray.pop()!); // move the last element to the front
				return newArray;
			});
		}, 5000);
	};

	return (
		<div
			className={`group relative mx-auto w-full ${className ?? ""}`}
			style={{ height: `${CARD_HEIGHT}px` }}
			onMouseEnter={() => clearInterval(interval)}
			onMouseLeave={startFlipping}
		>
			{cards.map((card, index) => {
				return (
					<motion.div
						key={card.id}
						className="absolute flex w-full flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_16px_60px_-45px_rgba(59,130,246,0.35)] backdrop-blur-md dark:border-white/[0.08] dark:bg-black dark:shadow-white/[0.05]"
						style={{
							transformOrigin: "top center",
							height: `${CARD_HEIGHT}px`,
						}}
						animate={{
							top: index * -CARD_OFFSET,
							scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
							zIndex: cards.length - index, //  decrease z-index for the cards that are behind
						}}
					>
						<div className="space-y-3 font-normal text-neutral-700 dark:text-neutral-200">
							{card.content}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};
