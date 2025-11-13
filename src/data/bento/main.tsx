import appointmentSetting from "@/assets/animations/appointment_setting.json";
import dealScaleOutcome from "@/assets/animations/deal_scale_outcome.json";
import launchLoading from "@/assets/animations/launchLoading.json";
import marketAnalysis from "@/assets/animations/market_analysis.json";
import voiceWave from "@/assets/animations/voice_wave_lottie.json";
import {
	DEFAULT_PERSONA,
	DEFAULT_PERSONA_DISPLAY,
	HERO_COPY_V7,
	PERSONA_GOAL,
	PERSONA_LABEL,
} from "@/components/home/heros/live-dynamic-hero-demo/_config";
import { Badge } from "@/components/ui/badge";
import type { BentoFeature } from "@/types/bento/features";
import Lottie from "lottie-react";
import { CalendarCheck, Clock, DatabaseZap, PlaneTakeoff } from "lucide-react";

const chipClassName =
	"mt-6 w-fit rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground backdrop-blur-sm";

const layout = {
	startOne: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
	startTwo: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
	startThree: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
	startFour: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
	startFive: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
} as const;

export const MainBentoFeatures: BentoFeature[] = [
	{
		title: "Full text search",
		description: "Search through all your files in one place.",
		icon: <PlaneTakeoff className="h-6 w-6 text-accent" />,
		className: layout.startOne,
		background: (
			<Lottie
				animationData={launchLoading}
				className="h-36 w-36 opacity-85"
				loop
				autoplay
			/>
		),
		content: (
			<div className="space-y-4 text-foreground">
				<div className="space-y-1">
					<h3 className="text-xl font-semibold text-white leading-tight">
						Launch in One Click
					</h3>
					<p className="text-sm font-medium text-white/80">
						Import, connect, and go live instantly
					</p>
				</div>
				<p className="text-sm leading-6 text-white/75">
					Upload your seller list, connect your CRM, and spin up your first AI
					campaign in a single click—before your coffee cools.
				</p>
				<Badge variant="secondary" className="w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
					AI campaign live in under 60 seconds
				</Badge>
			</div>
		),
	},
	{
		title: "AI That Works While You Sleep",
		description: "Never miss a hot lead again",
		icon: <Clock className="h-6 w-6 text-accent" />,
		className: layout.startTwo,
		background: (
			<Lottie
				animationData={dealScaleOutcome}
				className="h-44 w-44 opacity-85"
				loop
				autoplay
			/>
		),
		content: (
			<div className="space-y-4 text-foreground">
				<div className="space-y-1">
					<h3 className="text-xl font-semibold text-white leading-tight">
						AI That Works While You Sleep
					</h3>
					<p className="text-sm font-medium text-white/80">Never miss a hot lead again</p>
				</div>
				<p className="text-sm leading-6 text-white/75">
					Your AI responds instantly to every text, call, or form. It
					pre-qualifies, nurtures, and books appointments around the clock so no
					opportunity slips away.
				</p>
				<Badge variant="secondary" className="w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
					Replies 24/7 — zero delays
				</Badge>
			</div>
		),
	},
	{
		title: "Appointments, Not Just Leads",
		description: "Your calendar, always full",
		icon: <CalendarCheck className="h-6 w-6 text-accent" />,
		className: layout.startThree,
		background: (
			<Lottie
				animationData={appointmentSetting}
				className="h-36 w-36 opacity-85"
				loop
				autoplay
			/>
		),
		content: (
			<div className="space-y-4 text-foreground">
				<div className="space-y-1">
					<h3 className="text-xl font-semibold text-white leading-tight">
						Appointments, Not Just Leads
					</h3>
					<p className="text-sm font-medium text-white/80">Your calendar, always full</p>
				</div>
				<p className="text-sm leading-6 text-white/75">
					AI-qualified, sales-ready appointments land directly on your calendar.
					You focus on closing while the system handles every follow-up.
				</p>
				<Badge variant="secondary" className="w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
					Calendar auto-filled with sales-ready calls
				</Badge>
			</div>
		),
	},
	{
		title: "Unlimited Skip Tracing",
		description: "Data that does not cost you extra",
		icon: <DatabaseZap className="h-6 w-6 text-accent" />,
		className: layout.startFive,
		background: (
			<Lottie
				animationData={marketAnalysis}
				className="h-36 w-36 opacity-85"
				loop
				autoplay
			/>
		),
		content: (
			<div className="space-y-4 text-foreground">
				<div className="space-y-1">
					<h3 className="text-xl font-semibold text-white leading-tight">
						Unlimited Skip Tracing
					</h3>
					<p className="text-sm font-medium text-white/80">Data that does not cost you extra</p>
				</div>
				<p className="text-sm leading-6 text-white/75">
					Build hyper-targeted lists from more than 140 million property
					records. Unlimited, high-quality owner data is included with every
					plan, turning skip tracing into a growth multiplier.
				</p>
				<Badge variant="secondary" className="w-fit rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-foreground">
					Unlimited owner data included
				</Badge>
			</div>
		),
	},
	(() => {
		const personaCopy = HERO_COPY_V7.personas[DEFAULT_PERSONA];
		const primaryHope = personaCopy.hope[0] ?? "";
		const primarySolution = personaCopy.solution[0] ?? "";
		return {
			title: "Automate deal flow conversations",
			description: "Persona Spotlight: AI Sales Coworkers",
			icon: <CalendarCheck className="h-6 w-6 text-accent" />,
			className: layout.startFour,
			background: (
				<Lottie
					animationData={voiceWave}
					className="h-40 w-40 opacity-85"
					loop
					autoplay
				/>
			),
			content: (
				<div className="space-y-4 rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 p-4 text-left shadow-[0_24px_60px_-38px_rgba(99,102,241,0.45)] backdrop-blur-md sm:p-6 text-foreground">
					<div className="space-y-1">
						<p className="text-xs font-semibold uppercase tracking-wide text-accent">
							{PERSONA_LABEL}
						</p>
						<h3 className="text-xl font-semibold text-white leading-tight">
							{PERSONA_GOAL}
						</h3>
					</div>
					<div className="space-y-3 text-sm text-white/75">
						<p className="font-medium text-white/80">{primarySolution}</p>
						<p>{primaryHope}</p>
					</div>
					<Badge
						variant="secondary"
						className="w-fit rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm"
					>
						Your voice, your pipeline, 24/7
					</Badge>
				</div>
			),
		};
	})(),
];
