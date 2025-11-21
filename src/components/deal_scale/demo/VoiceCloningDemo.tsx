"use client";

import { useCallback, useState } from "react";
import { SessionView } from "../talkingCards/session";
import { CallCompleteModal } from "../talkingCards/session/CallCompleteModal";

import Header from "@/components/common/Header";
import { afterTranscript } from "@/data/transcripts/voiceCloningAfter";
import { beforeTranscript } from "@/data/transcripts/voiceCloningBefore";

export const VoiceCloningDemo = () => {
	const [demoStage, setDemoStage] = useState<"before" | "after">("before");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [autoPlay, setAutoPlay] = useState(false);

	// Unified handler for both demo stages
	const handleSessionEnd = useCallback(
		({ manual }: { manual: boolean }) => {
			const pauseAllAudio = () => {
				const audioElements = document.getElementsByTagName("audio");
				for (const audio of audioElements) {
					audio.pause();
					audio.currentTime = 0;
				}
			};

			if (demoStage === "before") {
				if (manual) {
					pauseAllAudio();
					setDemoStage("before"); // Reset to initial state
					setIsModalOpen(true);
					setAutoPlay(false);
				} else {
					setDemoStage("after"); // Advance to cloned voice
					setAutoPlay(true); // Auto-play cloned voice
				}
			} else {
				// Cloned voice: always show modal and reset after close
				pauseAllAudio();
				setDemoStage("before");
				setIsModalOpen(true);
				setAutoPlay(false);
			}
		},
		[demoStage],
	);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
		setDemoStage("before");
	}, []);

	const handleGetLeads = async () => {
		console.log("Get leads from Voice Cloning Demo");
		return Promise.resolve();
	};

	const currentTranscript =
		demoStage === "before" ? beforeTranscript : afterTranscript;

	return (
		<>
			<Header
				size="sm"
				title="Voice Cloning Demo"
				subtitle="Personalize Your Agents"
			/>
			<SessionView
				key={demoStage} // Ensure the component re-mounts when the stage changes
				transcript={currentTranscript}
				onCallEnd={handleSessionEnd}
				autoPlay={demoStage === "after" && autoPlay}
				showEndButton={demoStage === "after"}
			/>

			{isModalOpen && (
				<CallCompleteModal isOpen={isModalOpen} onClose={handleCloseModal} />
			)}
		</>
	);
};
