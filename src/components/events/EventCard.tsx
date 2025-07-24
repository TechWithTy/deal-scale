"use client";

import VideoModal from "@/components/common/VideoModal"; // * Reusable modal for video embeds
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { Event } from "@/types/event";
import { formatDate } from "@/utils/date-formatter";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react";
import { PlayCircle } from "lucide-react"; // * Play icon for video button
import Image from "next/image";
import React, { useState } from "react";

interface EventCardProps {
	event: Event;
	index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
	const isPastEvent = new Date(event.date) < new Date();
	// * Local state for controlling video modal
	const [isVideoOpen, setVideoOpen] = useState(false);

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
				<GlassCard
					className={`group flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-primary/50 ${isPastEvent ? "opacity-80" : ""}`}
				>
					<div className="relative">
						{event.isFeatured && (
							<div className="absolute top-3 right-3 z-10 rounded-full bg-primary px-2 py-1 font-semibold text-black text-xs dark:text-white">
								Featured
							</div>
						)}
						{isPastEvent && (
							<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
								<span className="rounded-full bg-white/10 px-4 py-2 font-medium text-black backdrop-blur-sm dark:text-white">
									Past Event
								</span>
							</div>
						)}
						<div className="h-48 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
							{event.thumbnailImage ? (
								<Image
									src={event.thumbnailImage}
									alt={event.title}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									fill
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-black dark:text-white/50">
									No image available
								</div>
							)}
							{event.youtubeUrl && (
								<div className="absolute bottom-3 left-3 z-10">
									<button
										type="button"
										className="flex items-center gap-2 rounded bg-black/70 px-3 py-1.5 text-black hover:bg-primary focus:outline-none dark:text-white"
										onClick={() => setVideoOpen(true)}
									>
										<PlayCircle className="h-5 w-5" />
										<span className="font-medium">Watch Preview</span>
									</button>
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-grow flex-col p-5 text-center">
						<h3 className="mb-2 text-center font-semibold text-xl transition-colors group-hover:text-primary">
							{event.title}
						</h3>
						<div className="mb-4 flex flex-col items-center space-y-2 text-center text-black text-sm dark:text-white/70">
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
						<p className="mb-5 line-clamp-3 text-center text-black text-sm dark:text-white/80">
							{event.description}
						</p>
						<div className="mt-auto">
							<Button
								variant="default"
								className="w-full gap-2 transition-colors group-hover:bg-primary"
								asChild
							>
								<a
									href={event.externalUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									View Event <ExternalLink className="h-4 w-4" />
								</a>
							</Button>
						</div>
					</div>
				</GlassCard>
			</motion.div>
		</>
	);
};

export default EventCard;
