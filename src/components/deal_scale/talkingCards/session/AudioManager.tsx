"use client";

import { useEffect, useRef, useState } from "react";
import type { LineStatus } from "@/types/transcript";

interface AudioManagerProps {
	callStatus: LineStatus;
	audioUrl?: string;
	playAudio: boolean; // New prop to explicitly control playback
	onAudioEnd?: () => void; // Callback when audio finishes playing
	startTime?: number; // Start time in seconds
	endTime?: number; // End time in seconds
}

export const AudioManager = ({
	callStatus,
	audioUrl = "/demos/audio/Prod SuccessFull Empathetic.wav",
	playAudio: shouldPlay,
	onAudioEnd,
	startTime = 0,
	endTime,
}: AudioManagerProps) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const isPlayingRef = useRef(false);

	// Initialize audio element
	useEffect(() => {
		const audio = new Audio(audioUrl);
		audio.preload = "auto";
		audio.loop = false; // Don't loop the audio
		audioRef.current = audio;

		console.log("Audio element initialized");

		const handleCanPlay = () => {
			console.log("Audio can play through");
			setIsLoaded(true);
		};

		const handleEnded = () => {
			console.log("Audio playback ended");
			isPlayingRef.current = false;
			onAudioEnd?.();
		};

		const handleTimeUpdate = () => {
			if (endTime !== undefined && audio.currentTime >= endTime) {
				audio.pause();
				isPlayingRef.current = false;
				console.log(`Audio reached end time: ${endTime} seconds`);
				onAudioEnd?.();
			}
		};

		audio.addEventListener("canplaythrough", handleCanPlay);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("timeupdate", handleTimeUpdate);

		// Cleanup
		return () => {
			console.log("Cleaning up audio");
			audio.pause();
			audio.removeEventListener("canplaythrough", handleCanPlay);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audioRef.current = null;
			isPlayingRef.current = false;
		};
	}, [audioUrl, onAudioEnd, endTime]);

	// Handle audio playback based on playAudio prop
	useEffect(() => {
		if (!audioRef.current || !isLoaded) {
			console.log("Audio not ready or not loaded yet");
			return;
		}

		const audio = audioRef.current;
		console.log(
			"Audio state - shouldPlay:",
			shouldPlay,
			"currentTime:",
			audio.currentTime,
			"startTime:",
			startTime,
		);
		if (shouldPlay) {
			if (!isPlayingRef.current) {
				// Set currentTime to startTime when starting playback
				audio.currentTime = startTime;
				audio
					.play()
					.then(() => {
						isPlayingRef.current = true;
						console.log(
							`Audio playback started successfully via prop at ${startTime}s.`,
						);
					})
					.catch((error) => {
						console.error("Error playing audio via prop:", error);
						isPlayingRef.current = false; // Ensure state is correct on error
					});
			}
		} else {
			if (isPlayingRef.current) {
				audio.pause();
				isPlayingRef.current = false;
				console.log("Audio playback paused via prop.");
				// Optionally reset currentTime if desired when playAudio becomes false
				// audio.currentTime = 0;
			}
		}
		// This effect now directly controls play/pause based on shouldPlay
	}, [shouldPlay, isLoaded, startTime]);

	return null; // This is a non-visual component
};
