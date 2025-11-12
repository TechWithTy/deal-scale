import type { BentoFeature } from "@/types/bento/features";
import {
	CalendarCheck,
	Clock,
	DatabaseZap,
	PlaneTakeoff,
} from "lucide-react";

export const MainBentoFeatures: BentoFeature[] = [
	{
		title: "Get Started in 1 Click",
		icon: <PlaneTakeoff className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col justify-between rounded-2xl p-4 text-left sm:p-6">
				<div className="flex items-start gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<PlaneTakeoff className="h-5 w-5" />
					</span>
					<div>
						<h3 className="font-semibold text-lg text-foreground leading-tight">
							Get Started in 1 Click
						</h3>
						<p className="text-sm text-muted-foreground">
							From sign-up to first lead in minutes
						</p>
					</div>
				</div>
				<p className="mt-4 text-sm leading-6 text-muted-foreground">
					Import your list, connect your CRM, and launch your AI outreach with
					no technical setup. Watch your first AI conversation go live before
					you finish your coffee.
				</p>
				<p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">
					Simplicity + Early Win &rarr; &ldquo;I can do this.&rdquo;
				</p>
			</div>
		),
	},
	{
		title: "AI That Works While You Sleep",
		icon: <Clock className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col justify-between rounded-2xl p-4 text-left sm:p-6">
				<div className="flex items-start gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<Clock className="h-5 w-5" />
					</span>
					<div>
						<h3 className="font-semibold text-lg text-foreground leading-tight">
							AI That Works While You Sleep
						</h3>
						<p className="text-sm text-muted-foreground">
							Never miss a hot lead again
						</p>
					</div>
				</div>
				<p className="mt-4 text-sm leading-6 text-muted-foreground">
					Your AI responds instantly to every text, call, or form. It
					pre-qualifies, nurtures, and books appointments around the clock so
					no opportunity slips away.
				</p>
				<p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">
					Consistency + Relief &rarr; &ldquo;Finally, peace of mind.&rdquo;
				</p>
			</div>
		),
	},
	{
		title: "Unlimited Skip Tracing",
		icon: <DatabaseZap className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col justify-between rounded-2xl p-4 text-left sm:p-6">
				<div className="flex items-start gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<DatabaseZap className="h-5 w-5" />
					</span>
					<div>
						<h3 className="font-semibold text-lg text-foreground leading-tight">
							Unlimited Skip Tracing
						</h3>
						<p className="text-sm text-muted-foreground">
							Data that does not cost you extra
						</p>
					</div>
				</div>
				<p className="mt-4 text-sm leading-6 text-muted-foreground">
					Build hyper-targeted lists from more than 140 million property
					records. Unlimited, high-quality owner data is included with every
					plan, turning skip tracing into a growth multiplier.
				</p>
				<p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">
					Practical Value + Exclusivity &rarr; &ldquo;They are giving away what others charge for.&rdquo;
				</p>
			</div>
		),
	},
	{
		title: "Appointments, Not Just Leads",
		icon: <CalendarCheck className="h-6 w-6" />,
		content: (
			<div className="flex h-full flex-col justify-between rounded-2xl p-4 text-left sm:p-6">
				<div className="flex items-start gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<CalendarCheck className="h-5 w-5" />
					</span>
					<div>
						<h3 className="font-semibold text-lg text-foreground leading-tight">
							Appointments, Not Just Leads
						</h3>
						<p className="text-sm text-muted-foreground">
							Your calendar, always full
						</p>
					</div>
				</div>
				<p className="mt-4 text-sm leading-6 text-muted-foreground">
					AI-qualified, sales-ready appointments land directly on your calendar.
					You focus on closing while the system handles every follow-up.
				</p>
				<p className="mt-6 text-xs font-medium uppercase tracking-wide text-accent">
					Results + Status &rarr; &ldquo;Real closers do not cold-call.&rdquo;
				</p>
			</div>
		),
	},
];
