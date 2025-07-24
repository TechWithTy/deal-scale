import deal_scale_outcome from "@/assets/animations/deal_scale_outcome.json";
import { Button } from "@/components/ui/button";
import type { BentoFeature } from "@/types/bento/features";
import Lottie from "lottie-react";
import {
	AudioLines,
	Bot,
	Clock,
	DatabaseZap,
	FileSearch,
	PhoneForwarded,
	PlaneTakeoff,
} from "lucide-react";
import Link from "next/link";

// Updated Bento Grid for Deal Scale's ICP
export const MainBentoFeatures: BentoFeature[] = [
	{
		title: "Unlimited Free Skip Tracing",
		icon: <DatabaseZap className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col items-center justify-center p-4 sm:p-6">
				<div className="mb-3 flex w-full justify-center sm:mb-4">
					<DatabaseZap className="h-8 w-8 text-accent" />
				</div>
				<h3 className="mb-3 text-center font-bold text-black text-xl sm:mb-4 sm:text-2xl dark:text-white">
					Unlimited Skip Tracing
				</h3>
				<p className="flex-grow text-center text-black text-xs sm:text-sm dark:text-accent">
					Stop paying for data. Get unlimited, high-quality owner data for free
					with any subscription. A massive cost-saving advantage.
				</p>
			</div>
		),
	},
	{
		title: "Your 24/7 AI Qualification Agent",
		size: "xl",
		content: (
			<div className="relative flex h-full flex-col items-center justify-center p-4 sm:p-6">
				<div className="flex flex-col items-center">
					<h2 className="mb-3 text-center font-bold text-2xl text-black leading-tight sm:mb-4 sm:text-3xl md:text-4xl dark:text-white">
						Never Miss a
						<br />
						Hot Lead
					</h2>

					<Lottie
						animationData={deal_scale_outcome}
						className="h-40 w-40 object-contain sm:h-48 sm:w-48 md:h-56 md:w-56"
						style={{ display: "block", margin: 0, padding: 0, lineHeight: 1 }}
					/>

					<p className="mt-2 text-center text-black text-xs sm:text-sm dark:text-accent">
						Your 24/7 AI qualification agent instantly responds to every
						inquiry—no missed opportunities, no delays. Day or night, the AI
						pre-qualifies motivated sellers, nurtures leads, and seamlessly
						books in-person appraisal appointments directly on your calendar, so
						you can focus on closing more deals.
					</p>
				</div>
			</div>
		),
	},
	{
		title: "Hot Transfers",
		description: "Instantly connect with motivated sellers",
		size: "md",
		content: (
			<div className="flex h-full flex-col items-center justify-center p-4 sm:p-6">
				<PhoneForwarded className="mb-2 h-8 w-8 text-accent" />
				<h2 className="mb-2 text-center font-bold text-black text-xl sm:text-2xl dark:text-white">
					Your 24/7 AI
					<br />
					Qualification Agent
				</h2>
				<div className="flex items-center space-x-2">
					<span className="text-center text-black text-sm sm:text-lg dark:text-accent">
						Our AI agent calls, texts, pre-qualifies, and nurtures your leads so
						you don't have to.
					</span>
				</div>
			</div>
		),
	},
	{
		title: "AI Voice Cloning",
		description: "Build trust with an authentic voice",
		content: (
			<div className="flex h-full flex-col items-center justify-center p-4 sm:p-6">
				<div className="mb-3 flex w-full justify-center sm:mb-4">
					<AudioLines className="h-10 w-10 text-accent" />
				</div>
				<h2 className="mb-3 text-center font-bold text-black text-xl sm:mb-4 sm:text-2xl dark:text-white">
					Authenticity at Scale
				</h2>
				<p className="text-center text-black text-xs sm:mb-3 sm:text-sm dark:text-accent">
					Your AI speaks in your own cloned voice, building instant trust and
					rapport.
				</p>
			</div>
		),
	},
	{
		title: "Appointments on Your Calendar",
		description: "The ultimate outcome for your business",
		size: "md",
		content: (
			<div className="flex h-full flex-col items-center p-4 sm:items-start sm:p-6">
				<div className="mb-auto flex w-full flex-col items-center text-center">
					<h3 className="mb-2 font-bold text-black text-lg sm:text-xl dark:text-white">
						Appointments, Not Just Leads
					</h3>
					<div className="flex min-h-0 w-full flex-1 items-center justify-center">
						{/* Lottie animation for appointments */}
						<Lottie
							animationData={require("@/assets/animations/appointment_setting.json")}
							className="m-0 h-full max-h-48 w-full flex-1 object-contain p-0 sm:max-h-56 md:max-h-64"
							style={{ display: "block", margin: 0, padding: 0, lineHeight: 1 }}
						/>
					</div>
				</div>
				<div className="mb-3 flex items-center sm:mb-4">
					<p className="flex-1 text-center text-black text-xs sm:text-left sm:text-sm dark:text-accent">
						Our AI technology books qualified, sales-ready appointments and
						schedules them directly into your calendar. You don’t have to use
						the word technology, but it makes sense to identify
					</p>
				</div>
			</div>
		),
	},
	{
		title: "140M+ Property Database",
		description: "On-market and off-market deals",
		size: "md",
		content: (
			<div className="flex min-h-0 flex-col items-center p-4 sm:items-start sm:p-6">
				<div className="flex flex-col items-center text-center">
					<h3 className="mb-2 font-bold text-black text-lg sm:text-xl dark:text-white">
						Total Market Access
					</h3>
					<div className="mb-0 flex min-h-0 items-center justify-center">
						{/* Lottie animation for market access */}
						<Lottie
							animationData={require("@/assets/animations/market_analysis.json")}
							className="m-0 max-h-48 object-contain p-0 sm:max-h-56 md:max-h-64"
							style={{ display: "block", margin: 0, padding: 0, lineHeight: 1 }}
						/>
					</div>
				</div>
				<p className="mt-2 mb-0 text-center text-black text-xs sm:text-left sm:text-sm dark:text-accent">
					Build hyper-targeted lists from over 140 million on-market and
					off-market property records.
				</p>
			</div>
		),
	},
	{
		title: "Book Your Demo",
		size: "lg",
		content: (
			<div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-focus/20 p-4 sm:p-6">
				<h3 className="mb-3 text-center font-bold text-black text-xl sm:mb-4 sm:text-2xl dark:text-white">
					Become a Pilot Tester
				</h3>
				<PlaneTakeoff className="mb-4 h-12 w-12 text-accent sm:mb-6 sm:h-16 sm:w-16" />
				<Link
					href="/contact-pilot"
					className="inline-block rounded-full bg-accent px-8 py-4 font-bold text-black text-lg shadow-lg transition-all hover:scale-105 hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:text-white"
				>
					Apply For Priority Beta Access
				</Link>
			</div>
		),
	},
	{
		title: "Save 20+ Hours a Week",
		description: "The all-in-one lead generation engine",
		size: "lg",
		content: (
			<div className="flex h-full flex-col items-center p-4 sm:items-start sm:p-6">
				<h3 className="mb-2 text-center font-bold text-black text-lg sm:text-left sm:text-xl dark:text-white">
					Your Complete Lead Engine
				</h3>
				<p className="mb-3 text-center text-accent text-xs sm:mb-4 sm:text-left sm:text-sm">
					From data gathering to appointment setting, we handle it all so you
					can focus on closing.
				</p>
				<div className="mb-3 flex w-full justify-center sm:justify-start">
					<Link
						href="/contact"
						className="flex animate-pulse items-center gap-3 rounded-full border-2 border-accent/80 bg-gradient-to-r from-accent via-primary to-accent-foreground px-6 py-2 font-extrabold text-base text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:border-accent dark:from-accent dark:via-primary dark:to-accent-foreground dark:text-white"
						style={{ minWidth: "fit-content", textDecoration: "none" }}
					>
						<Clock className="h-7 w-7 text-accent-foreground drop-shadow dark:text-background" />
						<span className="text-black dark:text-white">
							Save 20+ Hours / Week
						</span>
					</Link>
				</div>
			</div>
		),
	},
];
