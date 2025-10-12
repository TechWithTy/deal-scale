"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface TestimonialAvatarProps {
	name: string;
	image?: string;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function TestimonialAvatar({ name, image }: TestimonialAvatarProps) {
	if (image) {
		return (
			<Image
				src={image}
				width={36}
				height={36}
				alt={name}
				className="mb-4 h-16 w-16 rounded-full border-2 border-primary/30 object-cover sm:mr-4 sm:mb-0 sm:h-12 sm:w-12"
				sizes="64px"
			/>
		);
	}

	return (
		<div
			className={cn(
				"mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30",
				"bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground",
				"dark:from-primary/90 dark:to-secondary/90 dark:text-primary-foreground",
				"font-bold text-lg sm:mr-4 sm:mb-0 sm:h-12 sm:w-12 sm:text-base",
			)}
		>
			{getInitials(name)}
		</div>
	);
}
