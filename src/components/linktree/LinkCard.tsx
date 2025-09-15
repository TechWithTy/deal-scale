"use client";
import * as React from "react";

export type LinkCardProps = {
	title: string;
	href: string;
	description?: string;
	iconEmoji?: string;
	imageUrl?: string;
	videoUrl?: string;
	details?: string;
	files?: Array<{ name: string; url: string }>;
	onPreview?: (media: {
		type: "image" | "video";
		url: string;
		title: string;
	}) => void;
};

export function LinkCard({
	title,
	href,
	description,
	iconEmoji,
	imageUrl,
	videoUrl,
	details,
	files,
	onPreview,
}: LinkCardProps) {
	const isExternal = /^(https?:)?\/\//i.test(href);
	const common =
		"flex items-center gap-4 p-5 rounded-xl border bg-card text-card-foreground hover:shadow-md transition-shadow duration-200";

	return (
		<a
			href={href}
			target={isExternal ? "_blank" : undefined}
			rel={isExternal ? "noopener noreferrer" : undefined}
			className={common}
		>
			<div className="shrink-0">
				{imageUrl ? (
					// Decorative image/icon
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={imageUrl}
						alt=""
						className="h-8 w-8 rounded-md object-cover"
						loading="lazy"
						decoding="async"
					/>
				) : (
					<div className="text-2xl" aria-hidden>
						{iconEmoji ?? "🚀"}
					</div>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<div className="truncate font-medium">{title}</div>
				<div className="truncate text-muted-foreground text-sm">
					{description ?? "Explore more details"}
				</div>
				{details && (
					<div className="mt-1 text-muted-foreground text-xs">{details}</div>
				)}
				{files && files.length > 0 && (
					<div className="mt-2 flex flex-wrap items-center gap-2">
						{files.map((f) => (
							<a
								key={f.url}
								href={f.url}
								target="_blank"
								rel="noopener noreferrer"
								download
								className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-muted-foreground text-xs hover:bg-accent"
								aria-label={`Download ${f.name}`}
							>
								<span aria-hidden>⬇</span>
								<span className="max-w-[10rem] truncate">{f.name}</span>
							</a>
						))}
					</div>
				)}
			</div>
			{(imageUrl || videoUrl) && onPreview ? (
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						if (videoUrl) {
							onPreview({ type: "video", url: videoUrl, title });
							return;
						}
						if (imageUrl) {
							onPreview({ type: "image", url: imageUrl, title });
						}
					}}
					className="ml-2 rounded-md border px-2 py-1 text-muted-foreground text-xs hover:bg-accent"
				>
					Preview
				</button>
			) : null}
			{isExternal ? (
				<span aria-hidden className="ml-2 text-muted-foreground">
					↗
				</span>
			) : null}
		</a>
	);
}
