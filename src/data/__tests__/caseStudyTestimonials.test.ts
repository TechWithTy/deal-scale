import { caseStudyTestimonials } from "../caseStudy/slugDetails/testimonials";

describe("caseStudyTestimonials data integrity", () => {
	it("exports at least one testimonial with required fields", () => {
		expect(Array.isArray(caseStudyTestimonials)).toBe(true);
		expect(caseStudyTestimonials.length).toBeGreaterThan(0);

		for (const testimonial of caseStudyTestimonials) {
			expect(typeof testimonial.id).toBe("number");
			expect(typeof testimonial.name).toBe("string");
			expect(testimonial.name).not.toHaveLength(0);
			expect(typeof testimonial.role).toBe("string");
			expect(testimonial.role).not.toHaveLength(0);
			expect(typeof testimonial.content).toBe("string");
			expect(testimonial.content).not.toHaveLength(0);
			expect(typeof testimonial.problem).toBe("string");
			expect(testimonial.problem).not.toHaveLength(0);
			expect(typeof testimonial.solution).toBe("string");
			expect(testimonial.solution).not.toHaveLength(0);
			expect(typeof testimonial.company).toBe("string");
			expect(testimonial.company).not.toHaveLength(0);
			expect(typeof testimonial.rating).toBe("number");
		}
	});
});
