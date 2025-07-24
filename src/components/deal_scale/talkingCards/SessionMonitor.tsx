"use client";

import { Button } from "@/components/ui/button";
import type { Transcript } from "@/types/transcript";
import { useCallback, useState } from "react";
import { SessionView } from "./session";
import { CallCompleteModal } from "./session/CallCompleteModal";

/**
 * SessionMonitor Component
 *
 * A container component that renders the SessionView component.
 * This serves as the main entry point for the session monitoring UI.
 */
export default function SessionMonitor({
	transcript,
	onCallEnd: externalOnCallEnd,
	onTransfer,
	onSessionReset,
}: {
	transcript: Transcript;
	onCallEnd?: () => void;
	onTransfer?: () => void;
	onSessionReset?: (resetFn: () => void) => void;
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [sessionKey, setSessionKey] = useState(Date.now()); // Used to reset the session

	const handleCallEnd = useCallback(() => {
		setIsModalOpen(true);
		if (externalOnCallEnd) {
			externalOnCallEnd();
		}
	}, [externalOnCallEnd]);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
		// Reset the SessionView by changing its key
		setSessionKey(Date.now());
	}, []);

	const handleGetLeads = async () => {
		// Placeholder, replace with actual logic if needed
		console.log("Get leads from Session Monitor");
		return Promise.resolve();
	};

	return (
		<>
			<SessionView
				key={sessionKey}
				transcript={transcript}
				onCallEnd={handleCallEnd}
				onTransfer={onTransfer}
				onSessionReset={onSessionReset}
			/>
			{isModalOpen && (
				<CallCompleteModal isOpen={isModalOpen} onClose={handleCloseModal} />
			)}
		</>
	);
}
