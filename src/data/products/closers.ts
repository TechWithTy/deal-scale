import {
	LicenseType,
	ProductCategory,
	type ProductType,
} from "@/types/products";

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
		images: ["/products/closers.png"],
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
];

