import { DEFAULT_PERSONA_KEY } from "@/data/personas/catalog";
import type { PersonaKey } from "@/data/personas/catalog";
import type { Testimonial } from "@/types/testimonial";

export interface PersonaTestimonial extends Testimonial {
	persona: PersonaKey;
}

export const personaTestimonials: Record<PersonaKey, PersonaTestimonial[]> = {
	investor: [
		{
			persona: "investor",
			id: 1,
			name: "Ava Moretti",
			role: "Principal, Moretti Capital Holdings",
			content:
				"DealScale transformed our acquisitions team almost overnight. It is the first AI real estate tool that genuinely adds capacity instead of adding complexity.",
			problem:
				"Our analysts were overwhelmed by inconsistent lead flow, manual screening, and tools that did not communicate with each other. We were losing 3 to 5 solid opportunities every month.",
			solution:
				"DealScale centralized everything through AI qualification, enriched data, and automated follow up. We cut our analysis time by more than 50 percent and increased high quality deal flow across three markets.",
			rating: 5,
			company: "Moretti Capital Holdings",
		},
		{
			persona: "investor",
			id: 2,
			name: "Raj Patel",
			role: "Managing Director, Horizon Equity Investments",
			content:
				"As a multi market investor, DealScale is the closest thing to having a full time acquisitions analyst and pipeline manager running 24 hours a day.",
			problem:
				"We were drowning in spreadsheets and inconsistent underwriting. Even with a strong team, we missed time sensitive off market opportunities because our workflow was too slow.",
			solution:
				"DealScale screens and routes opportunities instantly, runs automated outreach, and surfaces top tier leads for review. Our underwriting load dropped by nearly 40 percent and our pipeline is more predictable than ever.",
			rating: 5,
			company: "Horizon Equity Investments",
		},
		{
			persona: "investor",
			id: 3,
			name: "Sophia Kim",
			role: "Lead Acquisitions Strategist, Kim Equity Partners",
			content:
				"I recommend DealScale to every serious investor. It is built for fast moving acquisitions teams that need reliable automation and consistent high intent leads.",
			problem:
				"We were losing track of conversations across channels, especially in high volume weeks. Follow up delays cost us competitive deals in multiple markets.",
			solution:
				"DealScale's AI driven follow up, lookalike audience engine, and unified Command Center gave us reliable daily deal flow. Our conversion rate increased by roughly 27 percent in the first month.",
			rating: 5,
			company: "Kim Equity Partners",
		},
	],
	wholesaler: [
		{
			persona: "wholesaler",
			id: 4,
			name: "Jordan Alvarez",
			role: "Founder, Alvarez Off Market Group",
			content:
				"DealScale automated our wholesaling operations more effectively than any dialer, SMS platform, or VA team we ever used.",
			problem:
				"Our outreach was scattered across five tools, leading to disorganized follow up and dropped conversations. We were constantly playing catch up.",
			solution:
				"DealScale unified skip tracing, AI calls, SMS automation, and lead routing. Our assignment fee volume increased by more than 30 percent in 60 days.",
			rating: 5,
			company: "Alvarez Off Market Group",
		},
		{
			persona: "wholesaler",
			id: 5,
			name: "Marcus Bishop",
			role: "CEO, Bishop Property Solutions",
			content:
				"My wholesaling business finally feels scalable. DealScale replaced inconsistent manual hustle with a predictable automated system.",
			problem:
				"Fast moving sellers slipped through the cracks because we could not respond quickly enough or track conversations properly.",
			solution:
				"AI agents make first contact instantly, and automated workflows keep every seller engaged. We secured 4 contracts in the first two weeks of using the platform.",
			rating: 5,
			company: "Bishop Property Solutions",
		},
		{
			persona: "wholesaler",
			id: 6,
			name: "Lila Torres",
			role: "Co Founder, Torres Home Buyers",
			content:
				"DealScale feels like hiring a full acquisitions team without the overhead. It is incredibly consistent and removes all guesswork.",
			problem:
				"Lead intake was slow, VAs delivered inconsistent quality, and we were losing momentum with cold leads.",
			solution:
				"DealScale's structured follow up and Command Center kept our entire pipeline warm. We increased our follow up rate by more than 50 percent and our deal flow stabilized immediately.",
			rating: 5,
			company: "Torres Home Buyers",
		},
	],
	agent: [
		{
			persona: "agent",
			id: 7,
			name: "Maya Thompson",
			role: "Top Producing Agent, Thompson and Co.",
			content:
				"DealScale is like having a personal ISA and marketing system working behind the scenes. My pipeline has never been this active.",
			problem:
				"I could not keep up with inquiries, cold leads, and follow ups during peak season. Opportunities were slipping away.",
			solution:
				"AI agents respond instantly, automated nurture sequences keep buyers engaged, and the Command Center organizes my entire lead flow. Appointments doubled within 30 days.",
			rating: 5,
			company: "Thompson and Co.",
		},
		{
			persona: "agent",
			id: 8,
			name: "Chris Delgado",
			role: "Realtor, Delgado Realty Group",
			content:
				"I have tried every CRM and AI assistant, but DealScale is the only platform that keeps deals moving automatically without constant babysitting.",
			problem:
				"Manual qualification and inconsistent outreach slowed me down and cost me listing opportunities.",
			solution:
				"DealScale qualifies every lead, handles follow ups, and prioritizes high intent prospects. I spend my time meeting clients instead of chasing them.",
			rating: 5,
			company: "Delgado Realty Group",
		},
		{
			persona: "agent",
			id: 9,
			name: "Rebecca Shaw",
			role: "Associate Broker, Shaw Realty Advisors",
			content:
				"DealScale supercharged my listing pipeline and helped me win more seller appointments in a competitive market.",
			problem:
				"My responses were too slow and competing agents beat me to new leads. My follow up was inconsistent on busy weeks.",
			solution:
				"AI outreach, instant responses, and voice workflows helped maintain trust with sellers. My listing appointments increased by 35 percent in the first month.",
			rating: 5,
			company: "Shaw Realty Advisors",
		},
	],
	founder: [],
	loan_officer: [],
};

export const getTestimonialsForPersona = (
	persona: PersonaKey,
): PersonaTestimonial[] =>
	personaTestimonials[persona]?.length
		? personaTestimonials[persona]
		: personaTestimonials[DEFAULT_PERSONA_KEY];

export const findFirstPersonaTestimonial = (): PersonaTestimonial =>
	personaTestimonials[DEFAULT_PERSONA_KEY][0];
