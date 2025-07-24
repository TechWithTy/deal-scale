import type { TimelineEntry } from "@/components/ui/timeline";

export const timeline: TimelineEntry[] = [
	{
		title: "Our Mission",
		subtitle: "Solving Inefficiency",
		content: (
			<div>
				<p className="mb-8 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					Conversations with real estate professionals revealed a critical need:
					a solution for inefficient lead management. Our team embarked on a
					3-month build to create our core AI platform.
				</p>
				<div className="grid grid-cols-2 gap-4">
					<img
						src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Team collaboration"
						width={500}
						height={500}
						className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
					/>
					<img
						src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
						alt="Whiteboard with real estate strategy"
						width={500}
						height={500}
						className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
					/>
				</div>
			</div>
		),
	},
	{
		title: "Q1 2025",
		subtitle: "MVP & Market Validation",
		content: (
			<div>
				<p className="mb-4 font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					Our MVP was ready in January. The market response was overwhelmingly
					positive, validating the need for a better lead generation and
					nurturing solution.
				</p>
				<div className="mb-8 space-y-2">
					<div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
						✅ 200+ passionate beta users signed up to test the platform.
					</div>
					<div className="flex items-center gap-2 font-semibold text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
						✅ 50+ early customers began paying for our service, confirming
						real-world value and ROI.
					</div>
					<div className="flex items-center gap-2 text-neutral-700 text-xs md:text-sm dark:text-neutral-300">
						✅ Early results showed a 70% reduction in manual calling and a 40%
						boost in nurturing efficiency.
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<img
						src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
						alt="Happy customers using product"
						width={500}
						height={500}
						className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
					/>
					<img
						src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop"
						alt="Growth chart"
						width={500}
						height={500}
						className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
					/>
				</div>
			</div>
		),
	},
	{
		title: "Q4 2025",
		subtitle: "The Future is Automated",
		content: (
			<div>
				<p className="font-normal text-neutral-800 text-xs md:text-sm dark:text-neutral-200">
					Nearing our October launch, we're scaling our proven solution. By
					refining our AI agents with real-world data, we're building the
					industry's most effective automation tool. Our vision: to be the AI
					co-pilot for every real estate deal.
				</p>
			</div>
		),
	},
];
