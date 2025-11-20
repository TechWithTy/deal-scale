import voiceWaveAnimation from "@/assets/animations/voice_wave_lottie.json";
import ClientLottie from "@/components/ui/ClientLottie";
import { CheckCircle, XCircle } from "lucide-react";
import type React from "react";

interface TestingCardProps {
	status: "testing" | "fail" | "success";
	onRetry?: () => void;
	onClose?: () => void;
}

const statusConfig = {
	testing: {
		icon: null,
		title: "Testing your workflow...",
		message: "Please wait while we validate your automation code.",
		action: null,
	},
	fail: {
		icon: <XCircle size={56} className="mb-2 text-red-500" />,
		title: "Testing failed",
		message: "Your work flow did not compile. Try Again?",
		action: "Try Again",
	},
	success: {
		icon: <CheckCircle size={56} className="mb-2 text-green-500" />,
		title: "Workflow Submitted for Approval!",
		message:
			"Your workflow passed automated testing and is under review for monetization.",
		action: "Close",
	},
};

const TestingCard: React.FC<TestingCardProps> = ({
	status,
	onRetry,
	onClose,
}) => {
	const cfg = statusConfig[status];
	return (
		<div className="flex flex-col items-center justify-center px-4 py-10">
			{status === "testing" && (
				<div className="mb-3">
					<ClientLottie
						animationData={voiceWaveAnimation}
						style={{ width: 120, height: 60 }}
						loop
						autoplay
					/>
				</div>
			)}
			{cfg.icon}
			<h2 className="mb-2 text-center font-semibold text-xl">{cfg.title}</h2>
			<p className="mb-4 text-center text-gray-500">{cfg.message}</p>
			{status === "fail" && (
				<button
					onClick={onRetry}
					className="rounded bg-primary px-4 py-2 font-semibold text-white"
				>
					{cfg.action}
				</button>
			)}
			{status === "success" && (
				<button
					onClick={onClose}
					className="rounded bg-primary px-4 py-2 font-semibold text-white"
				>
					{cfg.action}
				</button>
			)}
		</div>
	);
};

export default TestingCard;
