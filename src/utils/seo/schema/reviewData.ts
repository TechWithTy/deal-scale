import { companyData } from "@/data/company";
import {
	PERSONA_LABELS,
	type PersonaKey,
} from "@/data/personas/catalog";
import { personaTestimonials } from "@/data/personas/testimonialsByPersona";

import { ORGANIZATION_ID } from "./helpers";
import type { AggregateRatingSchema, ReviewSchema } from "./types";

type PersonaLabelRecord = Partial<Record<PersonaKey, string>>;

const rawTestimonials = Object.values(personaTestimonials).flat().filter(Boolean);

const personaLabels: PersonaLabelRecord = PERSONA_LABELS;

const testimonialReviewSchemas: ReviewSchema[] = rawTestimonials.map(
	(testimonial) => {
		const personaLabel =
			personaLabels[testimonial.persona] ?? testimonial.persona;
		return {
			"@type": "Review",
			name: `${testimonial.name} · ${personaLabel}`,
			reviewBody: testimonial.content,
			author: {
				"@type": "Person",
				name: testimonial.name,
			},
			itemReviewed: {
				"@id": ORGANIZATION_ID,
				"@type": "Organization",
				name: companyData.companyName,
			},
			reviewRating: {
				"@type": "Rating",
				ratingValue: testimonial.rating,
				bestRating: 5,
				worstRating: 1,
			},
		};
	},
);

const testimonialAggregateRating: AggregateRatingSchema | undefined =
	rawTestimonials.length > 0
		? {
				"@type": "AggregateRating",
				ratingValue: Number(
					(
						rawTestimonials.reduce(
							(sum, testimonial) => sum + (testimonial.rating ?? 0),
							0,
						) / rawTestimonials.length
					).toFixed(2),
				),
				reviewCount: rawTestimonials.length,
				bestRating: 5,
				worstRating: 1,
			}
		: undefined;

export const getTestimonialReviewData = () => ({
	reviews: testimonialReviewSchemas,
	aggregateRating: testimonialAggregateRating,
});

export { testimonialReviewSchemas, testimonialAggregateRating };



