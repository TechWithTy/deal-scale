import {
	LicenseType,
	ProductCategory,
	type ProductType,
} from "@/types/products";
import { mockClosers } from "@/data/closers/mockClosers";

// Get top 3 closers (sorted by rating, then deals closed)
const getTopClosers = () => {
	return [...mockClosers]
		.sort((a, b) => {
			// Sort by rating first (descending), then by deals closed (descending)
			if (b.rating !== a.rating) {
				return b.rating - a.rating;
			}
			return b.dealsClosed - a.dealsClosed;
		})
		.slice(0, 3);
};

const topClosers = getTopClosers();

// Convert closer to product
const closerToProduct = (closer: typeof mockClosers[0]): ProductType => {
	return {
		id: `closer-${closer.id}`,
		name: `${closer.name} - ${closer.title}`,
		price: closer.hourlyRate,
		sku: `DS-CLOSER-${closer.id.toUpperCase()}`,
		slug: `closer-${closer.id}`,
		licenseName: LicenseType.Proprietary,
		description: `${closer.bio} Located in ${closer.location}. Specializes in ${closer.specialties.join(", ")}. ${closer.rating}★ rating with ${closer.reviews} reviews. Has closed ${closer.dealsClosed} deals.`,
		categories: [
			ProductCategory.RemoteClosers,
			ProductCategory.AddOn,
			// Individual closers should NOT be in Monetize category - only the marketplace entry point
		],
		images: [closer.image],
		types: [],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: `What is ${closer.name}'s hourly rate?`,
				answer: `${closer.name} charges $${closer.hourlyRate} per hour for remote closing services.`,
			},
			{
				question: `What are ${closer.name}'s specialties?`,
				answer: `${closer.name} specializes in ${closer.specialties.join(", ")} transactions.`,
			},
			{
				question: `Where is ${closer.name} located?`,
				answer: `${closer.name} is located in ${closer.location} and provides remote closing services nationwide.`,
			},
		],
	};
};

export const closerProducts: ProductType[] = [
	{
		id: "remote-closers-marketplace",
		name: "Remote Closers",
		price: 0, // Free to browse, application required
		sku: "DS-REMOTE-CLOSERS",
		slug: "remote-closers",
		licenseName: LicenseType.Proprietary,
		description:
			"Connect with professional real estate closers to close your deals. Apply to become a closer or hire experienced closers for your transactions. Our marketplace connects you with vetted professionals ready to help close deals remotely.",
		categories: [
			ProductCategory.RemoteClosers,
			ProductCategory.Monetize,
			ProductCategory.AddOn,
		],
		images: ["https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&h=800&fit=crop&q=80"],
		types: [],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "What is a Remote Closer?",
				answer:
					"Remote Closers are professional real estate professionals who specialize in closing deals remotely. They handle negotiations, paperwork, and deal coordination to help you close transactions without being physically present.",
			},
			{
				question: "How do I become a Remote Closer?",
				answer:
					"Click on the Remote Closers card to apply. We'll review your application, real estate experience, and credentials. Once approved, you'll be added to our marketplace where clients can book your services.",
			},
			{
				question: "What are the requirements to become a closer?",
				answer:
					"Requirements include a valid real estate license, proven track record of closed deals, excellent communication skills, and availability to handle remote closing services. Specific requirements may vary by state.",
			},
			{
				question: "How does the booking system work?",
				answer:
					"Once you're approved as a closer, clients can browse your profile, see your ratings and experience, and book you for their deals. You'll receive notifications and can accept or decline assignments based on your availability.",
			},
		],
	},
	// Add top 3 closers as individual product cards
	...topClosers.map(closerToProduct),
];

