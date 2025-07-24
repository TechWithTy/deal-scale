// ! This file uses JSX and must be .tsx for correct TypeScript and Biome support.
import type { TimelineEntry } from "@/components/ui/timeline";
// * Deal Scales Feature Timeline
// ! Images should be optimized and have descriptive alt text
// todo: Refine milestone content and images as product evolves
// ! Use a CDN or Next.js <Image> for further optimization if/when migrated

export const featureTimeline: TimelineEntry[] = [
	{
		title: "Q2 2025: Seamless CRM Integrations",
		content: (
			<div>
				<p className="mb-8 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					We’re building plug-and-play integrations with top CRMs and deal
					management platforms, making it effortless to sync deal data,
					contacts, and activity across your workflow.
				</p>
				<div className="grid grid-cols-2 gap-4">
					<img
						src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"
						alt="Product team working on CRM integration modules."
						width={500}
						height={500}
						loading="lazy"
						className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
					/>
					<img
						src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=800&auto=format&fit=crop"
						alt="User connecting multiple apps and APIs to the platform."
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
		title: "Q3 2025: Advanced AI Deal Sourcing",
		content: (
			<div>
				<p className="mb-4 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					We will launch AI-powered sourcing that proactively identifies and
					qualifies high-potential deals from public and private sources,
					directly in your pipeline.
				</p>
				<div className="mb-8 space-y-2">
					<div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
						🚀 AI scouts and recommends top matches for your investment
						criteria.
					</div>
					<div className="flex items-center gap-2 font-semibold text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
						⚡️ Personalized lead scoring and opportunity alerts.
					</div>
					<div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
						🤝 Seamless handoff from prospecting to nurturing, all automated.
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<img
						src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"
						alt="AI dashboard highlighting new, high-potential deals."
						width={500}
						height={500}
						loading="lazy"
						className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
					/>
					<img
						src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
						alt="Automated system sending notifications for matched opportunities."
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
		title: "Q4 2025: Predictive Analytics & Deal Forecasting",
		content: (
			<div>
				<p className="font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					Our next leap is predictive analytics—AI models will forecast deal
					outcomes, recommend optimal actions, and benchmark performance with
					real-time industry data.
				</p>
				<p className="mt-4 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					Stay ahead of market trends and maximize your win rate with actionable
					intelligence baked into every step.
				</p>
			</div>
		),
	},
];
