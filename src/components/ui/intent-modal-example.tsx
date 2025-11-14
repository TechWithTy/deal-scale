"use client";

/**
 * Example usage of IntentModal with exit intent and feedback capture.
 * This file demonstrates various use cases - copy patterns as needed.
 */

import { useExitIntent } from "@/hooks/useExitIntent";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { IntentModal } from "./intent-modal";
import { Label } from "./label";
import { Textarea } from "./textarea";

/**
 * Example: Exit Intent Feedback Modal
 * Triggers when user moves mouse to top of viewport (indicating they're leaving)
 *
 * Note: Exit intent detection is gated behind the
 * `NEXT_PUBLIC_ENABLE_EXIT_INTENT=true` environment variable.
 */
export function ExitIntentFeedbackExample() {
	const [open, setOpen] = useState(false);
	const [feedback, setFeedback] = useState("");
	const [email, setEmail] = useState("");

	useExitIntent({
		onExitIntent: () => setOpen(true),
		minTimeOnPage: 5000, // Only trigger after 5 seconds
		oncePerSession: true, // Only show once per session
	});

	const handleSubmit = () => {
		// Handle feedback submission
		console.log({ feedback, email });
		setOpen(false);
		setFeedback("");
		setEmail("");
	};

	return (
		<IntentModal
			intent="exit-intent"
			variant="modal"
			size="md"
			tone="elevated"
			accent="emerald"
			eyebrow="Stay ahead"
			open={open}
			onClose={() => setOpen(false)}
			title="Wait! Before you go..."
			description="We'd love your feedback to help improve DealScale. It only takes 30 seconds!"
			actions={
				<>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Maybe Later
					</Button>
					<Button onClick={handleSubmit} disabled={!feedback.trim()}>
						Submit Feedback
					</Button>
				</>
			}
		>
			<div className="space-y-4">
				<div>
					<Label htmlFor="feedback-email">Email (optional)</Label>
					<Input
						id="feedback-email"
						type="email"
						placeholder="your@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="feedback-text">Your feedback</Label>
					<Textarea
						id="feedback-text"
						placeholder="What can we improve?"
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						rows={4}
					/>
				</div>
			</div>
		</IntentModal>
	);
}

/**
 * Example: Newsletter Signup Drawer
 * Can be triggered manually or via exit intent
 */
export function NewsletterSignupExample() {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");

	const handleSubscribe = () => {
		// Handle newsletter subscription
		console.log({ email });
		setOpen(false);
		setEmail("");
	};

	return (
		<>
			<Button onClick={() => setOpen(true)}>Subscribe to Newsletter</Button>
			<IntentModal
				intent="newsletter"
				variant="drawer"
				size="md"
				open={open}
				onClose={() => setOpen(false)}
				title="Stay in the loop"
				description="Get the latest updates, tips, and exclusive content delivered to your inbox."
				actions={
					<>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSubscribe} disabled={!email.trim()}>
							Subscribe
						</Button>
					</>
				}
			>
				<div className="space-y-4">
					<div>
						<Label htmlFor="newsletter-email">Email address</Label>
						<Input
							id="newsletter-email"
							type="email"
							placeholder="your@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<p className="text-muted-foreground text-xs">
						We respect your privacy. Unsubscribe at any time.
					</p>
				</div>
			</IntentModal>
		</>
	);
}

/**
 * Example: Inline Feedback Form
 * Embedded directly in the page
 */
export function InlineFeedbackExample() {
	const [feedback, setFeedback] = useState("");

	const handleSubmit = () => {
		// Handle feedback submission
		console.log({ feedback });
		setFeedback("");
	};

	return (
		<IntentModal
			intent="feedback"
			variant="inline"
			size="lg"
			tone="elevated"
			title="Share your thoughts"
			description="Help us improve by sharing your feedback"
			actions={
				<Button onClick={handleSubmit} disabled={!feedback.trim()}>
					Submit Feedback
				</Button>
			}
		>
			<Textarea
				placeholder="What's on your mind?"
				value={feedback}
				onChange={(e) => setFeedback(e.target.value)}
				rows={5}
			/>
		</IntentModal>
	);
}

/**
 * Example: Survey Modal
 * Can be triggered after specific user actions
 */
export function SurveyExample() {
	const [open, setOpen] = useState(false);
	const [rating, setRating] = useState<number | null>(null);

	// Trigger after user completes an action
	// useEffect(() => {
	//   if (actionCompleted) {
	//     setTimeout(() => setOpen(true), 2000);
	//   }
	// }, [actionCompleted]);

	return (
		<IntentModal
			intent="survey"
			variant="modal"
			size="sm"
			open={open}
			onClose={() => setOpen(false)}
			title="How was your experience?"
			description="Rate your experience with DealScale"
			actions={
				<>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Skip
					</Button>
					<Button
						onClick={() => {
							console.log({ rating });
							setOpen(false);
						}}
						disabled={rating === null}
					>
						Submit
					</Button>
				</>
			}
		>
			<div className="flex justify-center gap-2">
				{[1, 2, 3, 4, 5].map((num) => (
					<button
						key={num}
						type="button"
						onClick={() => setRating(num)}
						className={`h-12 w-12 rounded-full border-2 transition ${
							rating === num
								? "border-primary bg-primary text-primary-foreground"
								: "border-border hover:border-primary/50"
						}`}
					>
						{num}
					</button>
				))}
			</div>
		</IntentModal>
	);
}
