"use client";
import { AuroraText } from "@/components/magicui/aurora-text";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CARD_ROTATION_INTERVAL = 5000;

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
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		startFlipping();

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);
	const startFlipping = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		intervalRef.current = setInterval(() => {
			setCards((prevCards) => {
				if (prevCards.length === 0) {
					return prevCards;
				}
				const newArray = [...prevCards]; // create a copy of the array
				const lastCard = newArray.pop();
				if (lastCard) {
					newArray.unshift(lastCard); // move the last element to the front
				}
				return newArray;
			});
		}, CARD_ROTATION_INTERVAL);
	};

	return (
		<div
			className={`group relative mx-auto w-full ${className ?? ""}`}
			style={{ height: `${CARD_HEIGHT}px` }}
			onMouseEnter={() => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
			}}
			onMouseLeave={startFlipping}
		>
			{cards.map((card, index) => {
				return (
					<motion.div
						key={card.id}
						className="absolute flex w-full flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_16px_60px_-45px_rgba(59,130,246,0.35)] backdrop-blur-md dark:border-white/[0.08] dark:bg-black dark:shadow-white/[0.05]"
						data-testid="card-stack-item"
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
