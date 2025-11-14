"use client";
import * as React from "react";

export type MediaPreviewProps = {
	imageUrl?: string;
	thumbnailUrl?: string;
	videoUrl?: string;
	files?: Array<{ url: string; kind?: "image" | "video" | "other" }>;
};

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

function firstMatch<T>(
	arr: T[] | undefined,
	pred: (t: T) => boolean,
): T | undefined {
	if (!arr) return undefined;
	for (const x of arr) if (pred(x)) return x;
	return undefined;
}

function extOf(url?: string): string | undefined {
	if (!url) return undefined;
	const m = /\.([a-z0-9]+)(?:$|\?|#)/i.exec(url);
	return (m?.[1] || "").toLowerCase();
}

export function MediaPreview({
	imageUrl,
	thumbnailUrl,
	videoUrl,
	files,
}: MediaPreviewProps) {
	const firstImageFromFiles = React.useMemo(
		() =>
			firstMatch(
				files,
				(f) =>
					f.kind === "image" ||
					/\.(jpg|jpeg|png|gif|webp|avif|svg|heic|heif)(?:$|\?|#)/i.test(f.url),
			),
		[files],
	);
	const firstVideoFromFiles = React.useMemo(
		() =>
			firstMatch(
				files,
				(f) =>
					f.kind === "video" ||
					/\.(mp4|webm|ogg|mov|m4v)(?:$|\?|#)/i.test(f.url),
			),
		[files],
	);

	const rawImage = firstImageFromFiles?.url || imageUrl;
	const rawVideo = firstVideoFromFiles?.url || videoUrl;
	const ext = extOf(rawVideo);
	const canInlinePlay = Boolean(
		rawVideo && ext && supportedInlineExts.has(ext),
	);
	const videoType = ext ? videoMimeByExt[ext] : undefined;
	const proxiedVideo = rawVideo
		? `/api/proxy-video?url=${encodeURIComponent(rawVideo)}`
		: undefined;

	// Prefer image by default
	if (rawImage) {
		const heic = /(\.heic|\.heif)(?:$|\?|#)/i.test(rawImage ?? "");
		const cloud = (
			typeof process !== "undefined"
				? process.env.CLOUDINARY_CLOUD_NAME
				: undefined
		) as string | undefined;
		const imgSrc =
			heic && cloud
				? `https://res.cloudinary.com/${cloud}/image/upload/f_jpg,q_auto/${encodeURIComponent(rawImage)}`
				: rawImage;
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img src={imgSrc} alt="" className="mt-2 w-full rounded" />
		);
	}

	// Else, try supported inline video
	if (rawVideo && canInlinePlay) {
		return (
			<video
				key={rawVideo}
				className="mt-2 w-full rounded"
				controls
				preload="metadata"
				crossOrigin="anonymous"
				playsInline
				controlsList="nodownload"
				disablePictureInPicture
			>
				{videoType ? (
					<source src={proxiedVideo ?? rawVideo} type={videoType} />
				) : null}
				<source src={proxiedVideo ?? rawVideo} />
				<track
					kind="captions"
					srcLang="en"
					label="English"
					default
					src="data:text/vtt,WEBVTT"
				/>
			</video>
		);
	}

	// No default thumbnail display
	return null;
}
