export interface ConsultationStep {
	number: number;
	title: string;
	description: string;
}

export const betaSignupSteps: ConsultationStep[] = [
	{
		number: 1,
		title: "Request Founders Circle Access",
		description:
			"Start your Founders Circle application. We only approve a limited number of operators so every member receives tailored support and direct influence over the roadmap.",
	},
	{
		number: 2,
		title: "Unlock Founders Circle Perks",
		description:
			"Complete a short profile about your business goals. Unlock your Founders Circle perks—5 AI credits, exclusive newsletter access, locked pricing, and bonus credits upon approval.",
	},
	{
		number: 3,
		title: "Gain Early Access",
		description:
			"As a Founders Circle member, your feedback directly shapes our roadmap. Vote on upcoming features and secure priority access to every release before public launch.",
	},
	{
		number: 4,
		title: "You're In!",
		description:
			"Welcome aboard! Watch for your onboarding email with your 5 AI credits, Founders Circle community access, and everything you need to automate your deal flow.",
	},
];
export const affiliateProgramSteps: ConsultationStep[] = [
	{
		number: 1,
		title: "Unique Affiliate Code",
		description:
			"Once approved, you'll receive a personalized affiliate code tied to a special discount percentage or amount you can offer. This code tracks every referral and sale you generate, and lets your network unlock exclusive savings when they use it.",
	},
	{
		number: 2,
		title: "Share & Track Referrals",
		description:
			"Share your code via social, email, or directly with potential customers. For our MVP, you'll receive all referral and commission updates via SMS (no dashboard yet).",
	},
	{
		number: 3,
		title: "Earn Up to $4,500 per Sale",
		description:
			"You’ll earn 10% of every transaction made with your code, up to $4,500 per sale. Commissions are paid out monthly—no cap on total earnings!",
	},
	{
		number: 4,
		title: "Get Paid & Access Support",
		description:
			"Receive monthly payouts and get all important affiliate updates via SMS & Email for our MVP. Our team is here to support your affiliate success at every step.",
	},
];

export const pilotProgramSteps: ConsultationStep[] = [
	{
		number: 1,
		title: "Apply & Reserve Your Pilot Spot",
		description:
			"Submit a brief application and place your fully-refundable deposit to secure your spot in the Pilot Program. This simple step ensures you're first in line for exclusive access, perks, and early results.",
	},
	{
		number: 2,
		title: "Lock-In Exclusive Pilot Pricing",
		description:
			"By joining the Pilot Program, you guarantee early adopter pricing, protected for 2 years—regardless of future price increases. Enjoy maximum value and ROI as new features are released.",
	},
	{
		number: 3,
		title: "Unlock Pilot Perks",
		description:
			"Enjoy exclusive Pilot Program perks: 15 free Ai Credits, unlimited free skip tracing, early feature access, founder recognition, and more.",
	},
	{
		number: 4,
		title: "White-Glove Onboarding & Go-Live",
		description:
			"We’ll schedule your personalized onboarding session, set up your account with all your Founder’s Perks, and make sure you’re ready to scale from day one.",
	},
];
