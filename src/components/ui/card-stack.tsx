"use client";
import { AuroraText } from "@/components/magicui/aurora-text";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

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
}: {
	items: Card[];
	offset?: number;
	scaleFactor?: number;
}) => {
	const CARD_OFFSET = offset || 10;
	const SCALE_FACTOR = scaleFactor || 0.06;
	const CARD_HEIGHT = 280;
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
			className="relative mx-auto w-[min(19rem,90vw)] md:w-[24rem]"
			style={{ height: `${CARD_HEIGHT}px` }}
		>
			{cards.map((card, index) => {
				return (
					<motion.div
						key={card.id}
						className="absolute flex w-full flex-col rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_24px_90px_-45px_rgba(59,130,246,0.35)] backdrop-blur-md dark:border-white/[0.1] dark:bg-black dark:shadow-white/[0.05]"
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
