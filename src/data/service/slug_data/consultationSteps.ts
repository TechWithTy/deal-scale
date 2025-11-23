export interface ConsultationStep {
	number: number;
	title: string;
	description: string;
}

export const betaSignupSteps: ConsultationStep[] = [
	{
		number: 1,
		title: "Request Your Spot in the Founders Circle",
		description:
			"Begin your application to join an exclusive group of operators shaping the future of AI deal flow. Entry is limited to ensure every member receives tailored support and strategic access.",
	},
	{
		number: 2,
		title: "Unlock Elite-Level Access",
		description:
			"Complete a short profile to activate your perks: free AI-powered calling and texting during beta, private newsletter access, locked insider pricing, and exclusive early adopter bonuses.",
	},
	{
		number: 3,
		title: "Step Into Early Access",
		description:
			"Founders Circle members don't wait in line. You influence the roadmap, vote on the features you want built next, and receive every release before the public, including experimental tools.",
	},
	{
		number: 4,
		title: "Welcome to the Inner Circle",
		description:
			"You're officially in. Your onboarding email includes access to free AI calls and texts, your private operator community, and the workflows you need to automate deal flow like the top 1% of producers.",
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
