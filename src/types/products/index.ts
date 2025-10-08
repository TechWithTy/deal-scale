import type { AgentConfig } from "../agents";
import type { ABTest } from "../testing";
import type { ProductShippingInfo } from "./shipping";

export type SizingChart = ReadonlyArray<{
	label: string;
	value: string | number;
	measurement: string;
	unit: string;
}>;

export interface Review {
	id: number;
	author: string;
	rating: number;
	date: string; // Changed from string to Date
	content: string;
	image?: string;
}

interface SalesIncentive {
	type: "onSale" | "limitedTime" | "clearance" | "bundle" | "newArrival";
	description?: string;
	discountPercent?: number;
	expiresAt?: Date; // Changed from string to Date
	[key: string]: unknown;
}

export interface ProductFaq {
	question: string;
	answer: string;
}

export enum LicenseType {
	MIT = "MIT",
	Apache_2_0 = "Apache-2.0",
	GPL_3_0 = "GPL-3.0",
	BSD_2_Clause = "BSD-2-Clause",
	BSD_3_Clause = "BSD-3-Clause",
	MPL_2_0 = "MPL-2.0",
	LGPL_3_0 = "LGPL-3.0",
	EPL_2_0 = "EPL-2.0",
	Unlicense = "Unlicense",
	Proprietary = "Proprietary",
	// Add more as needed for your catalog
}
export interface TechLicense {
	name: string; // e.g. "MIT", "Apache-2.0", "GPL-3.0", etc.
	type: LicenseType;
	url: string; // Link to the full license text
	description?: string; // Short summary or explanation of the license
	permissions: ReadonlyArray<string>; // e.g. ["commercial-use", "modification", "distribution"]
	conditions: ReadonlyArray<string>; // e.g. ["include-copyright", "document-changes"]
	limitations: ReadonlyArray<string>; // e.g. ["liability", "warranty"]
}
// To get the full license object for a product:
// import { licenses } from "@/data/products/license";
// const licenseObj = licenses.find(l => l.name === product.license);

export interface ProductFaq {
	question: string;
	answer: string;
}

export enum ProductCategory {
        Credits = "credits",
        Workflows = "workflows",
        Essentials = "essentials",
        Notion = "notion",
        Leads = "leads",
        Data = "data",
        Monetize = "monetize",
        Automation = "automation",
        AddOn = "add-on",
        Agents = "agents",
}

export interface ProductType {
	id: string;
	description: string; // * Product description for detail page
	name: string;
	price: number;
	sku: string;
	slug?: string; // Optional slug for dynamic product routes
	abTest?: ABTest;
	images: ReadonlyArray<string>; // Added readonly
	reviews: Array<Review>;
	salesIncentive?: SalesIncentive;
	sizingChart?: SizingChart;
	categories: ProductCategory[];
	licenseName?: LicenseType;
	shippingInfo?: ProductShippingInfo;
	types: Array<{
		name: string;
		value: string;
		price: number;
	}>;
	colors: Array<{
		name: string;
		value: string;
		class: string;
	}>;
        sizes: Array<{
                name: string;
                value: string;
                inStock: boolean;
        }>;
        faqs?: ProductFaq[];
        /** Optional embedded agent configuration when the product represents a Deal Scale agent. */
        agent?: AgentConfig;
}
