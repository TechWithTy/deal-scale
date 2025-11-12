import dealScaleOutcome from "@/assets/animations/deal_scale_outcome.json";
import launchLoading from "@/assets/animations/launchLoading.json";
import marketAnalysis from "@/assets/animations/market_analysis.json";
import appointmentSetting from "@/assets/animations/appointment_setting.json";
import voiceWave from "@/assets/animations/voice_wave_lottie.json";
import {
	DEFAULT_PERSONA,
	DEFAULT_PERSONA_DISPLAY,
	HERO_COPY_V7,
	PERSONA_GOAL,
	PERSONA_LABEL,
} from "@/components/home/heros/live-dynamic-hero-demo/_config";
import type { BentoFeature } from "@/types/bento/features";
import Lottie from "lottie-react";
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
			<div className="flex h-full flex-col justify-between rounded-2xl bg-background/60 p-4 text-left shadow-[0_16px_48px_-32px_rgba(56,189,248,0.35)] backdrop-blur-md sm:p-6">
				<div className="mb-4 flex items-center justify-between gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<PlaneTakeoff className="h-5 w-5" />
					</span>
					<Lottie
						animationData={launchLoading}
						className="h-16 w-16 sm:h-20 sm:w-20"
						loop
						autoplay
					/>
				</div>
				<div className="space-y-2">
					<h3 className="font-semibold text-lg text-foreground leading-tight">
						Get Started in 1 Click
					</h3>
					<p className="text-sm text-muted-foreground">
						From sign-up to first lead in minutes
					</p>
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
			<div className="flex h-full flex-col justify-between rounded-2xl bg-background/60 p-4 text-left shadow-[0_16px_48px_-32px_rgba(129,140,248,0.35)] backdrop-blur-md sm:p-6">
				<div className="mb-4 flex items-center justify-between gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<Clock className="h-5 w-5" />
					</span>
					<Lottie
						animationData={dealScaleOutcome}
						className="h-20 w-20 sm:h-24 sm:w-24"
						loop
						autoplay
					/>
				</div>
				<div className="space-y-2">
					<h3 className="font-semibold text-lg text-foreground leading-tight">
						AI That Works While You Sleep
					</h3>
					<p className="text-sm text-muted-foreground">
						Never miss a hot lead again
					</p>
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
			<div className="flex h-full flex-col justify-between rounded-2xl bg-background/60 p-4 text-left shadow-[0_16px_48px_-32px_rgba(45,212,191,0.35)] backdrop-blur-md sm:p-6">
				<div className="mb-4 flex items-center justify-between gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<DatabaseZap className="h-5 w-5" />
					</span>
					<Lottie
						animationData={marketAnalysis}
						className="h-20 w-20 sm:h-24 sm:w-24"
						loop
						autoplay
					/>
				</div>
				<div className="space-y-2">
					<h3 className="font-semibold text-lg text-foreground leading-tight">
						Unlimited Skip Tracing
					</h3>
					<p className="text-sm text-muted-foreground">
						Data that does not cost you extra
					</p>
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
			<div className="flex h-full flex-col justify-between rounded-2xl bg-background/60 p-4 text-left shadow-[0_16px_48px_-32px_rgba(251,191,36,0.35)] backdrop-blur-md sm:p-6">
				<div className="mb-4 flex items-center justify-between gap-3">
					<span className="rounded-full bg-accent/15 p-2 text-accent">
						<CalendarCheck className="h-5 w-5" />
					</span>
					<Lottie
						animationData={appointmentSetting}
						className="h-20 w-20 sm:h-24 sm:w-24"
						loop
						autoplay
					/>
				</div>
				<div className="space-y-2">
					<h3 className="font-semibold text-lg text-foreground leading-tight">
						Appointments, Not Just Leads
					</h3>
					<p className="text-sm text-muted-foreground">
						Your calendar, always full
					</p>
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
	(() => {
		const personaCopy = HERO_COPY_V7.personas[DEFAULT_PERSONA];
		const primaryHope = personaCopy.hope[0] ?? "";
		const primarySolution = personaCopy.solution[0] ?? "";
		return {
			title: `${DEFAULT_PERSONA_DISPLAY} Activation`,
			size: "lg" as const,
			content: (
				<div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 p-4 text-left shadow-[0_24px_60px_-38px_rgba(99,102,241,0.45)] backdrop-blur-md sm:p-6">
					<div className="mb-4 flex items-center justify-between gap-3">
						<div className="space-y-1">
							<p className="text-xs font-semibold uppercase tracking-wide text-accent">
								{PERSONA_LABEL}
							</p>
							<h3 className="text-lg font-semibold text-foreground leading-tight">
								{PERSONA_GOAL}
							</h3>
						</div>
						<Lottie
							animationData={voiceWave}
							className="h-20 w-20 sm:h-24 sm:w-24"
							loop
							autoplay
						/>
					</div>
					<div className="space-y-3 text-sm text-muted-foreground">
						<p>
							Persona Spotlight:{" "}
							<span className="font-semibold text-foreground">
								{DEFAULT_PERSONA_DISPLAY}
							</span>
						</p>
						<p>{primarySolution}</p>
						<p>{primaryHope}</p>
					</div>
					<p className="mt-4 text-xs font-medium uppercase tracking-wide text-accent">
						Personalized Automation &rarr; Hero goals stay locked in.
					</p>
				</div>
			),
		};
	})(),
];
