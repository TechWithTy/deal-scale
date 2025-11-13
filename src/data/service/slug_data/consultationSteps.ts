export interface ConsultationStep {
	number: number;
	title: string;
	description: string;
}

export const betaSignupSteps: ConsultationStep[] = [
	{
		number: 1,
		title: "Apply for Beta Tester Program",
		description:
			"Start your application to become a Deal Scale beta tester. Our beta program is limited to ensure every participant receives special support and has a key role in shaping the final product.",
	},
	{
		number: 2,
		title: "Unlock Beta Perks",
		description:
			"Complete a short profile about your business needs and challenges. Instantly unlock your Beta Tester Perks—5 Ai Credits, exclusive newsletter access, a future subscription discount, and bonus Credits if you're approved.",
	},
	{
		number: 3,
		title: "Gain Early Access",
		description:
			"As a beta tester, your feedback directly influences our product roadmap. Vote On Upcoming Features on features and improvements. You'll get priority access as soon as Deal Scale launches.",
	},
	{
		number: 4,
		title: "You're In!",
		description:
			"Welcome to the program! Watch for your onboarding email with free credits, your 5 AI Credits, newsletter access, and everything you need to automate your deal flow and close more deals.",
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
