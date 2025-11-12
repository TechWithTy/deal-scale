"use client";

import { CallCompleteModal } from "@/components/deal_scale/talkingCards/session/CallCompleteModal";
import { cn } from "@/lib/utils";
import type { LineStatus, Transcript } from "@/types/transcript";
import { useCallback, useEffect, useRef, useState } from "react";
import ParticipantCard from "../ParticipantCard";
import { AudioManager } from "./AudioManager";
import { CallControls } from "./CallControls";
import { StatusDisplay } from "./StatusDisplay";
import { TranscriptPlayer } from "./TranscriptPlayer";

export const SessionView = ({
	transcript,
	onCallEnd,
	onTransfer,
	onSessionReset,
	autoPlay,
	showEndButton,
	autoStart = false,
	variant = "default",
}: {
	transcript: Transcript;
	onCallEnd?: (opts: { manual: boolean }) => void;
	onTransfer?: () => void;
	onSessionReset?: (resetFn: () => void) => void;
	autoPlay?: boolean;
	showEndButton?: boolean;
	autoStart?: boolean;
	variant?: "default" | "compact";
}) => {
	const [playingDemo, setPlayingDemo] = useState(false);
	const [aiActive, setAiActive] = useState(false);
	const [aiStatusText, setAiStatusText] = useState("");
	const [clientStatusText, setClientStatusText] = useState("");
	const [isMounted, setIsMounted] = useState(false);
	const [demoStarted, setDemoStarted] = useState(false);
	const [callStatus, setCallStatus] = useState<LineStatus>("idle");
	const [callDuration, setCallDuration] = useState(0);
	const [currentLine, setCurrentLine] = useState<
		(typeof transcript.lines)[number] | null
	>(null);
	const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
	const [demoStartTime, setDemoStartTime] = useState<number | null>(null);
	const [shouldPlayAudio, setShouldPlayAudio] = useState(false);
	const [transcriptFinished, setTranscriptFinished] = useState(false); // New state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const autoStartRef = useRef(false);
	const isCompact = variant === "compact";

	// Use a ref to store the latest onCallEnd callback to avoid stale closures
	const onCallEndRef = useRef(onCallEnd);
	useEffect(() => {
		onCallEndRef.current = onCallEnd;
	}, [onCallEnd]);

	// Set mounted state to prevent hydration issues
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Restore Play Demo logic for demos that require it
	const handlePlayDemo = useCallback(() => {
		// Reset all states
		setPlayingDemo(true);
		setDemoStarted(true);
		setCallStatus("pending");
		setAiActive(false);
		setAiStatusText("");
		setClientStatusText("");
		setCallDuration(0);
		setCurrentLine(null);
		setCurrentSpeaker(null);
		setDemoStartTime(Date.now());
		setTranscriptFinished(false); // Reset transcript finished state

		// Start audio after a short delay
		setTimeout(() => {
			setCallStatus("speaking");
			setShouldPlayAudio(true);
		}, 1000);
	}, []);

	// Auto play demo if autoPlay is true (for cloned voice)
	useEffect(() => {
		if (autoPlay) {
			handlePlayDemo();
		}
	}, [autoPlay, handlePlayDemo]);

	useEffect(() => {
		if (autoStart) {
			if (!autoStartRef.current) {
				autoStartRef.current = true;
				handlePlayDemo();
			}
		} else {
			autoStartRef.current = false;
		}
	}, [autoStart, handlePlayDemo]);

	// Handle call end - stop audio and clean up
	// Accept a manual flag to distinguish between button and audio end
	const handleEndCall = useCallback((manual = false) => {
		// Stop any playing audio
		const audioElements = document.getElementsByTagName("audio");
		for (const audio of audioElements) {
			audio.pause();
			audio.currentTime = 0;
		}

		// If a parent handler is provided, call it and stop execution.
		if (onCallEndRef.current) {
			onCallEndRef.current({ manual });
			return;
		}

		// This logic only runs if no onCallEnd handler is provided.
		setCallStatus("complete");
		setShouldPlayAudio(false);

		// Reset all states to allow the demo to be replayed.
		setPlayingDemo(false);
		setDemoStarted(false);
		setCallStatus("idle");
		setAiActive(false);
		setAiStatusText("");
		setClientStatusText("");
		setCallDuration(0);
		setCurrentLine(null);
		setCurrentSpeaker(null);
		setDemoStartTime(null);
		setTranscriptFinished(false);
	}, []);

	const handleGetLeads = async () => {
		// Placeholder function for the modal's onGetLeads prop
		console.log("Get leads clicked from SessionView!");
		return Promise.resolve();
	};

	// Handle session reset after modal closes
	const handleSessionReset = useCallback(() => {
		setIsModalOpen(false); // Close the modal if it's open
		// Stop any playing audio
		const audioElements = document.getElementsByTagName("audio");
		for (const audio of audioElements) {
			audio.pause();
			audio.currentTime = 0;
		}

		// Reset all states
		setCallStatus("idle");
		setPlayingDemo(false);
		setAiActive(false);
		setAiStatusText("");
		setClientStatusText("");
		setCallDuration(0);
		setDemoStarted(false);
		setCurrentLine(null);
		setCurrentSpeaker(null);
		setDemoStartTime(null);
		setTranscriptFinished(false); // Reset transcript finished state
	}, []);

	// Handle status changes from TranscriptPlayer
	const handleTranscriptPlayerStatusChange = (
		status: LineStatus | "transcript_ended",
	) => {
		if (status === "transcript_ended") {
			setTranscriptFinished(true);
			// Do not set callStatus to complete here, let AudioManager handle actual audio end.
			// If audio is shorter than transcript, AudioManager's onAudioEnd would have already fired.
			// If audio is longer, it will continue playing.
			console.log("Transcript has ended, audio continues if playing.");
		} else {
			// For all other statuses from TranscriptPlayer (like 'speaking', 'pending', etc.), update callStatus directly.
			setCallStatus(status as LineStatus);
		}
	};

	// When the audio finishes, it should trigger the same logic as ending the call automatically.
	const handleAudioEnd = useCallback(() => {
		handleEndCall(false);
	}, [handleEndCall]);

	// Pass the reset function up to the parent component
	useEffect(() => {
		if (onSessionReset) {
			onSessionReset(handleSessionReset);
		}
	}, [onSessionReset, handleSessionReset]);

	// * Debug: Log aiActive changes
	useEffect(() => {
		console.log(`[SessionView] aiActive state changed to: ${aiActive}`);
	}, [aiActive]);

	// * Debug: Log currentSpeaker changes
	useEffect(() => {
		console.log(
			`[SessionView] currentSpeaker state changed to: ${currentSpeaker}`,
		);
	}, [currentSpeaker]);

	return (
		<div
			className={cn(
				"relative flex h-full w-full flex-col items-center justify-start",
				isCompact && "gap-4 overflow-y-auto pb-4",
			)}
		>
			{/* Audio Manager */}
			<AudioManager
				callStatus={callStatus}
				playAudio={shouldPlayAudio}
				onAudioEnd={handleAudioEnd}
			/>

			{/* Transcript Player */}
			<TranscriptPlayer
				transcript={transcript}
				isMounted={isMounted}
				demoStarted={demoStarted}
				playingDemo={playingDemo}
				onStatusChange={handleTranscriptPlayerStatusChange}
				onLineChange={setCurrentLine}
				onAiActiveChange={setAiActive}
				onAiStatusTextChange={setAiStatusText}
				onClientStatusTextChange={setClientStatusText}
				onSpeakerChange={setCurrentSpeaker}
				demoStartTime={demoStartTime}
				onTimeUpdate={setCallDuration} // * Pass setCallDuration for time updates
			/>

			{/* Status Display - Moved to top */}
			<div className={cn("mb-6 w-full", isCompact && "mb-3")}>
				<StatusDisplay
					callStatus={callStatus}
					callDuration={callDuration}
					aiStatusText={aiStatusText}
					clientStatusText={clientStatusText}
					className="w-full"
				/>
			</div>

			{/* Participant Cards with Floating Play Button */}
			<div className="relative w-full">
				<div
					className={cn(
						"relative flex w-full flex-col items-center justify-center gap-4 md:flex-row md:gap-12 lg:gap-20",
						isCompact && "md:flex-col md:gap-4 lg:gap-4",
					)}
				>
					{/* AI Participant Card */}
					<div
						className={cn(
							"group relative w-full transition-all duration-300 hover:z-10 hover:scale-105 md:w-auto",
							isCompact && "md:w-full",
						)}
					>
						<ParticipantCard
							name={transcript.participants.ai.name}
							role={transcript.participants.ai.subtitle}
							avatar={transcript.participants.ai.avatar}
							isAI={true}
							statusText={aiStatusText}
							isActive={aiActive}
							isSpeaking={currentSpeaker === "ai"}
							className={cn(
								"z-10 transition-all duration-300 hover:z-20 hover:scale-105 hover:shadow-xl",
								aiActive && "border-primary/50",
								isCompact &&
									"min-w-0 rounded-2xl border-white/5 bg-slate-900/80 p-4 text-sm",
							)}
							transcriptText={
								currentLine?.speaker === "ai" ? currentLine.text : ""
							}
						/>
					</div>

					{/* Client Participant Card */}
					{transcript.participants.lead && (
						<div
							className={cn(
								"group relative w-full transition-all duration-300 hover:z-10 hover:scale-105 md:w-auto",
								isCompact && "md:w-full",
							)}
						>
							<ParticipantCard
								name={transcript.participants.lead.name}
								role={transcript.participants.lead.subtitle}
								avatar={transcript.participants.lead.avatar}
								isAI={false}
								statusText={clientStatusText}
								isActive={!aiActive}
								isSpeaking={currentSpeaker === "lead"}
								className={cn(
									"z-10 transition-all duration-300 hover:z-20 hover:scale-105 hover:shadow-xl",
									!aiActive && "border-primary/50",
									isCompact &&
										"min-w-0 rounded-2xl border-white/5 bg-slate-900/80 p-4 text-sm",
								)}
								transcriptText={
									currentLine?.speaker === "lead" ? currentLine.text : ""
								}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Call Controls */}
			<div className={cn("mt-8", isCompact && "mt-4")}>
				<CallControls
					playingDemo={playingDemo}
					callStatus={callStatus}
					onPlayDemo={autoPlay ? () => {} : handlePlayDemo}
					onEndCall={handleEndCall}
					onSessionReset={handleSessionReset}
					variant="default"
					showEndButton={showEndButton}
				/>
			</div>

			{/* Call Complete Modal */}
			{isModalOpen && (
				<CallCompleteModal isOpen={isModalOpen} onClose={handleSessionReset} />
			)}
		</div>
	);
};
