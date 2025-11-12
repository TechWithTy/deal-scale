"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";

const ROTATION_INTERVAL_MS = 4000;

const HERO_MESSAGES = [
	"Sync your CRM with AI precision.",
	"Automate workflows across n8n, Make, and Kestra.",
	"Keep HubSpot, Zoho, and Salesforce perfectly aligned.",
	"No switching CRMs — just scaling smarter.",
];

const BASE_LOGOS = [
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
		alt: "HubSpot logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Zoho-logo.png",
		alt: "Zoho logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg",
		alt: "Zapier logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
		alt: "Salesforce logo",
	},
	{
		src: "https://images.seeklogo.com/logo-png/46/1/make-logo-png_seeklogo-464017.png",
		alt: "Make (formerly Integromat) logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/d/d9/N8n_logo.png",
		alt: "n8n logo",
	},
	{
		src: "https://kestra.io/cdn-cgi/image/f=webp,q=80/docs/tutorial/logos/logo-light-version.png",
		alt: "Kestra logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Pipedrive_Logo.svg",
		alt: "Pipedrive logo",
	},
];

const HERO_IMAGES = [...BASE_LOGOS, ...BASE_LOGOS.slice().reverse()];

/**
 * ConnectAnythingHero renders the full-screen 3D marquee hero with rotating copy.
 */
export function ConnectAnythingHero(): JSX.Element {
	const [activeMessageIndex, setActiveMessageIndex] = useState(0);

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setActiveMessageIndex((index) => (index + 1) % HERO_MESSAGES.length);
		}, ROTATION_INTERVAL_MS);

		return () => window.clearInterval(intervalId);
	}, []);

	return (
		<section
			className={cn(
				"relative flex w-full flex-col items-center justify-center overflow-hidden",
				"bg-gradient-to-b from-white via-slate-100 to-slate-200",
				"py-24 sm:py-32 lg:py-40",
				"dark:from-neutral-950 dark:via-black dark:to-neutral-900",
			)}
		>
			<div className="relative z-20 flex w-full flex-col items-center px-6 text-center">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-6 max-w-4xl text-balance text-center font-black text-4xl leading-[1.2] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
				>
					<AnimatedGradientText
						speed={3}
						colorFrom="#6366f1"
						colorTo="#f97316"
						className="block bg-gradient-to-r from-indigo-400 via-purple-500 to-orange-400 py-1 text-transparent"
					>
						Connect Anything.
					</AnimatedGradientText>
					<AnimatedGradientText
						speed={2.6}
						colorFrom="#6366f1"
						colorTo="#f97316"
						className="block bg-gradient-to-r from-indigo-400 via-purple-500 to-orange-400 py-1 text-transparent"
					>
						Automate Everything.
					</AnimatedGradientText>
				</motion.h1>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeMessageIndex}
						initial={{ opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" }}
						animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
						exit={{ opacity: 0, y: -12, clipPath: "inset(0 0 100% 0)" }}
						transition={{ duration: 0.6, ease: "easeInOut" }}
						className="max-w-2xl text-center"
					>
						<AnimatedGradientText
							speed={2.4}
							colorFrom="#22d3ee"
							colorTo="#f472b6"
							className="font-semibold text-lg text-neutral-700 tracking-tight drop-shadow-sm md:text-xl dark:text-neutral-200"
						>
							{HERO_MESSAGES[activeMessageIndex]}
						</AnimatedGradientText>
					</motion.div>
				</AnimatePresence>
			</div>
			<div className="absolute inset-0 z-10">
				<ThreeDMarquee
					images={HERO_IMAGES}
					className="opacity-90"
					itemClassName="bg-white/90 p-5 dark:bg-slate-900/80"
				/>
			</div>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-transparent dark:from-black" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-transparent dark:from-black" />
		</section>
	);
}
