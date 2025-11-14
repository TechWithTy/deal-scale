export interface Testimonial {
	id: number;
	name: string;
	role: string;
	content: string;
	problem: string;
	solution: string;
	image?: string;
	rating: number;
	company: string;
	companyLogo?: string;
}
