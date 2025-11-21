"use client";
import * as React from "react";

export type FileChip = {
	name: string;
	url: string;
	kind?: "image" | "video" | "other";
};

export type FileChipsProps = {
	files?: FileChip[];
	pageId?: string;
	slug?: string;
	imageUrl?: string;
	videoUrl?: string;
};

function isImage(url: string): boolean {
	return /(\.(jpg|jpeg|png|gif|webp|avif|svg|heic|heif))(?:$|\?|#)/i.test(url);
}

function isVideo(url: string): boolean {
	return /(\.(mp4|webm|ogg|ogv|mov|m4v))(?:$|\?|#)/i.test(url);
}

export function FileChips({
	files,
	pageId,
	slug,
	imageUrl,
	videoUrl,
}: FileChipsProps) {
	if (!files || files.length === 0) return null;

	const filtered = files.filter((f) => {
		// Hide the file that is currently depicted as main image or video
		if (imageUrl && f.url === imageUrl) return false;
		if (videoUrl && f.url === videoUrl) return false;
		// Keep everything else; caller can decide additional filters later
		return true;
	});

	if (filtered.length === 0) return null;

	return (
		<div className="mt-2 flex flex-wrap items-center gap-1.5">
			{filtered.map((f) => {
				const to = encodeURIComponent(f.url);
				const pid = pageId ? `&pageId=${encodeURIComponent(pageId)}` : "";
				const s = slug ? `&slug=${encodeURIComponent(slug)}` : "";
				const url = `/api/redirect?isFile=1&to=${to}${pid}${s}`;
				const icon =
					f.kind === "video" || isVideo(f.url)
						? "▶"
						: isImage(f.url)
							? "🖼️"
							: "⬇";
				return (
					<button
						key={f.url}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							window.open(url, "_self");
						}}
						className="inline-flex max-w-[10rem] items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground leading-5 hover:bg-accent"
						aria-label={`Open ${f.name}`}
						title={f.name}
					>
						<span aria-hidden>{icon}</span>
						<span className="truncate">{f.name}</span>
					</button>
				);
			})}
		</div>
	);
}
