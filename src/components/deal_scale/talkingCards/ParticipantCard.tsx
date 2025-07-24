"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { WaveFormAnimation2 } from "./WaveFormAnimation2";

interface ParticipantCardProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	role: string;
	avatar?: string;
	isAI?: boolean;
	statusText: string;
	transcriptText?: string;
	isActive?: boolean;
	isSpeaking?: boolean;
	waveformPosition?: "top" | "bottom";
}

const ParticipantCard = ({
	name,
	role,
	avatar,
	isAI = false,
	statusText,
	transcriptText,
	className,
	isActive = true,
	isSpeaking = false,
	waveformPosition = "bottom",
	...props
}: ParticipantCardProps) => {
	// Track if we should show the waveform
	const [showWaveform, setShowWaveform] = useState(false);

	// Only show waveform for the active speaker
	const shouldShowWaveform = isSpeaking && isActive;

	// Delay showing/hiding the waveform to prevent layout shift
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (shouldShowWaveform) {
			// Show immediately when speaking starts
			setShowWaveform(true);
		} else {
			// Delay hiding to allow for smooth transition
			timeoutId = setTimeout(() => {
				setShowWaveform(false);
			}, 500); // Slightly longer delay for smoother transition out
		}
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [shouldShowWaveform]);
	return (
		<div
			className={cn(
				"relative flex w-full flex-col items-center rounded-3xl p-6",
				"border border-border/50 bg-card shadow-lg",
				"transition-all duration-300 hover:border-primary/30 hover:shadow-primary/20",
				"min-w-[220px]",
				className,
			)}
			{...props}
			data-ai={isAI}
		>
			{waveformPosition === "top" && (
				<div
					className={cn(
						"w-full transition-all duration-500 ease-in-out",
						showWaveform
							? "mt-4 h-12 opacity-100"
							: "-mt-4 h-0 overflow-hidden opacity-0",
					)}
				>
					{showWaveform && (
						<WaveFormAnimation2
							className="h-12 w-full"
							position="top"
							isActive={isSpeaking}
							speed={0.8}
							colors={
								isAI
									? ["bg-primary/60", "bg-focus/60", "bg-accent/60"]
									: ["bg-blue-500/60", "bg-blue-400/60", "bg-blue-300/60"]
							}
						/>
					)}
				</div>
			)}

			<div className="relative">
				<Avatar
					className={cn(
						"border",
						"bg",
						"hover:scale-105",
						"hover:shadow-lg",
						"mb-4",
						"size-16",
						"transition-all",
						"duration-300",
						isAI
							? "border-primary/20 bg-primary/10"
							: "border-border/50 bg-secondary/50",
					)}
				>
					<AvatarImage
						src={
							avatar ||
							(isAI
								? "https://place-hold.it/128x128/4f46e5/ffffff?text=AI&font=roboto"
								: `https://place-hold.it/128x128/3b82f6/ffffff?text=${encodeURIComponent(
										name
											.split(" ")
											.map((n) => n[0])
											.join(""),
									)}&font=roboto`)
						}
						alt={name}
						className="object-cover"
					/>
					<AvatarFallback className="font-semibold text-foreground text-xl">
						{isAI
							? "AI"
							: `${name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()
									.substring(0, 2)}`}
					</AvatarFallback>
				</Avatar>
			</div>

			<h3 className="mb-1 text-center font-semibold text-foreground text-xl">
				{name}
			</h3>
			<p className="mb-4 text-center text-muted-foreground text-sm">{role}</p>

			{waveformPosition === "bottom" && !isAI && (
				<div
					className={cn(
						"w-full transition-all duration-500 ease-in-out",
						showWaveform
							? "mt-4 h-12 opacity-100"
							: "-mt-4 h-0 overflow-hidden opacity-0",
					)}
				>
					{showWaveform && (
						<WaveFormAnimation2
							className="h-12 w-full"
							position="bottom"
							isActive={isSpeaking}
							speed={0.8}
							colors={["bg-blue-500/60", "bg-blue-400/60", "bg-blue-300/60"]}
						/>
					)}
				</div>
			)}

			{waveformPosition === "bottom" && isAI && (
				<div
					className={cn(
						"w-full transition-all duration-300",
						showWaveform
							? "mt-4 h-12 opacity-100"
							: "h-0 overflow-hidden opacity-0",
					)}
				>
					{showWaveform && (
						<WaveFormAnimation2
							className="h-12 w-full"
							position="bottom"
							isActive={isSpeaking}
							speed={0.8}
							colors={["bg-primary/60", "bg-focus/60", "bg-accent/60"]}
						/>
					)}
				</div>
			)}

			<div className="mt-2 w-full px-2">
				{transcriptText ? (
					<div className="rounded-lg bg-muted/50 p-3">
						<p className="text-muted-foreground/90 text-sm">{transcriptText}</p>
					</div>
				) : (
					<p className="text-center text-muted-foreground/90 text-sm">
						{statusText}
					</p>
				)}
			</div>
		</div>
	);
};

export default ParticipantCard;
