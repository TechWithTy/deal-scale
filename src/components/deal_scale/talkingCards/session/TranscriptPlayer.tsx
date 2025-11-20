"use client";

import type {
	LineStatus,
	Speaker,
	Transcript,
	TranscriptLine,
} from "@/types/transcript";
import { useCallback, useEffect, useRef, useState } from "react";

interface TranscriptPlayerProps {
	transcript: Transcript;
	isMounted: boolean;
	demoStarted: boolean;
	playingDemo: boolean;
	// demoStartTime is not directly used in this revised version's internal timing,
	// as requestAnimationFrame manages its own elapsed time from when playingDemo becomes true.
	// It's kept if the parent component has other uses for it.
	demoStartTime: number | null;
	onStatusChange: (status: LineStatus | "ended") => void; // "ended" is explicitly used
	onLineChange: (line: TranscriptLine) => void;
	onAiActiveChange: (active: boolean) => void;
	onAiStatusTextChange: (text: string) => void;
	onClientStatusTextChange: (text: string) => void;
	onSpeakerChange: (speaker: Speaker | null) => void;
	onTimeUpdate: (currentTimeInSeconds: number) => void;
}

export const TranscriptPlayer = ({
	transcript,
	isMounted,
	demoStarted,
	playingDemo,
	demoStartTime,
	onStatusChange,
	onLineChange,
	onAiActiveChange,
	onAiStatusTextChange,
	onClientStatusTextChange,
	onSpeakerChange,
	onTimeUpdate,
}: TranscriptPlayerProps) => {
	// Track the last processed line and speaker to manage transitions
	const lastProcessedLine = useRef<TranscriptLine | null>(null);
	const currentSpeakerRef = useRef<Speaker | null>(null);
	const isInitialRender = useRef(true);
	const demoStartTimeRef = useRef<number | null>(null); // Initialize with null

	// Store the current callbacks in refs to avoid dependency issues
	const onLineChangeRef = useRef(onLineChange);
	const onSpeakerChangeRef = useRef(onSpeakerChange);
	const onAiActiveChangeRef = useRef(onAiActiveChange);
	const onAiStatusTextChangeRef = useRef(onAiStatusTextChange);
	const onClientStatusTextChangeRef = useRef(onClientStatusTextChange);
	const onTimeUpdateRef = useRef(onTimeUpdate);

	// Update refs when callbacks change
	useEffect(() => {
		onLineChangeRef.current = onLineChange;
		onSpeakerChangeRef.current = onSpeakerChange;
		onAiActiveChangeRef.current = onAiActiveChange;
		onAiStatusTextChangeRef.current = onAiStatusTextChange;
		onClientStatusTextChangeRef.current = onClientStatusTextChange;
		onTimeUpdateRef.current = onTimeUpdate;
		demoStartTimeRef.current = demoStartTime; // Update ref when prop changes
	}, [
		onLineChange,
		onSpeakerChange,
		onAiActiveChange,
		onAiStatusTextChange,
		onClientStatusTextChange,
		onTimeUpdate,
		demoStartTime,
	]);

	// Reset state when demo starts
	useEffect(() => {
		if (demoStarted) {
			lastProcessedLine.current = null;
			currentSpeakerRef.current = null;
			isInitialRender.current = true;
		}
	}, [demoStarted]);

	const processTranscript = useCallback(
		(currentTimeInDemo: number) => {
			// Find the current line being spoken
			const currentLine = transcript.lines.find(
				(line: TranscriptLine) =>
					currentTimeInDemo >= line.startTime &&
					currentTimeInDemo <= line.startTime + line.duration,
			);

			// Handle the case when we're between lines
			if (!currentLine) {
				if (lastProcessedLine.current) {
					onSpeakerChangeRef.current(null);
					onAiStatusTextChangeRef.current("");
					onClientStatusTextChangeRef.current("");
					// * No need to call onLineChangeRef.current(null) here, as parent will handle currentLine being null
					lastProcessedLine.current = null;
					currentSpeakerRef.current = null;
				}
				return;
			}

			const isAI = currentLine.speaker === "ai";
			const isNewLine = currentLine !== lastProcessedLine.current;
			const isNewSpeaker = currentLine.speaker !== currentSpeakerRef.current;

			// * Debug log for current line and speaker determination
			console.log(
				`[TranscriptPlayer] Time: ${currentTimeInDemo.toFixed(0)}, LineID: ${currentLine.id}, Speaker: ${currentLine.speaker}, isAI: ${isAI}, NewLine: ${isNewLine}, NewSpeaker: ${isNewSpeaker}`,
			);

			// Only update if we have a new line or a speaker change
			if (isNewLine || isNewSpeaker || isInitialRender.current) {
				// * Simplified status text updates
				if (isNewSpeaker || isInitialRender.current) {
					// * Debug log for speaker change callback
					console.log(
						`[TranscriptPlayer] Calling onSpeakerChange with: ${currentLine.speaker}, onAiActiveChange with: ${isAI}`,
					);
					onSpeakerChangeRef.current(currentLine.speaker as Speaker);
					currentSpeakerRef.current = currentLine.speaker as Speaker;
					onAiActiveChangeRef.current(isAI);
				}

				// * Update generic status text
				onAiStatusTextChangeRef.current(isAI ? "Speaking..." : "");
				onClientStatusTextChangeRef.current(!isAI ? "Speaking..." : "");

				// * Update the current line
				if (isNewLine || isInitialRender.current) {
					onLineChangeRef.current(currentLine);
					lastProcessedLine.current = currentLine;
					isInitialRender.current = false;
				}
			}
		},
		[transcript.lines],
	);

	// Handle demo animation sequence using transcript timing
	useEffect(() => {
		// Pass transcript to processTranscript
		// eslint-disable-next-line react-hooks/exhaustive-deps
		if (!isMounted || !demoStarted || !playingDemo) {
			return; // Exit if not ready or not playing
		}

		let animationFrameId: number;
		let animationStartTime: number | null = null;
		let lastFrameTime = 0;
		const frameRate = 1000 / 30; // Target 30fps for smoother updates
		// demoStartTimeRef is now a component-level ref, updated by an effect

		const animate = (timestamp: number) => {
			if (!animationStartTime) {
				animationStartTime = timestamp;
			}

			// Throttle updates to improve performance
			if (timestamp - lastFrameTime >= frameRate) {
				if (demoStartTimeRef.current === null) {
					// demoStartTime has not been set yet, or was reset. Don't proceed with time calculation.
					animationFrameId = requestAnimationFrame(animate); // Keep trying
					return;
				}
				const currentTime = Date.now();
				const elapsedTime = currentTime - demoStartTimeRef.current;
				const elapsedTimeInSeconds = Math.floor(elapsedTime / 1000);

				console.log(
					`[TranscriptPlayer Animate] currentTime: ${currentTime}, demoStartTime: ${demoStartTimeRef.current}, elapsed(ms): ${elapsedTime}, elapsed(s): ${elapsedTimeInSeconds}`,
				);

				onTimeUpdateRef.current(elapsedTimeInSeconds); // * Report time in seconds
				processTranscript(elapsedTime); // * processTranscript expects time in milliseconds

				// Check if we've reached the end of the transcript demo
				if (elapsedTime >= transcript.totalDuration) {
					onStatusChange("transcript_ended"); // Indicate transcript is done, not the whole call
					// The animation loop will stop on the next frame because playingDemo will likely be set to false by parent
					// or we could explicitly cancel the animationFrameId here if needed, but parent should control 'playingDemo'
					return; // Stop this animation loop for the transcript player
				}
				lastFrameTime = timestamp;
			}

			// Continue the animation loop
			animationFrameId = requestAnimationFrame(animate);
		};

		// Start the animation loop
		console.log(
			`[TranscriptPlayer] Starting animation. Initial demoStartTimeRef.current: ${demoStartTimeRef.current}`,
		);
		animationFrameId = requestAnimationFrame(animate);

		// Cleanup function
		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
			// Reset the last processed line when stopping
			lastProcessedLine.current = null;
		};
	}, [
		isMounted,
		demoStarted,
		playingDemo,
		processTranscript,
		transcript.totalDuration,
		onStatusChange,
	]); // demoStartTime is implicitly handled via demoStartTimeRef

	return null; // This is a non-visual component
};

export default TranscriptPlayer;
