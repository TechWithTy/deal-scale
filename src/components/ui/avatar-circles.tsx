"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Avatar = {
	imageUrl: string;
	profileUrl?: string;
	name?: string;
};

type TooltipInteraction = "tooltip" | "none";

interface AvatarCirclesProps {
	className?: string;
	numPeople?: number;
	avatarUrls: Avatar[];
	interaction?: TooltipInteraction;
	tooltipRenderer?: (avatar: Avatar, index: number) => ReactNode;
}

const buildFallbackLabel = (avatar: Avatar, index: number) => {
	if (avatar.name) {
		return avatar.name;
	}
	if (avatar.profileUrl) {
		try {
			const url = new URL(avatar.profileUrl);
			return url.hostname;
		} catch {
			return avatar.profileUrl;
		}
	}
	return `Avatar ${index + 1}`;
};

export const AvatarCircles = ({
	numPeople,
	className,
	avatarUrls,
	interaction = "none",
	tooltipRenderer,
}: AvatarCirclesProps) => {
	const renderAvatar = (avatar: Avatar, index: number) => {
		const image = (
			<img
				className="hover:-translate-y-0.5 h-10 w-10 rounded-full border-2 border-background/60 object-cover shadow-md transition hover:shadow-lg"
				src={avatar.imageUrl}
				width={40}
				height={40}
				alt={avatar.name ?? `Profile ${index + 1}`}
				loading="lazy"
			/>
		);

		const label =
			interaction === "tooltip"
				? (tooltipRenderer?.(avatar, index) ??
					buildFallbackLabel(avatar, index))
				: null;

		const wrapped = (
			<div
				className={cn(
					"group relative inline-flex",
					interaction === "tooltip" && "cursor-pointer",
				)}
			>
				{image}
				{label ? (
					<span className="-translate-x-1/2 pointer-events-none absolute inset-x-1/2 top-full z-40 w-max translate-y-2 rounded-full bg-foreground/80 px-2 py-1 text-center font-semibold text-[10px] text-background uppercase tracking-wide opacity-0 shadow-lg transition group-hover:translate-y-1 group-hover:opacity-100">
						{label}
					</span>
				) : null}
			</div>
		);

		if (avatar.profileUrl) {
			return (
				<a
					key={`${avatar.profileUrl}-${index.toString()}`}
					href={avatar.profileUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex"
				>
					{wrapped}
				</a>
			);
		}

		return (
			<div key={`avatar-${index.toString()}`} className="inline-flex">
				{wrapped}
			</div>
		);
	};

	return (
		<div className={cn("-space-x-3 flex", className)}>
			{avatarUrls.map(renderAvatar)}
			{numPeople && numPeople > avatarUrls.length ? (
				<div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background/70 bg-primary/15 font-semibold text-primary text-xs uppercase tracking-widest">
					+{numPeople - avatarUrls.length}
				</div>
			) : null}
		</div>
	);
};
