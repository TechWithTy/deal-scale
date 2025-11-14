"use client";

import VideoModal from "@/components/common/VideoModal"; // * Reusable modal for video embeds
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { MetallicHoverCard } from "@/components/ui/metallic-hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import { formatDate } from "@/utils/date-formatter";
import { motion, useReducedMotion } from "framer-motion";
import {
	ArrowRight,
	Calendar,
	Clock,
	ExternalLink,
	Globe2,
	MapPin,
	Monitor,
	PlayCircle,
	Share2,
	ShieldCheck,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface EventCardProps {
	event: Event;
	index: number;
}

const isEventCard3DEnabled =
	process.env.NEXT_PUBLIC_ENABLE_EVENT_CARD_3D === "true";

const EventCard = ({ event, index }: EventCardProps) => {
	const isPastEvent = new Date(event.date) < new Date();
	// * Local state for controlling video modal
	const [isVideoOpen, setVideoOpen] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const [isCoarsePointer, setIsCoarsePointer] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const hasLoadedRef = useRef(false);
	const prefersReducedMotion = useReducedMotion();
	const accessType = event.accessType ?? "external";
	const attendanceType = event.attendanceType ?? "in-person";

	const accessMeta = {
		internal: {
			label: "Internal Event",
			icon: ShieldCheck,
			variant: "secondary" as const,
		},
		external: {
			label: "External Event",
			icon: Globe2,
			variant: "outline" as const,
		},
	} as const;

	const attendanceMeta = {
		"in-person": {
			label: "In Person",
			icon: Users,
		},
		webinar: {
			label: "Webinar",
			icon: Monitor,
		},
		hybrid: {
			label: "Hybrid",
			icon: Share2,
		},
	} as const;

	const AccessIcon = accessMeta[accessType].icon;
	const AttendanceIcon = attendanceMeta[attendanceType].icon;
	const fallbackInternalPath =
		event.internalPath ?? (event.slug ? `/events/${event.slug}` : "#");
	const ctaHref =
		accessType === "external"
			? event.externalUrl ?? fallbackInternalPath
			: fallbackInternalPath;
	const imageSizes =
		"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px";

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (!isClient || !window.matchMedia) {
			return;
		}

		const mediaQuery = window.matchMedia("(pointer: coarse)");
		const updatePointerState = (event: MediaQueryListEvent | MediaQueryList) => {
			setIsCoarsePointer(event.matches);
		};

		updatePointerState(mediaQuery);
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", updatePointerState);
			return () => mediaQuery.removeEventListener("change", updatePointerState);
		}

		// Safari fallback
		mediaQuery.addListener(updatePointerState);
		return () => mediaQuery.removeListener(updatePointerState);
	}, [isClient]);

	const enableThreeD =
		isEventCard3DEnabled &&
		isClient &&
		!prefersReducedMotion &&
		!isCoarsePointer &&
		imageLoaded;

	const handleImageLoad = () => {
		hasLoadedRef.current = true;
		setImageLoaded(true);
	};
	const handleImageError = () => {
		hasLoadedRef.current = true;
		setImageLoaded(true);
	};

	useEffect(() => {
		if (!event.thumbnailImage) {
			hasLoadedRef.current = true;
			setImageLoaded(true);
			return;
		}
		setImageLoaded(hasLoadedRef.current);
	}, [event.thumbnailImage]);

	return (
		<>
			{/* Video Modal instance (portal/modal root) */}
			{event.youtubeUrl && (
				<VideoModal
					isOpen={isVideoOpen}
					onClose={() => setVideoOpen(false)}
					videoUrl={event.youtubeUrl}
					title={event.title}
					subtitle={event.description}
				/>
			)}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: index * 0.1 }}
				className="h-full"
			>
				{enableThreeD ? (
					<CardContainer containerClassName="w-full py-0" className="h-full w-full">
						<CardBody className="h-full w-full">
							<MetallicHoverCard
								disableTilt
								className={cn(
									"rounded-3xl",
									isPastEvent ? "opacity-80" : "hover:shadow-2xl",
								)}
								innerClassName={cn(
									"relative h-full overflow-hidden rounded-[calc(1.5rem-4px)] border border-white/40 bg-gradient-to-br from-white/98 via-white/92 to-white/82 text-slate-900 transition-colors duration-300 dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/85 dark:via-slate-950/70 dark:to-slate-950/60 dark:text-white",
									isPastEvent && "opacity-80",
								)}
							>
								<CardItem translateZ={36} className="group/card flex h-full flex-col">
									<CardItem
										translateZ={96}
										className="relative h-48 overflow-hidden rounded-[calc(1.5rem-4px)] bg-gradient-to-br from-white/70 via-white/45 to-white/20 dark:from-slate-900/70 dark:via-slate-900/40 dark:to-slate-900/25"
									>
									{!imageLoaded && (
										<Skeleton className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-[inherit] bg-white/40 dark:bg-white/10" />
									)}
										{event.isFeatured && (
											<div className="absolute top-3 right-3 z-10 rounded-full bg-primary px-2 py-1 font-semibold text-black text-xs dark:text-white">
												Featured
											</div>
										)}
										{isPastEvent && (
											<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
												<span className="rounded-full bg-white/10 px-4 py-2 font-medium text-slate-900 backdrop-blur-sm dark:text-white">
													Past Event
												</span>
											</div>
										)}
										{event.thumbnailImage ? (
											<Image
												src={event.thumbnailImage}
												alt={event.title}
											className="z-10 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
												fill
												priority={index < 3}
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
											onLoadingComplete={handleImageLoad}
											onError={handleImageError}
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-white/60">
												No image available
											</div>
										)}
										{event.youtubeUrl && (
											<div className="absolute bottom-3 left-3 z-10">
												<button
													type="button"
													className="flex items-center gap-2 rounded bg-black/70 px-3 py-1.5 text-white transition-colors hover:bg-primary focus:outline-none"
													onClick={() => setVideoOpen(true)}
												>
													<PlayCircle className="h-5 w-5" />
													<span className="font-medium">Watch Preview</span>
												</button>
											</div>
										)}
									</CardItem>

									<div className="flex flex-grow flex-col p-5 text-center">
										<CardItem
											as="h3"
											translateZ={48}
											className="mb-2 text-center font-semibold text-xl transition-colors group-hover/card:text-primary"
										>
											{event.title}
										</CardItem>

										<div className="mb-4 flex flex-wrap items-center justify-center gap-2">
											<Badge
												variant={accessMeta[accessType].variant}
												className="gap-1.5 bg-white/85 text-slate-800 shadow-sm dark:bg-white/10 dark:text-white"
											>
												<AccessIcon className="h-3.5 w-3.5" aria-hidden />
												{accessMeta[accessType].label}
											</Badge>
											<Badge
												variant="secondary"
												className="gap-1.5 bg-slate-100 text-slate-700 shadow-sm dark:bg-white/10 dark:text-white"
											>
												<AttendanceIcon className="h-3.5 w-3.5" aria-hidden />
												{attendanceMeta[attendanceType].label}
											</Badge>
										</div>

										
										<div className="mb-4 flex flex-col items-center space-y-2 text-sm text-slate-700 dark:text-white/70">
											<div className="flex items-center justify-center gap-2 md:justify-start">
												<Calendar className="h-4 w-4 text-primary" />
												<span>{formatDate(event.date)}</span>
											</div>
											<div className="flex items-center justify-center gap-2 md:justify-start">
												<Clock className="h-4 w-4 text-primary" />
												<span>{event.time}</span>
											</div>
											<div className="flex items-center justify-center gap-2 md:justify-start">
												<MapPin className="h-4 w-4 text-primary" />
												<span>{event.location}</span>
											</div>
										</div>

										<CardItem
											as="p"
											translateZ={32}
											className="mb-5 line-clamp-3 text-sm text-slate-600 dark:text-white/80"
										>
											{event.description}
										</CardItem>

									<div className="mt-auto flex flex-col items-center gap-3">
										<CardItem translateZ={28} as="div" className="w-full max-w-xs">
											<Button
												variant="default"
												className="w-full gap-2 transition-colors group-hover/card:bg-primary"
												asChild
											>
												{accessType === "external" ? (
													<a
														href={ctaHref}
														target="_blank"
														rel="noopener noreferrer"
													>
														View Event <ExternalLink className="h-4 w-4" />
													</a>
												) : (
													<Link href={ctaHref}>
														View Event <ArrowRight className="h-4 w-4" />
													</Link>
												)}
											</Button>
										</CardItem>
										<CardItem translateZ={20} as="div" className="w-full max-w-xs">
											<Button
												variant="secondary"
												className="w-full gap-2 border border-primary/30 bg-white/70 text-primary transition-colors hover:border-primary hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white"
												asChild
											>
												<a
													href="/discord"
													target="_blank"
													rel="noopener noreferrer"
												>
													Join Community <ExternalLink className="h-4 w-4" />
												</a>
											</Button>
										</CardItem>
									</div>
									</div>
								</CardItem>
							</MetallicHoverCard>
						</CardBody>
					</CardContainer>
				) : (
					<MetallicHoverCard
						disableTilt
						className={cn(
							"rounded-3xl",
							isPastEvent ? "opacity-80" : "hover:shadow-2xl",
						)}
						innerClassName={cn(
							"relative h-full overflow-hidden rounded-[calc(1.5rem-4px)] border border-white/40 bg-gradient-to-br from-white/98 via-white/92 to-white/82 text-slate-900 transition-colors duration-300 dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-950/85 dark:via-slate-950/70 dark:to-slate-950/60 dark:text-white",
							isPastEvent && "opacity-80",
						)}
					>
						<div className="flex h-full flex-col">
							<div className="relative h-48 overflow-hidden rounded-[calc(1.5rem-4px)] bg-gradient-to-br from-white/70 via-white/45 to-white/20 dark:from-slate-900/70 dark:via-slate-900/40 dark:to-slate-900/25">
								{!imageLoaded && (
									<Skeleton className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-[inherit] bg-white/40 dark:bg-white/10" />
								)}
								{event.isFeatured && (
									<div className="absolute top-3 right-3 z-10 rounded-full bg-primary px-2 py-1 font-semibold text-black text-xs dark:text-white">
										Featured
									</div>
								)}
								{isPastEvent && (
									<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
										<span className="rounded-full bg-white/10 px-4 py-2 font-medium text-slate-900 backdrop-blur-sm dark:text-white">
											Past Event
										</span>
									</div>
								)}
								{event.thumbnailImage ? (
									<Image
										src={event.thumbnailImage}
										alt={event.title}
										className="z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										fill
										priority={index < 3}
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
										onLoadingComplete={handleImageLoad}
										onError={handleImageError}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-white/60">
										No image available
									</div>
								)}
								{event.youtubeUrl && (
									<div className="absolute bottom-3 left-3 z-10">
										<button
											type="button"
											className="flex items-center gap-2 rounded bg-black/70 px-3 py-1.5 text-white transition-colors hover:bg-primary focus:outline-none"
											onClick={() => setVideoOpen(true)}
										>
											<PlayCircle className="h-5 w-5" />
											<span className="font-medium">Watch Preview</span>
										</button>
									</div>
								)}
							</div>

							<div className="flex flex-grow flex-col p-5 text-center">
								<h3 className="mb-2 text-center font-semibold text-xl transition-colors group-hover:text-primary">
									{event.title}
								</h3>

								<div className="mb-4 flex flex-wrap items-center justify-center gap-2">
									<Badge
										variant={accessMeta[accessType].variant}
										className="gap-1.5 bg-white/85 text-slate-800 shadow-sm dark:bg-white/10 dark:text-white"
									>
										<AccessIcon className="h-3.5 w-3.5" aria-hidden />
										{accessMeta[accessType].label}
									</Badge>
									<Badge
										variant="secondary"
										className="gap-1.5 bg-slate-100 text-slate-700 shadow-sm dark:bg-white/10 dark:text-white"
									>
										<AttendanceIcon className="h-3.5 w-3.5" aria-hidden />
										{attendanceMeta[attendanceType].label}
									</Badge>
								</div>

								<div className="mb-4 flex flex-col items-center space-y-2 text-sm text-slate-700 dark:text-white/70">
									<div className="flex items-center justify-center gap-2 md:justify-start">
										<Calendar className="h-4 w-4 text-primary" />
										<span>{formatDate(event.date)}</span>
									</div>
									<div className="flex items-center justify-center gap-2 md:justify-start">
										<Clock className="h-4 w-4 text-primary" />
										<span>{event.time}</span>
									</div>
									<div className="flex items-center justify-center gap-2 md:justify-start">
										<MapPin className="h-4 w-4 text-primary" />
										<span>{event.location}</span>
									</div>
								</div>

								<p className="mb-5 line-clamp-3 text-sm text-slate-600 dark:text-white/80">
									{event.description}
								</p>

								<div className="mt-auto flex flex-col items-center gap-3">
									<Button
										variant="default"
										className="w-full max-w-xs gap-2 transition-colors group-hover:bg-primary"
										asChild
									>
										{accessType === "external" ? (
											<a
												href={ctaHref}
												target="_blank"
												rel="noopener noreferrer"
											>
												View Event <ExternalLink className="h-4 w-4" />
											</a>
										) : (
											<Link href={ctaHref}>
												View Event <ArrowRight className="h-4 w-4" />
											</Link>
										)}
									</Button>
									<Button
										variant="secondary"
										className="w-full max-w-xs gap-2 border border-primary/30 bg-white/70 text-primary transition-colors hover:border-primary hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white"
										asChild
									>
										<a
											href="/discord"
											target="_blank"
											rel="noopener noreferrer"
										>
											Join Community <ExternalLink className="h-4 w-4" />
										</a>
									</Button>
								</div>
							</div>
						</div>
					</MetallicHoverCard>
				)}
			</motion.div>
		</>
	);
};

export default EventCard;
