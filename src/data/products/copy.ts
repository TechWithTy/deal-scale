import type {
	ABTest,
	ABTestCopy,
	AbTestAnalysis,
	AbTestVariant,
	AbTestWarning,
} from "@/types/testing";

type AbTestCopyInput = Omit<ABTestCopy, "hope" | "fear"> &
	Partial<Pick<ABTestCopy, "hope" | "fear">>;

type AbTestVariantInput = Omit<AbTestVariant, "copy"> & {
	copy?: AbTestCopyInput;
};

type AbTestInput = Omit<ABTest, "variants"> & {
	variants: AbTestVariantInput[];
};

const sanitizeCopy = (copy: AbTestCopyInput): ABTestCopy => {
	const trimmed = Object.entries(copy).reduce<
		Partial<ABTestCopy> & Record<string, unknown>
	>((acc, [key, value]) => {
		if (typeof value === "string") {
			acc[key] = value.trim();
			return acc;
		}
		if (Array.isArray(value)) {
			acc[key] = value.map((item) =>
				typeof item === "string" ? item.trim() : item,
			);
			return acc;
		}
		acc[key] = value;
		return acc;
	}, {});

	const hopeSource =
		(trimmed.hope && trimmed.hope.length > 0 ? trimmed.hope : undefined) ??
		(typeof trimmed.whatsInItForMe === "string"
			? trimmed.whatsInItForMe
			: undefined) ??
		(trimmed.solution && trimmed.solution.length > 0
			? trimmed.solution
			: undefined) ??
		"";

	const fearSource =
		(trimmed.fear && trimmed.fear.length > 0 ? trimmed.fear : undefined) ??
		(trimmed.pain_point && trimmed.pain_point.length > 0
			? trimmed.pain_point
			: undefined) ??
		"";

	return {
		...trimmed,
		hope: hopeSource,
		fear: fearSource,
		highlighted_words: Array.from(
			new Set(
				((trimmed.highlighted_words as string[] | undefined) ?? [])
					.map((word) => word.trim())
					.filter(Boolean),
			),
		),
	} as ABTestCopy;
};

const analyzeVariants = (
	variants: AbTestVariant[],
	testName: string,
	isActive: boolean | undefined,
): AbTestAnalysis => {
	const warnings: AbTestWarning[] = [];
	const totalPercentage = variants.reduce(
		(total, variant) => total + (variant.percentage ?? 0),
		0,
	);

	if (Math.abs(totalPercentage - 100) > 0.001) {
		warnings.push({
			code: "percentage-total-mismatch",
			message: `Variants in "${testName}" add up to ${totalPercentage}, expected 100.`,
			severity: "warning",
			field: "percentage",
		});
	}

	const ctas = new Map<string, number>();
	variants.forEach((variant, index) => {
		const { copy, name } = variant;
		if (!copy) {
			warnings.push({
				code: "missing-copy",
				message: `Variant "${name ?? `#${index + 1}`}" is missing copy.`,
				severity: "error",
				variantIndex: index,
				variantName: name,
			});
			return;
		}

		if (!copy.hope || copy.hope.length < 5) {
			warnings.push({
				code: "weak-hope",
				message: `Hope statement is very short for variant "${name ?? `#${index + 1}`}".`,
				severity: "warning",
				variantIndex: index,
				variantName: name,
				field: "hope",
			});
		}

		if (!copy.fear || copy.fear.length < 5) {
			warnings.push({
				code: "weak-fear",
				message: `Fear statement is very short for variant "${name ?? `#${index + 1}`}".`,
				severity: "warning",
				variantIndex: index,
				variantName: name,
				field: "fear",
			});
		}

		const ctaKey = copy.cta.toLowerCase();
		ctaKey && ctas.set(ctaKey, (ctas.get(ctaKey) ?? 0) + 1);

		if (copy.highlighted_words && copy.highlighted_words.length > 4) {
			warnings.push({
				code: "highlights-overload",
				message: `Variant "${name ?? `#${index + 1}`}" has more than 4 highlighted words.`,
				severity: "info",
				variantIndex: index,
				variantName: name,
				field: "highlighted_words",
			});
		}
	});

	for (const [cta, count] of ctas.entries()) {
		if (count > 1) {
			warnings.push({
				code: "duplicate-cta",
				message: `CTA "${cta}" appears in multiple variants.`,
				severity: "warning",
				field: "cta",
			});
		}
	}

	return {
		normalized: true,
		summary: {
			variantCount: variants.length,
			totalPercentage,
			isBalanced: Math.abs(totalPercentage - 100) <= 0.001,
			isActive: Boolean(isActive),
		},
		warnings,
	};
};

const defineAbTest = (test: AbTestInput): ABTest => {
	const normalizedVariants: AbTestVariant[] = test.variants.map((variant) => {
		if (!variant.copy) {
			return {
				...variant,
				copy: undefined,
			};
		}

		return {
			...variant,
			copy: sanitizeCopy(variant.copy),
		};
	});

	const testName =
		typeof test.name === "string" && test.name.length > 0
			? test.name
			: String(test.id ?? "ab-test");

	const analysis = analyzeVariants(
		normalizedVariants,
		testName,
		typeof test.isActive === "boolean" ? test.isActive : undefined,
	);

	return {
		...test,
		variants: normalizedVariants,
		analysis,
	} as ABTest;
};

const defineAbTests = (tests: AbTestInput[]): ABTest[] =>
	tests.map((item) => defineAbTest(item));

export const abTestExample = defineAbTest({
	id: "abtest-001",
	name: "Product Sales Copy Test",
	description:
		"A/B test for optimizing product sales copy messaging for modern creators.",
	variants: [
		{
			name: "Variant A",
			percentage: 50,
			copy: {
				cta: "Shop Now & Save!",
				buttonCta: "Shop Now",
				tagline: "Engineered for Everyday Excellence",
				subtitle: "A new standard in comfort and durability.",
				description:
					"Our premium tees are designed for creators, makers, and innovators who demand more from their basics.",
				whatsInItForMe:
					"Feel confident and comfortable updatedx, whether you're at work or play.",
				target_audience: "Modern Creators",
				pain_point: "Uncomfotbale Shirts",
				fear: "Every time you settle for a basic tee you end up sweaty and distracted on camera, so your brand takes the hit.",
				solution: "Comfortable Shirts",
				highlights: [
					"Ultra-soft 100% cotton",
					"Hand cut and sewn locally",
					"Pre-washed & pre-shrunk",
					"Dyed with our proprietary colors",
				],
				highlighted_words: ["comfortable", "durability"],
				additionalInfo:
					"Limited-time offer: Free shipping on your first order!",
			},
			variant_description: "Current best-performing copy.",
			kpis: [
				{ name: "CTR", value: 4.2, goal: 5, unit: "%" },
				{ name: "Conversion Rate", value: 2.1, goal: 3, unit: "%" },
			],
		},
		{
			name: "Variant B",
			percentage: 50,
			copy: {
				pain_point: "Uncomfotbale Shirts",
				solution: "Comfortable Shirts",
				cta: "Unlock Your Potential Today!",
				tagline: "Performance Meets Comfort",
				subtitle: "Next-level basics for next-level people.",
				description:
					"Experience the difference with our advanced fabric blend and ergonomic fit.",
				whatsInItForMe: "Upgrade your daily comfort and style.",
				target_audience: "Ambitious Professionals",
				fear: "Showing up to a pitch in a sagging tee signals you aren’t ready to operate at a higher level.",
				highlights: [
					"Moisture-wicking tech",
					"Sustainable materials",
					"Reinforced seams",
					"Modern tailored fit",
				],
				additionalInfo: "Try risk-free for 30 days!",
			},
			variant_description:
				"Challenger copy focusing on performance and sustainability.",
			kpis: [
				{ name: "CTR", value: 3.8, goal: 5, unit: "%" },
				{ name: "Conversion Rate", value: 1.9, goal: 3, unit: "%" },
			],
		},
	],
	startDate: new Date("2025-05-01T00:00:00Z"),
	endDate: undefined,
	isActive: true,
	facebookPixelUsers: [],
	targetAudience: "Modern Creators, Ambitious Professionals",
	kpis: [
		{ name: "Overall CTR", value: 4.0, goal: 5, unit: "%" },
		{ name: "Overall Conversion Rate", value: 2.0, goal: 3, unit: "%" },
	],
	tags: ["sales", "copy", "abtest"],
});
export const AIConversationCreditsABTest = defineAbTest({
	id: "abtest-002",
	name: "AI Conversation Credits",
	description:
		"A/B test for outcome-driven messaging highlighting AI automation and credit-based sales enablement.",
	variants: [
		{
			name: "Outcome-Focused Copy",
			percentage: 50,
			copy: {
				cta: "Power Up Your AI & Automate Your Deal Flow",
				buttonCta: "Get AI Credits Now",
				tagline:
					"Your AI Agent is Ready to Close Deals. Don't Let It Run Out of Fuel.",
				subtitle:
					"Instantly add AI Conversation Credits to keep your automated lookalike audience expansion (inspired by How to Win Friends and Influence People), nurturing, and outreach running 24/7.",
				description:
					"Keep your real estate pipeline on full autopilot. AI Conversation Credits power your AI Virtual Agents to make calls, send texts, and nurture leads from first touch to close. Each credit fuels a critical interaction, ensuring no lead goes cold and your deal flow never stops. Top up anytime and choose a bundle with bulk discounts to maximize your ROI.",
				whatsInItForMe:
					"This is how you scale effortlessly: Your AI Virtual Agent works around the clock, engaging leads, sending follow-ups, and scheduling calls so you don't have to. More credits mean more automated outreach, a shorter sales cycle, and more closed deals in your pipeline—all without adding headcount.",
				target_audience:
					"Growth-focused real estate investors, wholesalers, and flippers who want to use AI automation to scale their business, surface lookalike off-market deals powered by similarity intelligence, and eliminate tedious manual outreach.",
				pain_point:
					"Your deal pipeline stalls when manual follow-up becomes overwhelming. You're losing deals because you can't engage every lead instantly and consistently. Scaling your outreach means hiring more staff, which increases overhead and complexity.",
				fear: "Every unanswered lead gets rerouted to a competitor with an AI dialer—your pipeline goes cold while overhead keeps climbing.",
				solution:
					"AI Conversation Credits fuel your automated sales force. They enable your AI Virtual Agent to handle thousands of interactions—calls, texts, and emails—autonomously. This ensures every lead is nurtured instantly, keeping your pipeline full and allowing you to scale outreach infinitely without adding to your payroll.",
				highlights: [
					"Keep Your Pipeline on Autopilot: Never miss a follow-up or a new lead opportunity.",
					"Scale Without Scaling Headcount: Automate thousands of outreach tasks instantly.",
					"Close Deals Faster: Engage and qualify leads 24/7 to shorten your sales cycle.",
				],
				highlighted_words: ["Automate", "Instantly", "Scale"],
			},
			variant_description:
				"Emphasizes outcome-driven automation and the value of AI Conversation Credits.",
			kpis: [
				{ name: "CTR", value: 0, goal: 5, unit: "%" },
				{ name: "Conversion Rate", value: 0, goal: 3, unit: "%" },
			],
		},
	],
	startDate: new Date("2025-06-01T00:00:00Z"),
	endDate: undefined,
	isActive: true,
	facebookPixelUsers: [],
	targetAudience:
		"Growth-focused real estate investors, wholesalers, and flippers",
	kpis: [
		{ name: "Overall CTR", value: 0, goal: 5, unit: "%" },
		{ name: "Overall Conversion Rate", value: 0, goal: 3, unit: "%" },
	],
	tags: ["sales", "copy", "abtest", "automation", "ai-credits"],
});

export const skipTraceCreditsABTests = defineAbTests([
	{
		id: "ab-test-skip-trace-credits-v1",
		name: "A/B Test for Skip Trace Credits",
		description:
			"Testing two copy variants (Speed vs. Connection) for the Skip Trace Credits product page to optimize for 'Add to Cart' clicks.",
		variants: [
			{
				name: "V1 - Speed Focus",
				percentage: 50,
				copy: {
					cta: "Get Owner Contact Info Now",
					buttonCta: "Get Skip Trace Credits",
					tagline: "Turn an Address Into a Deal.",
					subtitle:
						"Instantly find verified phone numbers and emails for property owners. Stop searching, start connecting.",
					description:
						"Your list of properties is worthless without contact info. Use Skip Trace Credits to instantly uncover accurate phone numbers and emails, transforming your dead list into an actionable outreach campaign. Connect with motivated sellers before your competition does.",
					whatsInItForMe:
						"Get the direct phone numbers and emails you need to contact property owners. This lets you bypass gatekeepers, start real conversations, and be the first to make an offer on valuable lookalike off-market properties curated by behavioral twins.",
					target_audience:
						"Real estate wholesalers and flippers with lists of potential properties who need accurate contact information to initiate outreach.",
					pain_point:
						"Having a list of promising properties but no way to contact the owners, leading to missed opportunities and wasted time on manual searches.",
					solution:
						"Our credits provide instant access to verified phone numbers and email addresses for property owners, turning your list of addresses into a high-value, actionable outreach list in seconds.",
					hope: "Imagine pulling a fresh list and having verified phone numbers in minutes so you can be the first to make an offer on every promising property.",
					fear: "Competitors are already dialing the owners you just discovered, leaving your leads to go cold while you hunt for contact info.",
					highlights: [
						"Instantly Find Owner Phone Numbers",
						"Uncover Verified Email Addresses",
						"Accelerate Your Direct Outreach",
					],
					highlighted_words: ["Instantly", "Accurate", "Direct"],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Product Page", "Credits", "Copywriting", "Skip Trace"],
	},
]);

export const targetedLeadCreditsABTests = defineAbTests([
	{
		id: "ab-test-targeted-leads-v1",
		name: "A/B Test for Targeted Lead Credits",
		description:
			"Testing two copy variants (Quality vs. Pipeline) for the Targeted Lead Credits product page to optimize for 'Add to Cart' clicks.",
		variants: [
			{
				name: "V1 - Quality Focus",
				percentage: 50,
				copy: {
					cta: "Build Your Ideal Lead List",
					buttonCta: "Get High-Quality Leads",
					tagline: "Stop Chasing Bad Leads. Start Closing Good Ones.",
					subtitle:
						"Generate laser-targeted lists of property leads that perfectly match your specific investment criteria.",
					description:
						"Tired of wasting money on low-quality, untargeted leads? Use Targeted Lead Credits to access our 140M+ property database and build a custom list based on your exact strategy. Filter by location, equity, and owner details to fill your pipeline with pre-qualified opportunities.",
					whatsInItForMe:
						"You get a pre-qualified list that perfectly matches your investment strategy. This means less time wasted on unqualified prospects and more time spent talking to motivated sellers and closing profitable deals.",
					target_audience:
						"Real estate investors who need a reliable source of high-quality leads that fit a specific niche or investment model.",
					pain_point:
						"Current lead sources are expensive, unreliable, and deliver untargeted lists, forcing you to waste time and money sifting through junk.",
					solution:
						"Our platform allows you to apply dozens of filters to our massive property database, ensuring you only pay for hyper-targeted leads that fit your exact criteria, maximizing your marketing ROI.",
					highlights: [
						"Build Hyper-Targeted Lists",
						"Access 140M+ Properties",
						"Pay Only For Qualified Leads",
					],
					highlighted_words: ["Targeted", "Quality", "Qualified"],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: [
			"Product Page",
			"Credits",
			"Copywriting",
			"Lookalike Audience Expansion Inspired By How To Win Friends And Influence People",
		],
	},
]);

export const documentTemplatePackABTests = defineAbTests([
	{
		id: "ab-test-doc-pack-v1",
		name: "Document Template Pack Copy Test",
		description:
			"Testing copy variants (Speed vs. Security) for the Document Template Pack to optimize for downloads.",
		variants: [
			{
				name: "V1 - Speed & Efficiency",
				percentage: 50,
				copy: {
					cta: "Get Your Templates Now",
					buttonCta: "Instant Download",
					tagline: "Stop Drafting. Start Closing.",
					subtitle:
						"Get instant access to all the real estate contracts and letters you need to close deals faster.",
					whatsInItForMe:
						"This saves you hours of frustrating guesswork and expensive legal fees. Use professional-grade documents immediately.",
					target_audience:
						"Investors and agents who need to create legally-sound documents without delays.",
					pain_point:
						"Creating contracts from scratch is slow, risky, and a major bottleneck to closing a deal.",
					fear: "Every day you wait for a lawyer-drafted contract is a day a motivated seller signs with someone else.",
					hope: "You can pull the exact document you need in seconds and stay in control of every negotiation.",
					solution:
						"Our template pack provides instant access to a complete set of customizable documents, letting you secure deals in minutes, not days.",
					highlights: [
						"Close deals faster",
						"Save on legal fees",
						"Fully customizable templates",
					],
				},
			},
			{
				name: "V2 - Professional & Secure",
				percentage: 50,
				copy: {
					cta: "Secure Your Deals Today",
					buttonCta: "Get Protected",
					tagline: "Close Deals with Confidence.",
					subtitle:
						"Use our complete set of real estate contracts to look professional and protect your interests in every transaction.",
					whatsInItForMe:
						"This ensures you look credible and are legally protected, giving you peace of mind in every deal you make.",
					target_audience:
						"Investors who want to ensure they are legally protected and look professional to sellers and partners.",
					pain_point:
						"Using unprofessional or incomplete documents undermines your credibility and exposes you to unnecessary legal risks.",
					fear: "One missing clause can tank a deal or spark a lawsuit that erases your profit.",
					hope: "You walk into every signing with airtight paperwork that earns instant trust.",
					solution:
						"Our comprehensive template pack ensures you have the right, professional document for every situation, safeguarding your business.",
					highlights: [
						"Protect your business",
						"Look credible & professional",
						"Includes all essential contracts",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Essentials", "Digital Product", "Copywriting", "Contracts"],
	},
]);

export const investorPlaybookABTests = defineAbTests([
	{
		id: "ab-test-investor-book-v1",
		name: "Investor's Playbook Copy Test",
		description:
			"Testing copy variants (Actionable Strategy vs. Expert Knowledge) for the Investor's Playbook to optimize sales.",
		variants: [
			{
				name: "V1 - Actionable Strategy",
				percentage: 50,
				copy: {
					cta: "Get the Playbook",
					buttonCta: "Get My Copy",
					tagline: "Your Roadmap to More Deals.",
					subtitle:
						"Actionable strategies, checklists, and scripts to guide your next investment from start to finish.",
					whatsInItForMe:
						"This isn't just theory. It's a hands-on guide with checklists and scripts you can use today to find and close deals.",
					target_audience:
						"Investors looking for a practical, step-by-step guide to execute their deals.",
					pain_point:
						"It's easy to get stuck or make a costly mistake without a clear, repeatable process to follow.",
					solution:
						"This playbook provides a proven framework with actionable steps, helping you navigate every stage of a deal with confidence.",
					highlights: [
						"Step-by-step checklists",
						"Ready-to-use scripts",
						"Avoid costly mistakes",
					],
				},
			},
			{
				name: "V2 - Expert Knowledge",
				percentage: 50,
				copy: {
					cta: "Gain a Professional Edge",
					buttonCta: "Order Now",
					tagline: "Invest Like an Expert.",
					subtitle:
						"The essential hardcover guide to mastering the strategies that successful real estate investors use every day.",
					whatsInItForMe:
						"You get the condensed knowledge of expert investors in one place, giving you an unfair advantage in the market.",
					target_audience:
						"Investors who want to deepen their knowledge and adopt proven strategies from top performers.",
					pain_point:
						"Learning through trial and error in real estate is incredibly expensive and slow.",
					solution:
						"This book fast-tracks your learning curve by providing proven strategies and insights, saving you from common pitfalls.",
					highlights: [
						"Master proven strategies",
						"Gain a competitive edge",
						"Shorten your learning curve",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Essentials", "Physical Product", "Education", "Copywriting"],
	},
]);

export const escrowServiceKitABTests = defineAbTests([
	{
		id: "ab-test-escrow-kit-v1",
		name: "Escrow Service Kit Copy Test",
		description:
			"Testing copy variants (Control vs. Security) for the Escrow Service Kit to optimize for downloads.",
		variants: [
			{
				name: "V1 - Control & Clarity",
				percentage: 50,
				copy: {
					cta: "Get the Kit",
					buttonCta: "Download Now",
					tagline: "Master Your Closings.",
					subtitle:
						"A complete digital kit with checklists and timelines to manage your escrow process with clarity and control.",
					whatsInItForMe:
						"This kit demystifies the escrow process, giving you a clear path to follow so you never miss a critical deadline or step.",
					target_audience:
						"Investors who manage their own closings and want a clear, repeatable process.",
					pain_point:
						"The escrow process is complex and confusing, and one missed step can delay or even kill a deal.",
					solution:
						"Our kit provides a step-by-step checklist and timeline, ensuring you stay organized and in control of the entire transaction.",
					highlights: [
						"Step-by-step checklists",
						"Never miss a deadline",
						"Manage closings with ease",
					],
				},
			},
			{
				name: "V2 - Security & Peace of Mind",
				percentage: 50,
				copy: {
					cta: "Secure Your Transactions",
					buttonCta: "Get the Kit",
					tagline: "Close Every Deal Securely.",
					subtitle:
						"Use our escrow toolkit to ensure every transaction is managed securely and efficiently, protecting your investment.",
					whatsInItForMe:
						"You get peace of mind knowing your transaction is being managed with professional-grade processes.",
					target_audience:
						"Investors who prioritize the security and integrity of their real estate transactions.",
					pain_point:
						"A poorly managed escrow process creates risk and anxiety, jeopardizing your hard-earned investment.",
					solution:
						"This kit provides best practices and clear guidelines to ensure your transaction is handled securely and professionally from start to finish.",
					highlights: [
						"Protect your investment",
						"Ensure smooth closings",
						"Best-practice guidelines",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Essentials", "Digital Product", "Copywriting", "Closing"],
	},
]);

export const brandedDeskMatABTests = defineAbTests([
	{
		id: "ab-test-desk-mat-v1",
		name: "Branded Desk Mat Copy Test",
		description:
			"Testing copy variants (Workspace Upgrade vs. Professional Identity) for the Branded Desk Mat to optimize sales.",
		variants: [
			{
				name: "V1 - Workspace Upgrade",
				percentage: 50,
				copy: {
					cta: "Upgrade Your Desk",
					buttonCta: "Add to Cart",
					tagline: "Your Professional Workspace.",
					subtitle:
						"A premium, non-slip desk mat to protect your workspace and keep you organized.",
					whatsInItForMe:
						"It creates a defined, protected space for your work essentials, reducing clutter and protecting your desk surface.",
					target_audience:
						"Professionals who want a cleaner, more organized, and protected desk.",
					pain_point:
						"A cluttered, scratched desk looks unprofessional and feels chaotic.",
					solution:
						"This large desk mat instantly organizes your workspace and protects it from spills and scratches.",
					highlights: [
						"Protects from scratches",
						"Non-slip surface",
						"Defines your workspace",
					],
				},
			},
			{
				name: "V2 - Professional Identity",
				percentage: 50,
				copy: {
					cta: "Brand Your Office",
					buttonCta: "Get Mine Now",
					tagline: "Look the Part.",
					subtitle:
						"Add a touch of professional Deal Scale branding to your home or office desk.",
					whatsInItForMe:
						"It instantly elevates the look of your office, signaling that you're a serious professional.",
					target_audience:
						"Deal Scale users who want to create a branded, professional office environment.",
					pain_point:
						"Your home office setup doesn't look or feel like a serious place of business.",
					solution:
						"Our branded desk mat provides a simple, stylish way to make your workspace look and feel more professional.",
					highlights: [
						"Elevate your office look",
						"Professional branding",
						"Premium feel",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Essentials", "Physical Product", "Merch", "Copywriting"],
	},
]);

export const ergonomicChairABTests = defineAbTests([
	{
		id: "ab-test-chair-v1",
		name: "Ergonomic Chair Copy Test",
		description:
			"Testing copy variants (Comfort/Productivity vs. Health/Investment) for the Ergonomic Chair to optimize sales.",
		variants: [
			{
				name: "V1 - Comfort & Productivity",
				percentage: 50,
				copy: {
					cta: "Upgrade Your Comfort",
					buttonCta: "Get My Chair",
					tagline: "Work Longer, Feel Better.",
					subtitle:
						"A comfortable, adjustable ergonomic chair designed for hours of productive work without discomfort.",
					whatsInItForMe:
						"This chair's ergonomic support allows you to stay focused on your work for longer periods without the distraction of back pain.",
					target_audience:
						"Professionals who spend long hours at a desk and experience discomfort or fatigue.",
					pain_point:
						"Back pain and discomfort from a bad chair kill your focus and limit how long you can work effectively.",
					solution:
						"Our ergonomic chair provides adjustable support for your body, eliminating pain and enabling longer, more productive work sessions.",
					highlights: [
						"Eliminate back pain",
						"Increase your focus",
						"Work comfortably for hours",
					],
				},
			},
			{
				name: "V2 - Health & Investment",
				percentage: 50,
				copy: {
					cta: "Invest in Your Well-being",
					buttonCta: "Order Now",
					tagline: "Your Foundation for Success.",
					subtitle:
						"Invest in a high-quality ergonomic chair designed for long-term health and productivity.",
					whatsInItForMe:
						"This is an investment in your physical health and ability to perform at your best, day after day.",
					target_audience:
						"Health-conscious professionals who see quality equipment as an investment in their performance.",
					pain_point:
						"A cheap office chair is a short-term fix that leads to long-term health problems and reduced productivity.",
					solution:
						"This chair is a long-term investment in your well-being, providing the physical support needed for a sustainable and successful career.",
					highlights: [
						"A smart investment in health",
						"Designed for career longevity",
						"Maintain peak performance",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Essentials", "Physical Product", "Office", "Copywriting"],
	},
]);

export const smartLampABTests = defineAbTests([
	{
		id: "ab-test-lamp-v1",
		name: "Smart LED Lamp Copy Test",
		description:
			"Testing copy variants (Performance/Focus vs. Modern Workspace) for the Smart LED Lamp to optimize sales.",
		variants: [
			{
				name: "V1 - Performance & Focus",
				percentage: 50,
				copy: {
					cta: "Improve Your Focus",
					buttonCta: "Get the Lamp",
					tagline: "See Clearly. Work Smarter.",
					subtitle:
						"A modern LED desk lamp with adjustable brightness to reduce eye strain during long work sessions.",
					whatsInItForMe:
						"You get perfect, flicker-free lighting that reduces eye fatigue, helping you stay focused and productive for longer.",
					target_audience:
						"People who work late nights or in low-light conditions and suffer from eye strain.",
					pain_point:
						"Poor desk lighting causes eye strain and headaches, cutting your productive hours short.",
					solution:
						"This smart lamp delivers fully adjustable, flicker-free light, creating the optimal environment to protect your eyes and maintain focus.",
					highlights: [
						"Reduce eye strain",
						"Improve late-night focus",
						"Fully adjustable light",
					],
				},
			},
			{
				name: "V2 - Modern Workspace",
				percentage: 50,
				copy: {
					cta: "Modernize Your Desk",
					buttonCta: "Add to Cart",
					tagline: "The Modern Investor's Lamp.",
					subtitle:
						"Upgrade your desk with a sleek, smart LED lamp featuring adjustable color and brightness.",
					whatsInItForMe:
						"It adds a modern, sophisticated touch to your workspace while providing superior, customizable lighting.",
					target_audience:
						"Professionals who want to create a modern, stylish, and functional home office.",
					pain_point:
						"Your old, clunky desk lamp is an eyesore and doesn't provide the right kind of light for different tasks.",
					solution:
						"This sleek, modern lamp not only looks great but offers total control over your lighting, perfecting your workspace ambiance.",
					highlights: [
						"Sleek, modern design",
						"Customizable ambiance",
						"Upgrade your desk's look",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Essentials", "Physical Product", "Office", "Copywriting"],
	},
]);

export const notionInvestorCrmABTests = defineAbTests([
	{
		id: "ab-test-notion-crm-v1",
		name: "Notion Investor CRM Copy Test",
		description:
			"Testing copy variants (Organization vs. Relationship Focus) for the Notion Investor CRM to optimize sales.",
		variants: [
			{
				name: "V1 - Organization & Control",
				percentage: 50,
				copy: {
					cta: "Organize Your Investors Now",
					buttonCta: "Get the CRM",
					tagline: "Ditch the Messy Spreadsheet.",
					subtitle:
						"A powerful Notion CRM to track investors, conversations, and deal status in one organized place.",
					whatsInItForMe:
						"This template ends the chaos of managing investor relations in spreadsheets, so you never miss a follow-up or lose a key contact.",
					target_audience:
						"Founders and startups actively managing investor relations or raising capital.",
					pain_point:
						"Tracking investor conversations across spreadsheets, emails, and notes is chaotic and leads to missed opportunities.",
					solution:
						"Our Notion CRM centralizes all investor data, conversations, and statuses into a single, easy-to-manage dashboard.",
					highlights: [
						"Track every conversation",
						"Never miss a follow-up",
						"Manage your pipeline visually",
					],
				},
			},
			{
				name: "V2 - Relationship & Capital",
				percentage: 50,
				copy: {
					cta: "Raise Capital More Effectively",
					buttonCta: "Get the Template",
					tagline: "Build Relationships, Raise Capital.",
					subtitle:
						"The essential Notion CRM for building stronger investor relationships and closing your next round faster.",
					whatsInItForMe:
						"By systematically managing your relationships, you build the trust and momentum needed to get to a 'yes' faster.",
					target_audience:
						"Startups focused on building strong, long-term relationships with their investors.",
					pain_point:
						"Failing to properly nurture investor relationships leads to cold leads and a stalled fundraising process.",
					solution:
						"This CRM is designed to help you manage and nurture investor relationships effectively, turning contacts into commitments.",
					highlights: [
						"Build stronger relationships",
						"Close your round faster",
						"Turn contacts into capital",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Notion", "CRM", "Fundraising", "Copywriting"],
	},
]);

export const notionDealPipelineABTests = defineAbTests([
	{
		id: "ab-test-notion-pipeline-v1",
		name: "Notion Deal Pipeline Copy Test",
		description:
			"Testing copy variants (Visual Tracking vs. Closing Faster) for the Notion Deal Pipeline to optimize sales.",
		variants: [
			{
				name: "V1 - Visual Tracking",
				percentage: 50,
				copy: {
					cta: "Visualize Your Pipeline",
					buttonCta: "Get the Board",
					tagline: "See Your Entire Deal Flow.",
					subtitle:
						"A clear, Kanban-style board in Notion to visually track every deal from lead to close.",
					whatsInItForMe:
						"Get a high-level view of your entire pipeline in seconds, so you instantly know where every deal stands.",
					target_audience:
						"Founders and sales teams who want a simple, visual way to manage their opportunities.",
					pain_point:
						"Deals are falling through the cracks because you can't easily see the status of your entire pipeline.",
					solution:
						"Our Kanban-style board gives you a crystal-clear, visual overview of your deal stages, ensuring nothing gets missed.",
					highlights: [
						"Visualize every deal",
						"Drag-and-drop simplicity",
						"Never lose a lead again",
					],
				},
			},
			{
				name: "V2 - Closing Faster",
				percentage: 50,
				copy: {
					cta: "Close Deals Faster",
					buttonCta: "Get the Pipeline",
					tagline: "Move Deals from Lead to Close.",
					subtitle:
						"The streamlined Notion pipeline board designed to help you increase sales velocity and close more deals.",
					whatsInItForMe:
						"This template helps you identify bottlenecks and focus your efforts, shortening your sales cycle and increasing revenue.",
					target_audience:
						"Sales-focused teams and founders who want to improve their sales process and increase revenue.",
					pain_point:
						"A disorganized sales process leads to a slow sales cycle and lost revenue.",
					solution:
						"This streamlined pipeline provides the structure needed to manage deals efficiently, reduce friction, and accelerate your sales cycle.",
					highlights: [
						"Shorten your sales cycle",
						"Identify and fix bottlenecks",
						"Increase sales velocity",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Notion", "Sales", "Pipeline", "Copywriting"],
	},
]);

export const notionStartupOsABTests = defineAbTests([
	{
		id: "ab-test-notion-startup-os-v1",
		name: "Notion Startup OS Copy Test",
		description:
			"Testing copy variants (All-in-One vs. Acceleration) for the Notion Startup OS to optimize sales.",
		variants: [
			{
				name: "V1 - All-in-One System",
				percentage: 50,
				copy: {
					cta: "Get Your All-in-One Workspace",
					buttonCta: "Get the OS",
					tagline: "Your Entire Startup in One Place.",
					subtitle:
						"The complete, all-in-one Notion workspace for startups. Manage product, marketing, hiring, and more.",
					whatsInItForMe:
						"Stop switching between a dozen apps. This OS centralizes your entire startup's operations, saving you time and money.",
					target_audience:
						"Early-stage startups looking for a single, central system to run their company.",
					pain_point:
						"Information is scattered across too many different tools, creating confusion and inefficiency.",
					solution:
						"Our Startup OS integrates all key business functions into a single, interconnected Notion workspace.",
					highlights: [
						"Manage everything in one place",
						"Stop paying for multiple tools",
						"Create a single source of truth",
					],
				},
			},
			{
				name: "V2 - Day One Acceleration",
				percentage: 50,
				copy: {
					cta: "Build Faster from Day One",
					buttonCta: "Install Now",
					tagline: "Get Organized. Move Faster.",
					subtitle:
						"The ultimate Notion workspace for startups, designed to get you organized and executing from day one.",
					whatsInItForMe:
						"This template gives you the structure you need to hit the ground running, so you can focus on building, not on setting up tools.",
					target_audience:
						"New founders who want to establish strong operational processes from the very beginning.",
					pain_point:
						"Setting up systems and processes from scratch is slow and distracts you from building your product.",
					solution:
						"This pre-built OS provides all the dashboards and templates you need to run efficiently from day one, giving you an instant operational boost.",
					highlights: [
						"Get organized instantly",
						"Focus on building your product",
						"Implement best practices",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Notion", "Startups", "Operations", "Copywriting"],
	},
]);

export const notionFundraisingTrackerABTests = defineAbTests([
	{
		id: "ab-test-notion-fundraising-tracker-v1",
		name: "Notion Fundraising Tracker Copy Test",
		description:
			"Testing copy variants (Organization vs. Closing Faster) for the Notion Fundraising Tracker to optimize sales.",
		variants: [
			{
				name: "V1 - Stay Organized",
				percentage: 50,
				copy: {
					cta: "Organize Your Fundraise",
					buttonCta: "Get Tracker",
					tagline: "Run a Stress-Free Fundraise.",
					subtitle:
						"Track investor outreach, commitments, and follow-ups in one clean Notion dashboard.",
					whatsInItForMe:
						"This template brings calm to the chaos of fundraising, ensuring you stay on top of every detail and run a professional process.",
					target_audience:
						"Founders who are currently or about to start fundraising.",
					pain_point:
						"Fundraising is a chaotic and stressful process where it's easy to drop the ball on critical follow-ups.",
					solution:
						"Our tracker provides a clear, simple system to manage every aspect of your raise, so nothing gets overlooked.",
					highlights: [
						"Track every conversation",
						"Manage your investor pipeline",
						"Run a professional process",
					],
				},
			},
			{
				name: "V2 - Close Faster",
				percentage: 50,
				copy: {
					cta: "Close Your Round Faster",
					buttonCta: "Get the Tracker",
					tagline: "From First Call to Term Sheet.",
					subtitle:
						"The Notion dashboard designed to help you manage momentum and close your fundraising round in record time.",
					whatsInItForMe:
						"A well-managed process creates momentum. This tracker helps you manage that momentum to get to a term sheet faster.",
					target_audience:
						"Goal-oriented founders who want to complete their fundraising round as efficiently as possible.",
					pain_point:
						"A disorganized fundraising process loses momentum, dragging out the timeline and risking the entire round.",
					solution:
						"This tracker gives you the tool to run a tight, efficient process that builds momentum and accelerates your path to closing.",
					highlights: [
						"Build and maintain momentum",
						"Accelerate your timeline",
						"Impress investors",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Notion", "Fundraising", "Startups", "Copywriting"],
	},
]);

export const notionTeamWikiABTests = defineAbTests([
	{
		id: "ab-test-notion-team-wiki-v1",
		name: "Notion Team Wiki Copy Test",
		description:
			"Testing copy variants (Centralized Knowledge vs. Faster Scaling) for the Notion Team Wiki to optimize sales.",
		variants: [
			{
				name: "V1 - Centralized Knowledge",
				percentage: 50,
				copy: {
					cta: "Create Your Single Source of Truth",
					buttonCta: "Get the Wiki",
					tagline: "Your Team's Central Brain.",
					subtitle:
						"A central wiki to document your team's processes, policies, and knowledge in one organized Notion workspace.",
					whatsInItForMe:
						"Stop answering the same questions over and over. This wiki becomes your team's single source of truth, saving everyone time.",
					target_audience:
						"Teams looking to eliminate repetitive questions and centralize company knowledge.",
					pain_point:
						"Key information is scattered, and team members constantly interrupt each other with repetitive questions.",
					solution:
						"Our template provides a structured home for all your team's knowledge, making information easy to find and share.",
					highlights: [
						"Stop repeating yourself",
						"Centralize company knowledge",
						"Easy to search and update",
					],
				},
			},
			{
				name: "V2 - Faster Scaling",
				percentage: 50,
				copy: {
					cta: "Onboard & Scale Your Team Faster",
					buttonCta: "Get the Handbook",
					tagline: "The Foundation for Growth.",
					subtitle:
						"The essential team wiki and handbook for onboarding new hires and scaling your company culture.",
					whatsInItForMe:
						"A good wiki makes onboarding new hires seamless, allowing you to grow your team without the chaos.",
					target_audience:
						"Growing startups that need to streamline their onboarding process and document their culture.",
					pain_point:
						"Onboarding new team members is a slow, manual, and inconsistent process that hinders your ability to scale.",
					solution:
						"This handbook template provides a scalable system for onboarding, ensuring every new hire gets up to speed quickly and consistently.",
					highlights: [
						"Onboard new hires in half the time",
						"Document your processes to scale",
						"Build a consistent culture",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Notion", "Team", "Onboarding", "Copywriting"],
	},
]);

export const buyerLeadNurtureWorkflowABTests = defineAbTests([
	{
		id: "ab-test-buyer-lead-nurture-workflow-v1",
		name: "Buyer Lead Nurture Workflow Copy Test",
		description:
			"Testing copy variants (Conversion Rate vs. Client Experience) for the Buyer Lead Nurture Workflow to optimize sales.",
		variants: [
			{
				name: "V1 - Maximize Conversions",
				percentage: 50,
				copy: {
					cta: "Convert More Buyer Leads",
					buttonCta: "Get the Workflow",
					tagline: "Turn More Leads into Commissions.",
					subtitle:
						"The automated workflow designed to nurture your buyer leads and maximize your conversion rates.",
					whatsInItForMe:
						"This system ensures no lead is forgotten, increasing your appointment-set rate and directly boosting your commission income.",
					target_audience:
						"Real estate agents and teams focused on maximizing revenue from their lead spend.",
					pain_point:
						"You're paying for buyer leads, but a low conversion rate is killing your ROI because you can't follow up with all of them effectively.",
					solution:
						"This workflow automates the follow-up and nurturing process, systematically turning your expensive leads into closed deals.",
					highlights: [
						"Maximize lead ROI",
						"Increase appointment-set rate",
						"Automate drip campaigns",
					],
				},
			},
			{
				name: "V2 - Perfect Client Experience",
				percentage: 50,
				copy: {
					cta: "Deliver a 5-Star Experience",
					buttonCta: "Install Workflow",
					tagline: "Never Drop the Ball on a Lead.",
					subtitle:
						"Give every buyer lead a professional, 5-star experience with automated follow-ups and appointment scheduling.",
					whatsInItForMe:
						"This workflow ensures every lead receives prompt, professional communication, building trust and setting you apart from the competition.",
					target_audience:
						"Agents and teams who want to build a reputation for excellent customer service.",
					pain_point:
						"Being too busy means leads get ignored, making you look unprofessional and damaging your reputation.",
					solution:
						"Automate your follow-up process to guarantee every single lead receives timely, helpful communication, creating happy clients from day one.",
					highlights: [
						"Build trust with buyers",
						"Professional communication, automated",
						"Schedule appointments effortlessly",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Workflows", "Automation", "Buyer Leads", "Copywriting"],
	},
]);

export const motivatedSellerWorkflowABTests = defineAbTests([
	{
		id: "ab-test-motivated-seller-workflow-v1",
		name: "Motivated Seller Automation Workflow Copy Test",
		description:
			"Testing copy variants (Time Savings vs. Deal Closing) for the Motivated Seller Workflow to optimize sales.",
		variants: [
			{
				name: "V1 - Autopilot & Efficiency",
				percentage: 50,
				copy: {
					cta: "Put Your Outreach on Autopilot",
					buttonCta: "Get the Workflow",
					tagline: "Find Motivated Sellers in Your Sleep.",
					subtitle:
						"The all-in-one workflow to automate your outreach, follow-up, and lead nurturing for motivated sellers.",
					whatsInItForMe:
						"This workflow runs your outreach campaigns 24/7, freeing you from tedious manual follow-ups so you can focus on closing deals.",
					target_audience:
						"Real estate investors and wholesalers who want to save time and scale their lookalike audience expansion strategy inspired by How to Win Friends and Influence People.",
					pain_point:
						"Manually following up with hundreds of potential sellers is a full-time job that burns you out and limits your deal flow.",
					solution:
						"Our pre-built workflow automates the entire outreach and nurturing process, so you can scale your campaigns without scaling your workload.",
					highlights: [
						"Automate multi-channel outreach",
						"Nurture leads 24/7",
						"Save 10+ hours per week",
					],
				},
			},
			{
				name: "V2 - More Deals & Revenue",
				percentage: 50,
				copy: {
					cta: "Close More Off-Market Deals",
					buttonCta: "Install Workflow",
					tagline: "Never Let a Hot Lead Go Cold.",
					subtitle:
						"The ultimate workflow to convert more motivated seller leads into profitable, lookalike off-market deals identified by our prediction features.",
					whatsInItForMe:
						"By instantly and persistently following up with every lead, this workflow ensures you engage hot prospects at the perfect moment, maximizing your conversions.",
					target_audience:
						"Deal-focused investors who want to maximize the ROI from their lead lists.",
					pain_point:
						"Hot leads are lost every day due to slow response times and inconsistent follow-up, costing you profitable deals.",
					solution:
						"This workflow automates instant and persistent follow-up, ensuring every valuable lead is nurtured until they are ready to talk.",
					highlights: [
						"Increase lead conversion rates",
						"Engage leads instantly",
						"Maximize your deal pipeline",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Workflows", "Automation", "Motivated Seller", "Copywriting"],
	},
]);

export const openHouseWorkflowABTests = defineAbTests([
	{
		id: "ab-test-open-house-workflow-v1",
		name: "Open House Follow-Up Workflow Copy Test",
		description:
			"Testing copy variants (Efficiency vs. Opportunity) for the Open House Follow-Up Workflow to optimize sales.",
		variants: [
			{
				name: "V1 - Time-Saving Efficiency",
				percentage: 50,
				copy: {
					cta: "Automate Your Follow-Up",
					buttonCta: "Get the Workflow",
					tagline: "Save Hours After Every Open House.",
					subtitle:
						"Instantly follow up with every open house attendee without lifting a finger. Automate thank-yous, messages, and call reminders.",
					whatsInItForMe:
						"Stop spending your Sunday evening manually emailing attendees. This workflow does it all for you, saving you hours of tedious work.",
					target_audience:
						"Busy real estate agents who run frequent open houses.",
					pain_point:
						"Manually following up with dozens of open house attendees is a time-consuming chore that you dread every weekend.",
					solution:
						"This one-click workflow instantly handles all your post-event follow-up, giving you back your time.",
					highlights: [
						"Save hours of manual work",
						"Follow up with 100% of attendees",
						"Automated thank-you messages",
					],
				},
			},
			{
				name: "V2 - Capture Every Opportunity",
				percentage: 50,
				copy: {
					cta: "Turn Attendees into Clients",
					buttonCta: "Install Workflow",
					tagline: "Don't Let Hot Leads Walk Away.",
					subtitle:
						"The workflow that automatically engages every open house visitor, identifies hot prospects, and helps you set more appointments.",
					whatsInItForMe:
						"This system ensures the hottest leads from your open house get immediate attention, dramatically increasing your chances of converting an attendee into a client.",
					target_audience:
						"Agents who want to maximize the business generated from their open house events.",
					pain_point:
						"You're meeting potential clients at open houses, but they're getting lost in the shuffle and you're missing out on real business.",
					solution:
						"This workflow automatically engages everyone and helps surface the most interested prospects, ensuring no opportunity is missed.",
					highlights: [
						"Convert attendees to clients",
						"Identify the hottest prospects",
						"Schedule more appointments",
					],
				},
			},
		],
		startDate: new Date("2023-11-01T09:00:00.000Z"),
		isActive: true,
		tags: ["Workflows", "Automation", "Open House", "Copywriting"],
	},
]);
