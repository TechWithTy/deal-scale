"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useNavigationRouter } from "@/hooks/useNavigationRouter";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CallCompleteModalProps {
	/** Whether the modal is open */
	isOpen: boolean;
	/** Callback when modal is requested to close */
	onClose: () => void;

	/** Optional title for the modal */
	title?: string;
	/** Optional description for the modal */
	description?: string;
	/** Optional loading state from parent */
	isLoading?: boolean;
	variant?: "complete" | "transfer";
}

export const CallCompleteModal = ({
	isOpen,
	onClose: originalOnClose,
	title = "Ready to start Scaling Your Deals?",
	description = "Request Founders Circle or Pilot access to unlock early onboarding perks and personalized workflows.",
	isLoading: externalLoading = false,
	variant = "complete",
}: CallCompleteModalProps) => {
	const router = useNavigationRouter();
	const handleClose = () => {
		const audioElements = document.getElementsByTagName("audio");
		for (const audio of audioElements) {
			audio.pause();
			audio.currentTime = 0;
		}
		originalOnClose();
	};
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGetLeads = async () => {
		try {
			setIsLoading(true);
			setError(null);
			await router.push("/contact");
			handleClose();
		} catch (err) {
			console.error("Failed to get leads:", err);
			setError("Failed to load leads. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGetOffMarketLead = async () => {
		try {
			setIsLoading(true);
			setError(null);
			await router.push("/contact-pilot");
			handleClose();
		} catch (err) {
			console.error("Failed to get leads:", err);
			setError("Failed to load leads. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const isProcessing = isLoading || externalLoading;

	const content = {
		complete: {
			title: "Ready to start Scaling Your Deals?",
			description:
				"Request Founders Circle or Pilot access to unlock early onboarding perks and personalized workflows.",
		},
		transfer: {
			title: "Transferring you now...",
			description: "Please wait while we connect you to a specialist.",
		},
	};

	const { title: modalTitle, description: modalDescription } = content[variant];

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent
				className="sm:max-w-[425px]"
				onInteractOutside={(e) => {
					if (!isProcessing) {
						e.preventDefault();
						handleClose();
					}
				}}
			>
				<DialogHeader>
					<DialogTitle className="text-center font-bold text-2xl tracking-tight">
						{modalTitle}
					</DialogTitle>
					<DialogDescription className="text-center">
						{modalDescription}
					</DialogDescription>
				</DialogHeader>

				{error && (
					<div
						className="rounded-md bg-red-50 p-3 text-red-600 text-sm"
						role="alert"
					>
						{error}
					</div>
				)}

				<div className="flex flex-col space-y-3 pt-2">
					<Button
						onClick={handleGetLeads}
						disabled={isProcessing}
						size="lg"
						className={cn(
							"w-full py-6 font-semibold text-lg",
							"bg-gradient-to-r from-primary to-primary/90",
							"hover:from-primary/90 hover:to-primary/80",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
							"transition-all duration-200",
						)}
					>
						{isProcessing ? (
							<>
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								Processing...
							</>
						) : (
							"Get 5 Ai Calling Credits"
						)}
					</Button>
					<Button
						onClick={handleGetOffMarketLead}
						disabled={isProcessing}
						size="lg"
						className={cn(
							"w-full rounded-xl py-6 font-bold text-lg shadow-lg",
							"bg-gradient-to-r from-primary via-blue-500 to-primary/80",
							"text-primary-foreground",
							"hover:from-primary/90 hover:via-blue-400 hover:to-primary/70",
							"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
							"ring-2 ring-primary/40",
							"transition-all duration-150",
							"border-2 border-primary",
						)}
					>
						{isProcessing ? (
							<>
								<Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-foreground" />
								Processing...
							</>
						) : (
							<span className="tracking-tight drop-shadow-sm">
								Get{" "}
								<span className="rounded bg-background px-2 py-1 font-extrabold text-primary shadow">
									15 Ai Calling Credits
								</span>
							</span>
						)}
					</Button>

					<Button
						onClick={handleClose}
						variant="outline"
						size="lg"
						disabled={isProcessing}
						className="w-full py-6 text-lg hover:bg-accent hover:text-accent-foreground"
					>
						Maybe Later
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
