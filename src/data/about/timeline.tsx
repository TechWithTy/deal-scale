import type { TimelineEntry } from "@/components/ui/timeline";
import { timelineSummary } from "./timelineSummary";

const cardClass =
	"space-y-4 rounded-xl border border-border/40 bg-background/70 p-6 text-sm leading-relaxed text-muted-foreground shadow-sm backdrop-blur";

export const timeline: TimelineEntry[] = [
	{
		title: timelineSummary[0].title,
		subtitle: timelineSummary[0].subtitle,
		content: (
			<div className={cardClass}>
				<p>
					DealScale was born from one truth: the people who win in real estate
					are the ones who automate faster than the competition.
				</p>
				<p>
					Agents, wholesalers, and investors crave freedom: the ability to earn
					anywhere, at any time, without drowning in cold calls, CRMs, or chaos.
				</p>
				<p>
					Traditional tools only added complexity, so we built an AI engine that
					thinks like a partner, works like a team, and earns like a machine.
				</p>
			</div>
		),
	},
	{
		title: timelineSummary[1].title,
		subtitle: timelineSummary[1].subtitle,
		content: (
			<div className={cardClass}>
				<blockquote className="border-primary/40 border-l-2 pl-4 font-semibold text-base text-foreground">
					"Wealth is a system, not a secret, and automation is the great
					equalizer."
				</blockquote>
				<p>
					We are not here to make software smarter. We exist to make people
					richer by giving every operator the leverage once reserved for
					corporate teams and million-dollar tech stacks.
				</p>
				<p>
					Our AI learns, sells, and scales with you, so your ambition is never
					limited by headcount or manual effort again.
				</p>
			</div>
		),
	},
	{
		title: timelineSummary[2].title,
		subtitle: timelineSummary[2].subtitle,
		content: (
			<div className={cardClass}>
				<p>
					We left the crowded CRM race and reimagined what wealth systems should
					do for modern deal makers.
				</p>
				<div className="grid gap-4 lg:grid-cols-2">
					<div className="rounded-lg bg-muted/20 p-4">
						<h4 className="font-semibold text-foreground text-sm">
							Red Ocean (Old Market)
						</h4>
						<ul className="mt-2 list-disc space-y-2 pl-4">
							<li>Competing on CRM features</li>
							<li>Tools built for tracking</li>
							<li>Efficiency language</li>
							<li>"Manage your pipeline."</li>
							<li>Product focus</li>
							<li>Subscription SaaS</li>
						</ul>
					</div>
					<div className="rounded-lg bg-primary/5 p-4">
						<h4 className="font-semibold text-foreground text-sm">
							Blue Ocean (DealScale)
						</h4>
						<ul className="mt-2 list-disc space-y-2 pl-4">
							<li>Redefining what a CRM even is</li>
							<li>Systems built for earning</li>
							<li>Wealth and freedom language</li>
							<li>"Automate your income."</li>
							<li>Lifestyle movement</li>
							<li>Wealth-as-a-Service ecosystem</li>
						</ul>
					</div>
				</div>
			</div>
		),
	},
	{
		title: timelineSummary[3].title,
		subtitle: timelineSummary[3].subtitle,
		content: (
			<div className={cardClass}>
				<p className="font-semibold text-foreground">We are not a CRM.</p>
				<p className="font-semibold text-foreground">
					We are an AI Wealth Engine.
				</p>
				<p>
					DealScale orchestrates your entire cross-CRM universe, running
					automations, enriching data, cloning your voice, and proving the
					dollars it generates.
				</p>
				<p>
					It is where real estate professionals stop working in their business
					and start scaling as a brand.
				</p>
			</div>
		),
	},
	{
		title: timelineSummary[4].title,
		subtitle: timelineSummary[4].subtitle,
		content: (
			<div className={cardClass}>
				<p>
					The League turns success into a game, ranking every operator on impact
					metrics that actually matter: ROI, time saved, and deal value.
				</p>
				<blockquote className="border-primary/40 border-l-2 pl-4 font-semibold text-base text-foreground">
					"Your pipeline is the scoreboard."
				</blockquote>
				<ul className="list-disc space-y-2 pl-4">
					<li>
						<strong>Operators:</strong> learn automation and build their first
						playbooks.
					</li>
					<li>
						<strong>Closers:</strong> dominate with AI voice agents and
						conversation intelligence.
					</li>
					<li>
						<strong>Titans:</strong> mentor the field and profit from the system
						itself.
					</li>
				</ul>
				<p>
					It is not gamifying work; it is making wealth a competition worth
					joining.
				</p>
			</div>
		),
	},
	{
		title: timelineSummary[5].title,
		subtitle: timelineSummary[5].subtitle,
		content: (
			<div className={cardClass}>
				<p>
					We do not sell features. We sell status, freedom, and momentum for
					every ambitious operator on the platform.
				</p>
				<p>
					DealScale users are defined by the lifestyle they unlock, not the
					software they log into.
				</p>
				<div className="rounded-lg bg-muted/20 p-4 font-semibold text-foreground text-sm">
					<p>Earn while you sleep.</p>
					<p>Scale while you play.</p>
					<p>Flex what you have built.</p>
				</div>
			</div>
		),
	},
	{
		title: timelineSummary[6].title,
		subtitle: timelineSummary[6].subtitle,
		content: (
			<div className={cardClass}>
				<p>
					Every promise is engineered to show real-time progress on wealth,
					freedom, and credibility.
				</p>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="rounded-lg bg-muted/20 p-4">
						<h4 className="font-semibold text-foreground text-sm">Speed</h4>
						<p>Launch in five minutes and see automations go live instantly.</p>
					</div>
					<div className="rounded-lg bg-muted/20 p-4">
						<h4 className="font-semibold text-foreground text-sm">
							Automation
						</h4>
						<p>
							AI that calls, texts, and follows up while you move through your
							day.
						</p>
					</div>
					<div className="rounded-lg bg-muted/20 p-4">
						<h4 className="font-semibold text-foreground text-sm">Wealth</h4>
						<p>
							ROI dashboards that track dollars earned and hours saved in
							real-time.
						</p>
					</div>
					<div className="rounded-lg bg-muted/20 p-4">
						<h4 className="font-semibold text-foreground text-sm">Freedom</h4>
						<p>Operate from anywhere and own your time outright.</p>
					</div>
					<div className="rounded-lg bg-muted/20 p-4 md:col-span-2">
						<h4 className="font-semibold text-foreground text-sm">Status</h4>
						<p>
							Leaderboards, badges, and proof-of-success for every win you log.
						</p>
					</div>
				</div>
			</div>
		),
	},
	{
		title: timelineSummary[7].title,
		subtitle: timelineSummary[7].subtitle,
		content: (
			<div className={cardClass}>
				<p>
					For brokerages and advanced investors, DealScale offers a self-hosted
					license so your AI trains on your data and stays fully compliant.
				</p>
				<p>
					Your instance becomes a private wealth engine you own, govern, and
					profit from.
				</p>
				<ul className="list-disc space-y-2 pl-4">
					<li>Revenue share to align incentives.</li>
					<li>Hybrid licensing for strategic partners.</li>
					<li>Full buyout when owning the stack is mission critical.</li>
				</ul>
				<p>Freedom through ownership. Profit through automation.</p>
			</div>
		),
	},
	{
		title: timelineSummary[8].title,
		subtitle: timelineSummary[8].subtitle,
		content: (
			<div className={cardClass}>
				<ul className="list-disc space-y-2 pl-4">
					<li>Stop Dialing. Start Scaling.</li>
					<li>Make Money While You Sleep or While You Are on the Jet Ski.</li>
					<li>Your CRM Will Not Make You Rich. DealScale Will.</li>
					<li>Automation Is the New Status Symbol.</li>
					<li>Wealth at the Speed of AI.</li>
				</ul>
			</div>
		),
	},
	{
		title: timelineSummary[9].title,
		subtitle: timelineSummary[9].subtitle,
		content: (
			<div className={cardClass}>
				<p>
					DealScale is not about software. It is about leverage: the first AI
					Wealth Engine built for real estate visionaries who demand both
					freedom and future-proof scale.
				</p>
				<blockquote className="border-primary/40 border-l-2 pl-4 font-semibold text-base text-foreground">
					Built for the ambitious, designed for freedom, and scaled for the
					future.
				</blockquote>
			</div>
		),
	},
];
