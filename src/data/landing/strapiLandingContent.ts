export interface CtaConfig {
	label: string;
	href?: string;
	action?: "navigate" | "openModal";
}

export interface HighlightWordConfig {
	word: string;
	gradient: string;
}

export interface HeroContentConfig {
	headline: string;
	subheadline: string;
	badge: string;
	highlight: string;
	highlightWords: HighlightWordConfig[];
	primaryCta: CtaConfig;
	secondaryCta: CtaConfig;
	modalVariantLabels: {
		complete: string;
		transfer: string;
	};
	fallbacks: {
		highlight: string;
		ctaLabel: string;
		ctaLabelSecondary: string;
		highlightWords: HighlightWordConfig[];
	};
}

export interface LandingGapContentConfig {
	hero: HeroContentConfig;
	trustedBy: {
		heading: string;
	};
	services: {
		fallbackTitle: string;
		fallbackSubtitle: string;
		defaultTabs: string[];
		landingTitle: string;
		landingSubtitle: string;
	};
	upcomingFeatures: {
		title: string;
		subtitle: string;
	};
	caseStudiesPreview: {
		fallbackTitle: string;
		fallbackSubtitle: string;
	};
	testimonials: {
		landingTitle: string;
		landingSubtitle: string;
	};
	faqCta: {
		body: string;
		buttonLabel: string;
		buttonUrl: string;
	};
	pricing: {
		landingTitle: string;
		landingSubtitle: string;
	};
	about: {
		missionLabel: string;
		headline: string;
		body: string;
		imageUrl: string;
		ctaLabel: string;
		ctaUrl: string;
	};
	bento: {
		fallbackTitle: string;
		fallbackSubtitle: string;
	};
	blogPreview: {
		fallbackTitle: string;
		landingTitle: string;
	};
	contactForm: {
		title: string;
		subtitle: string;
	};
}

export const landingContentGaps: LandingGapContentConfig = {
	hero: {
		headline: "Tired of Chasing ",
		subheadline:
			"Stop cold calling all day and start taking appointments from sales-ready home sellers! Deal Scale’s AI suite does the grunt work, so you can focus on what you do best: closing deals.",
		badge: "AI Powered Seller Lead Qualification & Appointment Setting",
		highlight: "Dead-End Leads?",
		highlightWords: [
			{
				word: "AI suite does the grunt work",
				gradient:
					"from-violet-600 to-blue-500 dark:from-primary dark:to-accent",
			},
			{
				word: "closing deals",
				gradient:
					"from-emerald-600 to-cyan-500 dark:from-secondary dark:to-accent",
			},
		],
		primaryCta: {
			label: "Request Founders Circle Access",
			href: "/contact",
			action: "navigate",
		},
		secondaryCta: {
			label: "Get Free Ai Call Credits",
			action: "openModal",
		},
		modalVariantLabels: {
			complete: "Call Complete",
			transfer: "Transfer",
		},
		fallbacks: {
			highlight: "Appointments Delivered",
			ctaLabel: "Get Started",
			ctaLabelSecondary: "Get Started",
			highlightWords: [
				{ word: "real-time", gradient: "from-primary to-focus" },
				{ word: "insights", gradient: "from-blue-500 to-cyan-400" },
				{ word: "analytics", gradient: "from-purple-500 to-pink-500" },
				{ word: "monitor", gradient: "from-emerald-500 to-teal-400" },
			],
		},
	},
	trustedBy: {
		heading: "Founders Circle",
	},
	services: {
		fallbackTitle: "Tailored Solutions for Visionary Companies",
		fallbackSubtitle:
			"Whether launching lean or scaling enterprise-wide, we craft user-centric digital experiences that drive growth and innovation.",
		defaultTabs: [
			"lead_generation",
			"lead_prequalification",
			"skip_tracing",
			"ai_features",
			"real_estate_tools",
		],
		landingTitle: "Our Comprehensive Services",
		landingSubtitle: "Tailored solutions to meet your business needs",
	},
	upcomingFeatures: {
		title: "Vote On Upcoming Features",
		subtitle:
			"Help us prioritize what to build next by voting on your favorite ideas",
	},
	caseStudiesPreview: {
		fallbackTitle: "Case Studies",
		fallbackSubtitle:
			"See real success stories and ways to leverage Deal Scale to grow your business.",
	},
	testimonials: {
		landingTitle: "What Our Clients Say",
		landingSubtitle:
			"Hear from our clients about their experiences with our services",
	},
	faqCta: {
		body: 'Join the Founders Circle and shape Deal Scale.\nGet <span class="font-semibold text-primary">5 AI credits</span>, priority onboarding, and first dibs when we launch.',
		buttonLabel: "Request Founders Circle Access",
		buttonUrl: "/contact",
	},
	pricing: {
		landingTitle: "Our Pricing",
		landingSubtitle: "Lock In Pilot Pricing For 5 Years!",
	},
	about: {
		missionLabel: "Our Mission",
		headline: "About Deal Scale",
		body: "We believe your time is better spent closing deals, not chasing them. Deal Scale was founded to automate the relentless, 24/7 work of prospecting and lead nurturing, giving you back your time and filling your calendar with a consistent pipeline of sales-ready appointments.",
		imageUrl: "https://i.imgur.com/WbQnbas.png",
		ctaLabel: "Learn More",
		ctaUrl: "/about",
	},
	bento: {
		fallbackTitle: "Why Real Estate Leaders Choose Deal Scale",
		fallbackSubtitle:
			"We deliver a scalable and automated solution to keep your deal pipeline consistently full.",
	},
	blogPreview: {
		fallbackTitle: "Latest Insights",
		landingTitle: "Latest Blogs",
	},
	contactForm: {
		title: "Founders Circle Application",
		subtitle:
			"Request early access to make AI calling and texting in exchange for feedback for the platform, priority onboarding, and a direct vote on upcoming features.",
	},
};
