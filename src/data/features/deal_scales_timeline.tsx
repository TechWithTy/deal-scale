import type { TimelineEntry } from "@/components/ui/timeline";
// ! This file uses JSX and must be .tsx for correct TypeScript and Biome support.
import React from "react";
// * Deal Scales Feature Timeline
// ! Images should be optimized and have descriptive alt text
// todo: Refine milestone content and images as product evolves
// ! Use a CDN or Next.js <Image> for further optimization if/when migrated

export const dealScalesTimeline: TimelineEntry[] = [
	{
		title: "Q3 2024: Discovering the Deal Bottleneck",
		content: (
			<div>
				<p className="mb-8 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					The journey began with deep-dive interviews with investors and agents.
					We identified the pain points in scaling deal flow and saw a gap for
					automation and intelligence in the process.
				</p>
				<div className="grid grid-cols-2 gap-4">
					<img
						src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop"
						alt="Brainstorming session: identifying deal flow bottlenecks with team at whiteboard."
						width={500}
						height={500}
						loading="lazy"
						className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
					/>
					<img
						src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop"
						alt="Team mapping automation opportunities on sticky notes and diagrams."
						width={500}
						height={500}
						loading="lazy"
						className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
					/>
				</div>
			</div>
		),
	},
	{
		title: "Q4 2024: MVP Launch & Early Traction",
		content: (
			<div>
				<p className="mb-4 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					Our MVP launched, focused on automating lead qualification and
					nurturing. Early adopters saw a 60% reduction in manual work and a 30%
					increase in deal conversions.
				</p>
				<div className="mb-8 space-y-2">
					<div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
						✅ 100+ users onboarded and provided actionable feedback.
					</div>
					<div className="flex items-center gap-2 font-semibold text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
						✅ 25+ deals closed through the platform in the first quarter.
					</div>
					<div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
						✅ Investors reported faster, more confident decision-making.
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<img
						src="https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?q=80&w=800&auto=format&fit=crop"
						alt="Team celebrating MVP launch with confetti and laptops."
						width={500}
						height={500}
						loading="lazy"
						className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
					/>
					<img
						src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop"
						alt="Dashboard showing deal success analytics and growth charts."
						width={500}
						height={500}
						loading="lazy"
						className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
					/>
				</div>
			</div>
		),
	},
	{
		title: "Q1 2025: AI-Powered Scaling",
		content: (
			<div>
				<p className="font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					With feedback from early users, we doubled down on AI-driven deal
					analysis and smart automations. The platform began surfacing the best
					opportunities and automating follow-ups at scale.
				</p>
				<p className="mt-4 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					Our mission: to become the essential copilot for every ambitious
					dealmaker.
				</p>
			</div>
		),
	},
];
