"use client";

import { cn } from "@/lib/utils";
import type { LineStatus } from "@/types/transcript";
import { useEffect, useState } from "react";

interface StatusDisplayProps {
	callStatus: LineStatus;
	callDuration: number;
	aiStatusText: string;
	clientStatusText: string;
	className?: string;
}

// Helper function to check if call is in progress
type InProgressStatus = Exclude<LineStatus, "idle" | "ended" | "complete">;
const isCallInProgress = (status: LineStatus): status is InProgressStatus => {
	return !["idle", "ended", "complete"].includes(status);
};

export const StatusDisplay = ({
	callStatus,
	callDuration,
	aiStatusText,
	clientStatusText,
	className = "",
}: StatusDisplayProps) => {
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [displayAiText, setDisplayAiText] = useState("");
	const [displayClientText, setDisplayClientText] = useState("");
	const [activeSpeaker, setActiveSpeaker] = useState<"ai" | "client" | null>(
		null,
	);

	// Handle smooth text transitions when speaker changes
	useEffect(() => {
		const aiSpeaking = aiStatusText.length > 0;
		const clientSpeaking = clientStatusText.length > 0;

		// Early return if no one is speaking
		if (!aiSpeaking && !clientSpeaking) {
			setDisplayAiText("");
			setDisplayClientText("");
			setActiveSpeaker(null);
			return;
		}

		setIsTransitioning(true);

		// Small delay to allow the fade-out to complete
		const timer = setTimeout(() => {
			setDisplayAiText(aiStatusText);
			setDisplayClientText(clientStatusText);
			setActiveSpeaker(aiSpeaking ? "ai" : "client");
			setIsTransitioning(false);
		}, 150);

		return () => clearTimeout(timer);
	}, [aiStatusText, clientStatusText]);

	if (callStatus === "idle") return null;

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4",
				className,
			)}
		>
			{/* Call Status Indicator */}
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"h-3 w-3 rounded-full",
						callStatus === "connecting" && "animate-pulse bg-yellow-500",
						callStatus === "connected" && "bg-green-500",
						callStatus === "transferring" && "animate-pulse bg-blue-500",
						callStatus === "ended" && "bg-red-500",
					)}
				/>
				<span className="font-medium text-foreground/80 text-sm capitalize">
					{callStatus}
					{callStatus === "transferring" && " to sales rep..."}
				</span>
			</div>

			{/* Call Duration - Only show when call is in progress */}
			{isCallInProgress(callStatus) && (
				<div
					className="rounded-full bg-background/80 px-4 py-2 font-medium text-foreground/90 text-sm"
					key={`duration-${callDuration}`} // Force re-render on duration change
				>
					{String(Math.floor(callDuration / 60)).padStart(2, "0")}:
					{String(callDuration % 60).padStart(2, "0")}
				</div>
			)}

			{/* Status Messages with smooth transitions */}
			<div className="mt-2 flex min-h-[2.5rem] flex-col items-center gap-1">
				<div className="relative w-full text-center">
					{/* AI Status */}
					<div
						className={cn(
							"absolute right-0 left-0 transition-all duration-300",
							activeSpeaker === "ai"
								? "translate-y-0 opacity-100"
								: "-translate-y-2 pointer-events-none opacity-0",
						)}
					>
						<p className="text-center text-foreground/80 text-sm">
							<span className="font-medium text-primary">AI:</span>{" "}
							{displayAiText}
						</p>
					</div>

					{/* Client Status */}
					<div
						className={cn(
							"absolute right-0 left-0 transition-all duration-300",
							activeSpeaker === "client"
								? "translate-y-0 opacity-100"
								: "pointer-events-none translate-y-2 opacity-0",
						)}
					>
						<p className="text-center text-foreground/80 text-sm">
							<span className="font-medium text-secondary-foreground">
								Client:
							</span>{" "}
							{displayClientText}
						</p>
					</div>

					{/* Transition Indicator */}
					{isTransitioning && (
						<div className="absolute right-0 left-0 flex justify-center">
							<div className="size-1 animate-ping rounded-full bg-foreground/30" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
