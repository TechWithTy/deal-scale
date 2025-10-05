"use client";
import { CallCompleteModal } from "@/components/deal_scale/talkingCards/session/CallCompleteModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroSessionMonitorClient from "./HeroSessionMonitorClient";

export default function HeroSessionMonitorClientWithModal() {
	const router = useRouter();
	// State for controlling the call completion modal's visibility
	const [showCallCompleteModal, setShowCallCompleteModal] = useState(false);
	const [modalContent, setModalContent] = useState<"complete" | "transfer">(
		"complete",
	);

	const [sessionReset, setSessionReset] = useState(() => () => {});

	const handleCallEnd = () => {
		setModalContent("complete");
		setShowCallCompleteModal(true);
	};

	const handleTransfer = () => {
		setModalContent("transfer");
		setShowCallCompleteModal(true);
	};

	return (
		<>
			<HeroSessionMonitorClient
				onCallEnd={handleCallEnd}
				onTransfer={handleTransfer}
				onSessionReset={(resetFn) => setSessionReset(() => resetFn)}
				headline="Tired of Chasing "
				subheadline="Stop cold calling all day and start taking appointments from sales-ready home sellers! Deal Scale’s AI suite does the grunt work, so you can focus on what you do best: closing deals."
				badge="AI Powered Seller Lead Qualification & Appointment Setting"
				ctaLabel="Become Beta Tester"
				ctaLabel2="Get Free Ai Call Credits"
				onCtaClick={() => router.push("/contact")}
				onCtaClick2={() => setShowCallCompleteModal(true)}
				highlight="Dead-End Leads?"
				highlightWords={[
					{
						word: "AI suite does the grunt work",
						gradient:
							"from-violet-600 to-blue-500 dark:from-primary dark:to-accent",
					},
					{
						word: "closing deals",
						gradient:
							"from-emerald-600 to-cyan-500 dark:from-secondary dark:to-accent",
					},
				]}
			/>
			<CallCompleteModal
				isOpen={showCallCompleteModal}
				onClose={() => {
					setShowCallCompleteModal(false);
					sessionReset();
				}}
				variant={modalContent}
			/>
		</>
	);
}
