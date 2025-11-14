import {
	LicenseType,
	ProductCategory,
	type ProductType,
} from "@/types/products";
import {
	brandedDeskMatABTests,
	documentTemplatePackABTests,
	ergonomicChairABTests,
	escrowServiceKitABTests,
	investorPlaybookABTests,
	smartLampABTests,
} from "./copy";

export const essentialsProducts: (ProductType & { physical?: boolean })[] = [
	// Digital Offering
	{
		id: "document-template-pack",
		name: "Document Template Pack",
		abTest: documentTemplatePackABTests[0],
		price: 99,
		sku: "ESS-DOC-TEMPLATES",
		slug: "document-template-pack",
		licenseName: LicenseType.Proprietary,
		description:
			"A complete set of customizable real estate contracts, agreements, and letters for investors and agents. Instantly download and use in your business.",
		categories: [ProductCategory.Essentials],
		images: ["/products/essentials.png"],
		types: [{ name: "Standard", value: "standard", price: 99 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "What formats are included?",
				answer:
					"All templates are provided in Word and PDF formats for easy editing.",
			},
		],
		physical: false,
	},
	// Physical Item
	{
		id: "real-estate-investor-book",
		name: "Real Estate Investor's Playbook (Hardcover)",
		abTest: investorPlaybookABTests[0],
		price: 39,
		sku: "ESS-BOOK-HC",
		slug: "real-estate-investor-book",
		licenseName: LicenseType.Proprietary,
		description:
			"A hardcover book with actionable strategies, checklists, and scripts for real estate investors. Perfect for your desk or bookshelf.",
		categories: [ProductCategory.Essentials],
		images: ["/products/essentials.png"],
		types: [{ name: "Hardcover", value: "hardcover", price: 39 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Is this a physical book?",
				answer: "Yes, this is a hardcover shipped to your address.",
			},
		],
		physical: true,
	},
	// Digital Service Offering
	{
		id: "escrow-service-kit",
		name: "Escrow Service Kit",
		abTest: escrowServiceKitABTests[0],
		price: 199,
		sku: "ESS-ESCROW-KIT",
		slug: "escrow-service-kit",
		licenseName: LicenseType.Proprietary,
		description:
			"Everything you need to manage real estate escrow transactions securely and efficiently, including digital checklists, timelines, and best practices.",
		categories: [ProductCategory.Essentials],
		images: ["/products/essentials.png"],
		types: [{ name: "Digital Kit", value: "digital", price: 199 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Does this include legal services?",
				answer:
					"No, this is a toolkit for managing the process, not a legal service.",
			},
		],
		physical: false,
	},
	// Desk & Home Essentials
	{
		id: "branded-desk-mat",
		name: "Deal Scale Branded Desk Mat",
		abTest: brandedDeskMatABTests[0],
		price: 29,
		sku: "ESS-DESK-MAT",
		slug: "branded-desk-mat",
		licenseName: LicenseType.Proprietary,
		description:
			"A premium, non-slip desk mat with Deal Scale branding. Protects your workspace and adds a professional touch to your office or home desk.",
		categories: [ProductCategory.Essentials],
		images: ["/products/essentials.png"],
		types: [{ name: "Desk Mat", value: "desk-mat", price: 29 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "What size is the desk mat?",
				answer: "The mat measures 31.5 x 15.7 inches and fits most desks.",
			},
		],
		physical: true,
	},
	{
		id: "ergonomic-chair",
		name: "Ergonomic Office Chair",
		abTest: ergonomicChairABTests[0],
		price: 199,
		sku: "ESS-CHAIR",
		slug: "ergonomic-chair",
		licenseName: LicenseType.Proprietary,
		description:
			"A comfortable, adjustable ergonomic chair designed for productivity and long work sessions at your home office or workspace.",
		categories: [ProductCategory.Essentials],
		images: ["/products/essentials.png"],
		types: [{ name: "Ergonomic Chair", value: "chair", price: 199 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Is assembly required?",
				answer:
					"Minimal assembly is required. Instructions and tools are included.",
			},
		],
		physical: true,
	},
	{
		id: "smart-lamp",
		name: "Smart LED Desk Lamp",
		abTest: smartLampABTests[0],
		price: 49,
		sku: "ESS-LAMP",
		slug: "smart-lamp",
		licenseName: LicenseType.Proprietary,
		description:
			"A modern LED desk lamp with adjustable brightness and color temperature. Ideal for late-night work or reading at your desk or home office.",
		categories: [ProductCategory.Essentials],
		images: ["/products/essentials.png"],
		types: [{ name: "Smart Lamp", value: "lamp", price: 49 }],
		reviews: [],
		colors: [],
		sizes: [],
		faqs: [
			{
				question: "Does it support dimming?",
				answer: "Yes, brightness and color temperature are fully adjustable.",
			},
		],
		physical: true,
	},
];
