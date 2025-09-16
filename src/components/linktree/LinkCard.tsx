"use client";
import * as React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";

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
	thumbnailUrl,
	videoUrl,
	details,
	files,
	pageId,
	slug,
	highlighted,
	showArrow,
	openInNewTab,
	onPreview,
}: LinkCardProps) {
	const isExternalHref = /^(https?:)?\/\//i.test(href);
	const target = isExternalHref || Boolean(openInNewTab) ? "_blank" : undefined;
	const rel = target === "_blank" ? "noopener noreferrer" : undefined;
	const common =
		"relative flex items-center gap-4 p-5 rounded-xl border bg-card text-card-foreground hover:shadow-md transition-shadow duration-200";

	// Determine best preview sources from files
	const firstVideoFromFiles = React.useMemo(() => {
		const vids = files?.filter(
			(f) =>
				f.kind === "video" || /\.(mp4|webm|ogg|mov|m4v)(?:$|\?|#)/i.test(f.url),
		);
		return vids?.length ? vids[0] : undefined;
	}, [files]);

	const firstImageFromFiles = React.useMemo(() => {
		const imgs = files?.filter(
			(f) =>
				f.kind === "image" ||
				/\.(jpg|jpeg|png|gif|webp|avif|svg)(?:$|\?|#)/i.test(f.url),
		);
		return imgs && imgs.length ? imgs[0] : undefined;
	}, [files]);

	// Unified video source preferred from files, then explicit prop
	const videoSrc = firstVideoFromFiles?.url || videoUrl || undefined;
	const proxiedVideoSrc = videoSrc
		? `/api/proxy-video?url=${encodeURIComponent(videoSrc)}`
		: undefined;

	// Determine extension to gate supported inline playback
	const videoExt = React.useMemo(() => {
		const m = /\.([a-z0-9]+)(?:$|\?|#)/i.exec(videoSrc ?? "");
		return (m?.[1] || "").toLowerCase();
	}, [videoSrc]);

	const supportedInlineExts = new Set([
		"mp4",
		"webm",
		"ogg",
		"ogv",
		"mov",
		"m4v",
	]);
	const canInlinePlay = Boolean(videoSrc) && supportedInlineExts.has(videoExt);

	// Best-effort MIME type detection from file extension; fallback to mp4
	const videoType = React.useMemo(() => {
		if (!videoSrc) return undefined;
		const m = /\.([a-z0-9]+)(?:$|\?|#)/i.exec(videoSrc);
		const ext = (m?.[1] || "").toLowerCase();
		switch (ext) {
			case "mp4":
				return "video/mp4";
			case "webm":
				return "video/webm";
			case "ogg":
			case "ogv":
				return "video/ogg";
			case "mov":
				return "video/quicktime";
			case "m4v":
				return "video/x-m4v";
			default:
				return "video/mp4"; // sensible default for signed URLs without extension
		}
	}, [videoSrc]);

	// Determine if details should be expandable (heuristic: more than ~80 chars or contains a newline)
	const needsToggle = Boolean(
		details && (details.length > 80 || /\n/.test(details)),
	);
	const [expanded, setExpanded] = React.useState(false);
	// Default to showing image when available; video is toggled via chip
	const [showInlineVideo, setShowInlineVideo] = React.useState(false);
	const [showInlineImage, setShowInlineImage] = React.useState(
		Boolean(firstImageFromFiles?.url || imageUrl),
	);
	const [showInlineThumb, setShowInlineThumb] = React.useState(false);

	// Use title as provided (expecting Notion Title after sync)

	return (
		<a href={href} target={target} rel={rel} className={common}>
			{highlighted ? (
				<BorderBeam className="pointer-events-none" size={64} />
			) : null}
			<div className="shrink-0">
				{thumbnailUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={thumbnailUrl}
						alt=""
						className="h-8 w-8 rounded-md object-cover"
						loading="lazy"
						decoding="async"
					/>
				) : imageUrl ? (
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
				{(firstVideoFromFiles?.url ||
					videoUrl ||
					firstImageFromFiles?.url ||
					imageUrl ||
					thumbnailUrl) && (
					<div className="mb-2 flex flex-wrap items-center gap-1.5">
						{videoSrc && (
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									// Decoupled: only toggle video visibility
									setShowInlineVideo((v) => !v);
								}}
								className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-muted-foreground text-[11px] leading-5 hover:bg-accent"
								aria-pressed={showInlineVideo}
								aria-label={
									showInlineVideo ? "Hide video preview" : "Show video preview"
								}
								title={showInlineVideo ? "Hide video" : "Preview video"}
							>
								<span aria-hidden>▶</span>
								<span>Video</span>
							</button>
						)}
						{(firstImageFromFiles?.url || imageUrl) && (
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									// Decoupled: only toggle image visibility
									setShowInlineImage((v) => !v);
								}}
								className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-muted-foreground text-[11px] leading-5 hover:bg-accent"
								aria-pressed={showInlineImage}
								aria-label={
									showInlineImage ? "Hide image preview" : "Show image preview"
								}
								title={showInlineImage ? "Hide image" : "Preview image"}
							>
								<span aria-hidden>🖼️</span>
								<span>Image</span>
							</button>
						)}
						{thumbnailUrl && (
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									// Decoupled: only toggle thumbnail visibility
									setShowInlineThumb((v) => !v);
								}}
								className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-muted-foreground text-[11px] leading-5 hover:bg-accent"
								aria-pressed={showInlineThumb}
								aria-label={
									showInlineThumb ? "Hide thumbnail" : "Show thumbnail"
								}
								title={showInlineThumb ? "Hide thumbnail" : "Preview thumbnail"}
							>
								<span aria-hidden>🖼️</span>
								<span>Thumb</span>
							</button>
						)}
						{files
							?.filter((f) => {
								// Hide video files from the chip list when we already show a video preview
								if (
									canInlinePlay &&
									showInlineVideo &&
									videoSrc &&
									(f.kind === "video" ||
										/\.(mp4|webm|ogg|mov|m4v)(?:$|\?|#)/i.test(f.url))
								) {
									return false;
								}
								// Do not show image chips to avoid navigating away; image preview is inline
								if (
									f.kind === "image" ||
									/\.(jpg|jpeg|png|gif|webp|avif|svg|heic|heif)(?:$|\?|#)/i.test(
										f.url,
									)
								) {
									return false;
								}
								// Also hide the primary image if it's already previewed (safety)
								if (f.url === (firstImageFromFiles?.url || imageUrl))
									return false;
								return true;
							})
							.map((f) => (
								<button
									key={f.url}
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const to = encodeURIComponent(f.url);
										const pid = pageId
											? `&pageId=${encodeURIComponent(pageId)}`
											: "";
										const s = slug ? `&slug=${encodeURIComponent(slug)}` : "";
										const url = `/api/redirect?isFile=1&to=${to}${pid}${s}`;
										window.open(url, "_self");
									}}
									className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-muted-foreground text-[11px] leading-5 hover:bg-accent max-w-[8rem]"
									aria-label={`Download ${f.name}`}
									title={f.name}
								>
									<span aria-hidden>⬇</span>
									<span className="truncate">{f.name}</span>
								</button>
							))}
					</div>
				)}
				<div className="truncate font-medium">{title}</div>
				{/* Description row acts as a toggle when details are long */}
				{needsToggle ? (
					<button
						type="button"
						className="truncate text-muted-foreground text-sm underline-offset-2 hover:underline"
						aria-expanded={expanded}
						onClick={(e) => {
							// Prevent navigating the parent anchor
							e.preventDefault();
							e.stopPropagation();
							setExpanded((v) => !v);
						}}
					>
						{expanded ? "Hide details" : (description ?? "Show details")}
					</button>
				) : description ? (
					<div className="truncate text-muted-foreground text-sm">
						{description}
					</div>
				) : null}
				{details && expanded ? (
					<div className="mt-1 whitespace-pre-wrap text-muted-foreground text-xs">
						{details}
					</div>
				) : null}
				{showInlineVideo || showInlineImage || showInlineThumb ? (
					<div className="mt-2 w-full">
						{showInlineVideo && videoSrc && canInlinePlay ? (
							<video
								key={videoSrc}
								className="w-full rounded"
								controls
								preload="metadata"
								crossOrigin="anonymous"
								playsInline
								controlsList="nodownload"
								disablePictureInPicture
								// No poster to avoid looking like a static image when toggled
								onError={() => {
									setShowInlineVideo(false);
									setShowInlineImage(
										Boolean(firstImageFromFiles?.url || imageUrl),
									);
								}}
							>
								{videoType ? (
									<source src={proxiedVideoSrc ?? videoSrc} type={videoType} />
								) : null}
								{/* Fallback without type to allow browser sniffing */}
								<source src={proxiedVideoSrc ?? videoSrc} />
								<track
									kind="captions"
									srcLang="en"
									label="English"
									default
									src="data:text/vtt,WEBVTT"
								/>
							</video>
						) : null}
						{showInlineVideo && videoSrc && !canInlinePlay ? (
							<div className="w-full rounded border bg-muted/30 p-3 text-muted-foreground text-sm">
								This video format isn’t supported for inline playback.
								<a
									href={videoSrc}
									target="_blank"
									rel="noopener noreferrer"
									className="ml-1 underline"
								>
									Open video
								</a>
							</div>
						) : null}
						{showInlineImage &&
							(() => {
								const rawImg = firstImageFromFiles?.url || imageUrl;
								// If HEIC/HEIF and Cloudinary is configured, fetch as JPG for browser compatibility
								const heic = /(\.heic|\.heif)(?:$|\?|#)/i.test(rawImg ?? "");
								const cloud = (
									typeof process !== "undefined"
										? process.env.CLOUDINARY_CLOUD_NAME
										: undefined
								) as string | undefined;
								const imgSrc =
									heic && cloud && rawImg
										? `https://res.cloudinary.com/${cloud}/image/upload/f_jpg,q_auto/${encodeURIComponent(rawImg)}`
										: rawImg;
								return firstImageFromFiles ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={imgSrc as string}
										alt=""
										className="w-full rounded"
									/>
								) : imageUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={imgSrc as string}
										alt=""
										className="w-full rounded"
									/>
								) : null;
							})()}
						{showInlineThumb && thumbnailUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={thumbnailUrl} alt="" className="w-full rounded" />
						) : null}
					</div>
				) : null}
			</div>

			{showArrow ? (
				<span aria-hidden className="ml-2 text-muted-foreground">
					↗
				</span>
			) : null}
		</a>
	);
}
