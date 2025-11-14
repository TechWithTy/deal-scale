"use client";

import type React from "react";
import { type FC, type ReactNode, useEffect, useRef } from "react";

// ! This modal is SSR-safe and accessible. It supports YouTube and other video embeds.
// * Use for any video modal needs. Add extra actions with the optional `footer` prop.

export interface VideoModalProps {
	isOpen: boolean; // Controls modal visibility
	onClose: () => void; // Function to close the modal
	videoUrl: string; // Embed/video URL (YouTube, Vimeo, etc.)
	title: string; // Modal title
	subtitle?: string; // Optional subtitle
	termsUrl?: string; // Optional Terms of Use link
	footer?: ReactNode; // Optional extra actions (e.g., tour/help button)
}

// ! Converts standard YouTube URLs to the embed format (https://www.youtube.com/embed/VIDEO_ID)
function getYouTubeEmbedUrl(url: string): string | null {
	const match = url.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
	);
	return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

const VideoModal: FC<VideoModalProps> = ({
	isOpen,
	onClose,
	videoUrl,
	title,
	subtitle,
	termsUrl,
	footer,
}) => {
	// SSR safety: don't render modal unless open (prevents hydration mismatch)
	if (!isOpen) return null;

	// Trap focus within modal for accessibility
	const modalRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!isOpen || !modalRef.current) return;
		const focusable = modalRef.current.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);
		focusable[0]?.focus();
		const trap = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (!first || !last) return;
			if (
				e.shiftKey
					? document.activeElement === first
					: document.activeElement === last
			) {
				e.preventDefault();
				(e.shiftKey ? last : first).focus();
			}
		};
		modalRef.current.addEventListener("keydown", trap);
		return () => modalRef.current?.removeEventListener("keydown", trap);
	}, [isOpen]);

	// Close modal on outside click
	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	const embedUrl = getYouTubeEmbedUrl(videoUrl);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/50 backdrop-blur-sm"
			onMouseDown={handleOutsideClick}
			aria-modal="true"
			tabIndex={-1}
			ref={modalRef}
		>
			<div className="relative flex w-full max-w-2xl flex-col items-center rounded-2xl border border-white/10 bg-white/10 p-0 shadow-2xl backdrop-blur-lg dark:border-white/20 dark:bg-gray-900/80">
				{/* X Button */}
				<button
					onClick={onClose}
					type="button"
					aria-label="Close modal"
					className="absolute top-3 right-3 z-10 text-red-500/80 hover:text-red-500 focus:outline-none"
				>
					&#x2715;
				</button>
				{/* Video */}
				<div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-t-2xl">
					{embedUrl ? (
						<iframe
							src={embedUrl}
							title={title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="h-full w-full border-0"
							style={{
								aspectRatio: "16/9",
								minHeight: 220,
								background: "black",
							}}
						/>
					) : (
						<div className="my-5 flex h-full w-full flex-col items-center justify-center">
							<p className="mb-2 text-red-500">
								Video unavailable for embedding.
							</p>
							<a
								href={videoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline"
							>
								Open video in new tab
							</a>
						</div>
					)}
				</div>
				{/* Title */}
				<h2 className="my-5 mb-2 font-bold text-primary text-xl dark:text-black dark:text-white">
					{title}
				</h2>
				{/* Subtitle */}
				{subtitle && (
					<p className="p-10 text-black dark:text-gray-300 dark:text-white">
						{subtitle}
					</p>
				)}
				{/* Got it Button */}
				<div className="my-4">
					<button
						type="button"
						className="w-fit rounded-lg bg-primary px-4 py-2 font-semibold text-black hover:bg-primary/80 focus:outline-none dark:text-white"
						onClick={onClose}
					>
						Got it
					</button>
				</div>
				{/* Terms of Use */}
				{termsUrl && (
					<p className="mt-4 text-gray-400 text-sm dark:text-gray-400">
						The use of this feature is subject to our{" "}
						<a
							href={termsUrl}
							className="text-blue-500 underline dark:text-blue-400"
							target="_blank"
							rel="noopener noreferrer"
						>
							Terms of Use
						</a>
						.
					</p>
				)}
				{/* Footer actions (e.g., help/tour button) */}
				{footer && <div className="mt-4">{footer}</div>}
			</div>
		</div>
	);
};

export default VideoModal;
