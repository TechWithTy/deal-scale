"use client";

import type { LineStatus } from "@/types/transcript";
import { useEffect, useRef, useState } from "react";

interface AudioManagerProps {
	callStatus: LineStatus;
	audioUrl?: string;
	playAudio: boolean; // New prop to explicitly control playback
	onAudioEnd?: () => void; // Callback when audio finishes playing
}

export const AudioManager = ({
	callStatus,
	audioUrl = "/calls/example-call-yt.mp3",
	playAudio: shouldPlay,
	onAudioEnd,
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

		audio.addEventListener("canplaythrough", handleCanPlay);
		audio.addEventListener("ended", handleEnded);

		// Cleanup
		return () => {
			console.log("Cleaning up audio");
			audio.pause();
			audio.removeEventListener("canplaythrough", handleCanPlay);
			audio.removeEventListener("ended", handleEnded);
			audioRef.current = null;
			isPlayingRef.current = false;
		};
	}, [audioUrl, onAudioEnd]);

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
		);
		if (shouldPlay) {
			if (!isPlayingRef.current) {
				audio
					.play()
					.then(() => {
						isPlayingRef.current = true;
						console.log("Audio playback started successfully via prop.");
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
	}, [shouldPlay, isLoaded]);

	return null; // This is a non-visual component
};
