"use client";
// * AboutUsClient: Composes all About page sections using Magic UI and theme-compliant layout
// ! This file is the main About page client component

import { CTASection } from "../common/CTASection";
import AboutFunFacts from "./AboutFunFacts";
import AboutHero from "./AboutHero";
import { MarqueeDemo } from "./AboutMarquee";
import AboutTeam from "./AboutTeam";
import AboutTimeline from "./AboutTimeline";
import AboutValues from "./AboutValues";

export default function AboutUsClient() {
	return (
		<main className="flex flex-col gap-3 ">
			<AboutHero />
			<AboutFunFacts />

			<AboutValues />
			<AboutTeam />

			<AboutTimeline />
			<MarqueeDemo />

			<CTASection
				title="Invest in Deal Scale!"
				description="Looking for scalable, AI-powered investment opportunities with proven growth and strong deal flow? Discover how Deal Scale empowers forward-thinking investors to accelerate returns and capitalize on market momentum."
				buttonText="Get The Pitch Deck"
				href="/pitch-deck-investor"
			/>
		</main>
	);
}
