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
	const hasCalledEndRef = useRef(false);
	const timeCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Initialize audio element
	useEffect(() => {
		const audio = new Audio(audioUrl);
		audio.preload = "auto";
		audio.loop = false; // Don't loop the audio
		audioRef.current = audio;

		console.log("Audio element initialized with URL:", audioUrl);

		const handleCanPlay = () => {
			console.log("Audio can play through");
			setIsLoaded(true);
		};

		const handleError = (e: ErrorEvent) => {
			console.error("Audio loading error:", e);
			console.error("Audio error details:", {
				code: audio.error?.code,
				message: audio.error?.message,
				url: audioUrl,
			});
			// Try to provide helpful error message
			if (audio.error) {
				switch (audio.error.code) {
					case MediaError.MEDIA_ERR_ABORTED:
						console.error("Audio loading aborted");
						break;
					case MediaError.MEDIA_ERR_NETWORK:
						console.error("Network error loading audio");
						break;
					case MediaError.MEDIA_ERR_DECODE:
						console.error(
							"Audio decode error - file may be corrupted or unsupported format",
						);
						break;
					case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
						console.error(
							"Audio source not supported - check file format and path",
						);
						break;
					default:
						console.error("Unknown audio error");
				}
			}
		};

		const handleEnded = () => {
			console.log("Audio playback ended");
			isPlayingRef.current = false;
			if (!hasCalledEndRef.current) {
				hasCalledEndRef.current = true;
				onAudioEnd?.();
			}
			// Clear time check interval when audio naturally ends
			if (timeCheckIntervalRef.current) {
				clearInterval(timeCheckIntervalRef.current);
				timeCheckIntervalRef.current = null;
			}
		};

		audio.addEventListener("canplaythrough", handleCanPlay);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("error", handleError);

		// Cleanup
		return () => {
			console.log("Cleaning up audio");
			audio.pause();
			audio.removeEventListener("canplaythrough", handleCanPlay);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("error", handleError);
			if (timeCheckIntervalRef.current) {
				clearInterval(timeCheckIntervalRef.current);
				timeCheckIntervalRef.current = null;
			}
			audioRef.current = null;
			isPlayingRef.current = false;
			hasCalledEndRef.current = false;
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
			"startTime:",
			startTime,
		);
		if (shouldPlay) {
			if (!isPlayingRef.current) {
				// Reset end flag when starting new playback
				hasCalledEndRef.current = false;

				// Set currentTime to startTime when starting playback
				audio.currentTime = startTime;
				audio
					.play()
					.then(() => {
						isPlayingRef.current = true;
						console.log(
							`Audio playback started successfully via prop at ${startTime}s.`,
						);

						// Start time checking if endTime is defined
						if (endTime !== undefined) {
							// Clear any existing interval
							if (timeCheckIntervalRef.current) {
								clearInterval(timeCheckIntervalRef.current);
							}

							// Start new interval to check time frequently
							timeCheckIntervalRef.current = setInterval(() => {
								if (!audioRef.current || !isPlayingRef.current) {
									return;
								}

								const currentAudio = audioRef.current;
								if (
									endTime !== undefined &&
									currentAudio.currentTime >= endTime
								) {
									currentAudio.pause();
									isPlayingRef.current = false;
									console.log(
										`Audio reached end time: ${endTime} seconds (currentTime: ${currentAudio.currentTime.toFixed(2)}s)`,
									);
									if (!hasCalledEndRef.current) {
										hasCalledEndRef.current = true;
										onAudioEnd?.();
									}
									// Clear the interval since we've stopped
									if (timeCheckIntervalRef.current) {
										clearInterval(timeCheckIntervalRef.current);
										timeCheckIntervalRef.current = null;
									}
								}
							}, 50); // Check every 50ms for precise timing
						}
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
				// Clear time check interval when paused
				if (timeCheckIntervalRef.current) {
					clearInterval(timeCheckIntervalRef.current);
					timeCheckIntervalRef.current = null;
				}
				// Optionally reset currentTime if desired when playAudio becomes false
				// audio.currentTime = 0;
			}
		}
		// This effect now directly controls play/pause based on shouldPlay
	}, [shouldPlay, isLoaded, startTime, endTime, onAudioEnd]);

	return null; // This is a non-visual component
};
