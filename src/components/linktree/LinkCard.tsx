"use client";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";
import { FileChips } from "./card/FileChips";
import { LinkCardBody } from "./card/LinkCardBody";
import { LinkCardHeader } from "./card/LinkCardHeader";
import { MediaPreview } from "./card/MediaPreview";

export type LinkCardProps = {
	title: string;
	href: string;
	description?: string;
	iconEmoji?: string;
	imageUrl?: string;
	thumbnailUrl?: string;
	videoUrl?: string;
	details?: string;
	files?: Array<{
		name: string;
		url: string;
		kind?: "image" | "video" | "other";
		ext?: string;
	}>;
	pageId?: string;
	slug?: string;
	highlighted?: boolean;
	showArrow?: boolean;
	openInNewTab?: boolean;
};

export function LinkCard({
	title,
	href,
	description,
	iconEmoji,
	imageUrl,
	thumbnailUrl,
	videoUrl,
	details,
	files,
	pageId,
	slug,
	highlighted,
	showArrow,
	openInNewTab,
}: LinkCardProps) {
	const { toast } = useToast();
	const isExternalHref = /^(https?:)?\/\//i.test(href);
	const target = isExternalHref || Boolean(openInNewTab) ? "_blank" : undefined;
	const rel = target === "_blank" ? "noopener noreferrer" : undefined;
	const common =
		"relative flex items-center gap-4 p-5 rounded-xl border bg-card text-card-foreground hover:shadow-md transition-shadow duration-200";

	// Fire-and-forget click tracker for Notion "Redirects (Clicks)"
	const handleClick = React.useCallback(() => {
		try {
			const payload = { pageId, slug } as { pageId?: string; slug?: string };
			if (!(payload.pageId || payload.slug)) return;
			const data = JSON.stringify(payload);
			// Inform user immediately
			toast({ title: "Counting click", description: title });
			if (
				typeof navigator !== "undefined" &&
				typeof navigator.sendBeacon === "function"
			) {
				const blob = new Blob([data], { type: "application/json" });
				navigator.sendBeacon("/api/linktree/click2", blob);
			} else {
				fetch("/api/linktree/click2", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: data,
					keepalive: true,
				}).catch(() => {});
			}
		} catch {
			// ignore client tracking errors
		}
	}, [pageId, slug, title, toast]);

	return (
		<a
			href={href}
			target={target}
			rel={rel}
			className={common}
			onMouseDown={handleClick}
			onClick={handleClick}
			onAuxClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter") handleClick();
			}}
		>
			{highlighted ? (
				<BorderBeam className="pointer-events-none" size={64} />
			) : null}
			<LinkCardHeader
				thumbnailUrl={thumbnailUrl}
				imageUrl={imageUrl}
				iconEmoji={iconEmoji}
			/>
			<div className="min-w-0 flex-1">
				<LinkCardBody
					title={title}
					description={description}
					details={details}
				/>
				<MediaPreview
					imageUrl={imageUrl}
					thumbnailUrl={thumbnailUrl}
					videoUrl={videoUrl}
					files={files}
				/>
				<FileChips
					files={files}
					pageId={pageId}
					slug={slug}
					imageUrl={imageUrl}
					videoUrl={videoUrl}
				/>
			</div>

			{showArrow ? (
				<span aria-hidden className="ml-2 text-muted-foreground">
					↗
				</span>
			) : null}
		</a>
	);
}

export default LinkCard;
