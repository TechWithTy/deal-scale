"use client";

import { Button } from "@/components/ui/button";
import { default_cal_slug } from "@/data/constants/booking";
import { useCal } from "@/hooks/use-calendly";
import { motion } from "framer-motion";
import { Calendar, Info, Loader2 } from "lucide-react";
import * as React from "react";
// * For accessibility and animation

interface ScheduleMeetingProps {
	calendarLink?: string;
}

const tourBenefits = [
	"Personalized walkthrough of Deal Scale ",
	"See real use cases tailored to your business",
	"Live Q&A with a product expert",
	"Shape Deal Scale To Your Needs",
];

export function ScheduleMeeting({
	calendarLink = default_cal_slug,
}: ScheduleMeetingProps) {
	useCal();
	const [loading, setLoading] = React.useState(false);
	const [showBenefits, setShowBenefits] = React.useState(false);

	// ! Handler for opening the calendar
	const handleBookClick = React.useCallback(() => {
		setLoading(true);
		// Let calendly widget open, then stop loading after a short delay
		setTimeout(() => setLoading(false), 2000);
	}, []);

	return (
		<div className="mb-8 flex flex-col items-center rounded-xl border border-white/10 bg-background-dark/50 p-8 text-center shadow-xl backdrop-blur-sm">
			<div className="mb-4 flex flex-col items-center">
				<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
					<Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
				</div>
				<h2 className="font-bold text-2xl text-black dark:text-white">
					Schedule Product Tour
				</h2>
				<p className="text-black dark:text-white">
					Book a tour of our platform to see how it can help you scale your
					business.
				</p>
			</div>
			{/* * Collapsible: What to expect on your tour */}
			<button
				type="button"
				aria-expanded={showBenefits}
				aria-controls="tour-benefits"
				className="mb-2 flex items-center gap-2 text-primary text-xs underline hover:text-focus focus:outline-none"
				onClick={() => setShowBenefits((v) => !v)}
			>
				<Info className="h-4 w-4" aria-hidden="true" />
				What to expect on your tour
			</button>
			{showBenefits && (
				<ul
					id="tour-benefits"
					className="mb-4 ml-1 list-disc space-y-1 text-muted-foreground text-xs"
					aria-live="polite" // * Accessibility: announce benefits when shown
				>
					{tourBenefits.map((b) => (
						<li key={b}>{b}</li>
					))}
				</ul>
			)}

			{/* * Animated CTA Button */}
			<motion.div
				initial={{ scale: 1 }}
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}
				className="w-full"
			>
				<Button
					data-cal-link={calendarLink}
					data-cal-config='{"theme":"dark"}'
					className="mt-4 w-full bg-gradient-to-r from-primary to-focus transition-opacity hover:opacity-90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
					aria-label="Book a product tour with Torus"
					onClick={handleBookClick}
					disabled={loading}
					data-testid="schedule-meeting-cta"
				>
					{loading ? (
						<span className="flex items-center justify-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							Booking...
						</span>
					) : (
						"Book a Tour"
					)}
				</Button>
			</motion.div>
			{/* todo: Optionally add a secondary action here (e.g., Contact Sales) */}
		</div>
	);
}
