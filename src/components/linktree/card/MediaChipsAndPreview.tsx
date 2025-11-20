"use client";
import * as React from "react";
import type { LinkCardProps } from "../LinkCard";

export type MediaChipsAndPreviewProps = Pick<
	LinkCardProps,
	"imageUrl" | "thumbnailUrl" | "videoUrl" | "files" | "pageId" | "slug"
>;

const supportedInlineExts = new Set([
	"mp4",
	"webm",
	"ogg",
	"ogv",
	"mov",
	"m4v",
]);
const videoMimeByExt: Record<string, string> = {
	mp4: "video/mp4",
	webm: "video/webm",
	ogg: "video/ogg",
	ogv: "video/ogg",
	mov: "video/quicktime",
	m4v: "video/x-m4v",
};

function extOf(url?: string): string | undefined {
	if (!url) return undefined;
	const m = /\.([a-z0-9]+)(?:$|\?|#)/i.exec(url);
	return (m?.[1] || "").toLowerCase();
}

export function MediaChipsAndPreview({
	imageUrl,
	thumbnailUrl,
	videoUrl,
	files,
	pageId,
	slug,
}: MediaChipsAndPreviewProps) {
	// Derive best candidates from files
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
				/\.(jpg|jpeg|png|gif|webp|avif|svg|heic|heif)(?:$|\?|#)/i.test(f.url),
		);
		return imgs?.length ? imgs[0] : undefined;
	}, [files]);

	// Unified video source
	const rawVideoSrc = firstVideoFromFiles?.url || videoUrl || undefined;
	const videoExt = extOf(rawVideoSrc);
	const canInlinePlay =
		Boolean(rawVideoSrc) &&
		Boolean(videoExt && supportedInlineExts.has(videoExt));
	const videoType = videoExt
		? (videoMimeByExt[videoExt] ?? undefined)
		: undefined;
	const proxiedVideoSrc = rawVideoSrc
		? `/api/proxy-video?url=${encodeURIComponent(rawVideoSrc)}`
		: undefined;

	// UI state - show image by default, video is toggled by chip
	const [showInlineVideo, setShowInlineVideo] = React.useState(false);
	const [showInlineImage, setShowInlineImage] = React.useState(
		Boolean(firstImageFromFiles?.url || imageUrl),
	);
	const [showInlineThumb, setShowInlineThumb] = React.useState(false);

	const trackClick = React.useCallback(() => {
		try {
			const payload = { pageId, slug } as { pageId?: string; slug?: string };
			if (payload.pageId || payload.slug) {
				fetch("/api/linktree/click", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}).catch(() => {});
			}
		} catch {
			// ignore
		}
	}, [pageId, slug]);

	return (
		<>
			{(firstVideoFromFiles?.url ||
				videoUrl ||
				firstImageFromFiles?.url ||
				imageUrl ||
				thumbnailUrl) && (
				<div className="mb-2 flex flex-wrap items-center gap-1.5">
					{rawVideoSrc && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setShowInlineVideo((v) => !v);
							}}
							className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground leading-5 hover:bg-accent"
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
								setShowInlineImage((v) => !v);
							}}
							className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground leading-5 hover:bg-accent"
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
								setShowInlineThumb((v) => !v);
							}}
							className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground leading-5 hover:bg-accent"
							aria-pressed={showInlineThumb}
							aria-label={showInlineThumb ? "Hide thumbnail" : "Show thumbnail"}
							title={showInlineThumb ? "Hide thumbnail" : "Preview thumbnail"}
						>
							<span aria-hidden>🖼️</span>
							<span>Thumb</span>
						</button>
					)}
					{files
						?.filter((f) => {
							if (
								canInlinePlay &&
								showInlineVideo &&
								rawVideoSrc &&
								(f.kind === "video" ||
									/\.(mp4|webm|ogg|mov|m4v)(?:$|\?|#)/i.test(f.url))
							) {
								return false;
							}
							if (
								f.kind === "image" ||
								/\.(jpg|jpeg|png|gif|webp|avif|svg|heic|heif)(?:$|\?|#)/i.test(
									f.url,
								)
							) {
								return false;
							}
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
									trackClick();
									const to = encodeURIComponent(f.url);
									const pid = pageId
										? `&pageId=${encodeURIComponent(pageId)}`
										: "";
									const s = slug ? `&slug=${encodeURIComponent(slug)}` : "";
									const url = `/api/redirect?isFile=1&to=${to}${pid}${s}`;
									window.open(url, "_self");
								}}
								className="inline-flex max-w-[8rem] items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground leading-5 hover:bg-accent"
								aria-label={`Download ${f.name}`}
								title={f.name}
							>
								<span aria-hidden>⬇</span>
								<span className="truncate">{f.name}</span>
							</button>
						))}
				</div>
			)}

			{(showInlineVideo || showInlineImage || showInlineThumb) && (
				<div className="mt-2 w-full">
					{showInlineVideo && rawVideoSrc && canInlinePlay ? (
						<video
							key={rawVideoSrc}
							className="w-full rounded"
							controls
							preload="metadata"
							crossOrigin="anonymous"
							playsInline
							controlsList="nodownload"
							disablePictureInPicture
							onError={() => {
								setShowInlineVideo(false);
							}}
						>
							{videoType ? (
								<source src={proxiedVideoSrc ?? rawVideoSrc} type={videoType} />
							) : null}
							<source src={proxiedVideoSrc ?? rawVideoSrc} />
							<track
								kind="captions"
								srcLang="en"
								label="English"
								default
								src="data:text/vtt,WEBVTT"
							/>
						</video>
					) : null}

					{showInlineVideo && rawVideoSrc && !canInlinePlay ? (
						<div className="w-full rounded border bg-muted/30 p-3 text-muted-foreground text-sm">
							This video format isn’t supported for inline playback.
							<a
								href={rawVideoSrc}
								target="_blank"
								rel="noopener noreferrer"
								onClick={trackClick}
								className="ml-1 underline"
							>
								Open video
							</a>
						</div>
					) : null}

					{showInlineImage &&
						(() => {
							const rawImg = firstImageFromFiles?.url || imageUrl;
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
							return rawImg ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={imgSrc as string} alt="" className="w-full rounded" />
							) : null;
						})()}

					{showInlineThumb && thumbnailUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img src={thumbnailUrl} alt="" className="w-full rounded" />
					) : null}
				</div>
			)}
		</>
	);
}
