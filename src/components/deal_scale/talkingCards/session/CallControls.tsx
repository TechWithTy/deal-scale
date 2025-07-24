"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import type { LineStatus } from "@/types/transcript";
import { PhoneCall, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CallControlsProps {
	playingDemo: boolean;
	callStatus: LineStatus;
	onPlayDemo: () => void;
	onEndCall: (manual?: boolean) => void;
	onSessionReset?: () => void;
	variant?: "default" | "floating";
	showEndButton?: boolean; // <-- add this
}

export const CallControls = ({
	playingDemo,
	callStatus,
	onPlayDemo,
	onEndCall,
	onSessionReset,
	variant = "default",
	showEndButton,
}: CallControlsProps) => {
	const [showCompleteModal, setShowCompleteModal] = useState(false);
	const isMounted = useRef(true);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			isMounted.current = false;
			// Cleanup any audio elements
			const audioElements = document.getElementsByTagName("audio");
			for (const audio of audioElements) {
				audio.pause();
				audio.currentTime = 0;
			}
		};
	}, []);

	const handleEndCallClick = () => {
		onEndCall(true);
	};

	const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		// Only proceed if the click is directly on the button (not a child element)
		if (e.target !== e.currentTarget) {
			e.stopPropagation();
			return;
		}

		try {
			// Stop any currently playing audio
			const audioElements = document.getElementsByTagName("audio");
			for (const audio of audioElements) {
				if (audio) {
					audio.pause();
					audio.currentTime = 0;
				}
			}

			// Only start new demo if not already playing
			if (!playingDemo) {
				onPlayDemo();
			}
		} catch (error) {
			console.error("Error handling play click:", error);
		}

		// Prevent any default behavior and stop propagation
		e.preventDefault();
		e.stopPropagation();
	};

	// Show Play Demo button when call is idle or completed
	const showPlayButton = callStatus === "idle" || callStatus === "complete";

	return (
		<>
			<div className="flex flex-col items-center gap-4">
				{showPlayButton ? (
					<Button
						onClick={handlePlayClick}
						type="button"
						className={cn(
							"group relative z-10 mx-auto flex h-14 w-full max-w-xs flex-col items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/30 hover:shadow-xl sm:flex-row sm:gap-2 sm:px-8 sm:text-lg",
							playingDemo && "from-primary/80 to-primary/60",
						)}
						disabled={playingDemo}
						aria-label={playingDemo ? "Playing demo" : "Play demo"}
					>
						{playingDemo ? (
							<span className="flex items-center">
								<span className="relative mr-2 flex h-3 w-3">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/90 opacity-75" />
									<span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
								</span>
								Transfering Lead...
							</span>
						) : (
							<>
								<Play className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
								Play Demo
							</>
						)}
						{!playingDemo && (
							<BorderBeam
								size={30}
								initialOffset={15}
								className="from-transparent via-yellow-500 to-transparent"
								transition={{
									type: "spring",
									stiffness: 60,
									damping: 20,
								}}
							/>
						)}
					</Button>
				) : (
					showEndButton !== false && (
						<Button
							onClick={handleEndCallClick}
							variant="destructive"
							className="hidden h-14 w-14 rounded-full p-0 sm:flex"
						>
							<PhoneCall className="h-6 w-6" />
						</Button>
					)
				)}
			</div>
		</>
	);
};

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
