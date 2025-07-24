"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { Children, cloneElement } from "react";

// --- Skip Trace Example Data and Types ---

// Notification card for demo purposes (not used in skip trace)
export const Notification = ({
	name,
	description,
	icon,
	color,
	time,
}: {
	name: string;
	description: string;
	icon: string;
	color: string;
	time: string;
}) => {
	return (
		<figure
			className={cn(
				"relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
				// animation styles
				"transition-all duration-200 ease-in-out hover:scale-[103%]",
				// light styles
				"bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
				// dark styles
				"transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
			)}
		>
			<div className="flex flex-row items-center gap-3">
				<div
					className="flex size-10 items-center justify-center rounded-2xl"
					style={{ backgroundColor: color }}
				>
					<span className="text-lg">{icon}</span>
				</div>
				<div className="flex flex-col overflow-hidden">
					<figcaption className="flex flex-row items-center whitespace-pre font-medium text-lg dark:text-white ">
						<span className="text-sm sm:text-lg">{name}</span>
						<span className="mx-1">·</span>
						<span className="text-gray-500 text-xs">{time}</span>
					</figcaption>
					<p className="font-normal text-sm dark:text-white/60">
						{description}
					</p>
				</div>
			</div>
		</figure>
	);
};

// AnimatedList: Animates children in sequence with a delay (default 100ms)
export const AnimatedList = ({
	children,
	delay = 100,
	className,
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}) => {
	const childArray = Children.toArray(children);
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{childArray.map((child, idx) =>
				cloneElement(child as React.ReactElement, {
					style: {
						...((child as React.ReactElement).props.style || {}),
						opacity: 0,
						animation: `fadeInUp 0.5s ease ${idx * delay}ms forwards`,
					},
					key: (child as React.ReactElement).key ?? idx,
				}),
			)}
			<style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
		</div>
	);
};
