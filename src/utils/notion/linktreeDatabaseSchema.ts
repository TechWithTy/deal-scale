/**
 * Notion Linktree Database Schema
 *
 * Auto-generated from Notion API
 * Database ID: 26ee9c25-ecb0-80ae-9128-e7565860bb64
 *
 * Last updated: 2025-11-01T13:46:45.528Z
 */

import type {
	NotionFilesProperty,
	NotionRichTextProperty,
	NotionSelectProperty,
	NotionTitleProperty,
	NotionUrlProperty,
} from "./notionTypes";

// Additional Notion property types not in notionTypes.ts
export type NotionStatusProperty = {
	type: "status";
	status: {
		id: string;
		name: string;
		color: string;
	} | null;
};

export type NotionDateProperty = {
	type: "date";
	date: {
		start: string;
		end: string | null;
		time_zone: string | null;
	} | null;
};

export type NotionNumberProperty = {
	type: "number";
	number: number | null;
};

export interface LinkTreeNotionDatabaseProperties {
	// Property: "Video" (files)
	Video: NotionFilesProperty;

	// Property: "Status" (status)
	Status: NotionStatusProperty;

	// Property: "UTM Offer" (select)
	"UTM Offer": NotionSelectProperty; // Options: "ai5skipUnlimited" | "Get Free AI  Calling Credits" | "Early Access" | "trending-zip-codes";

	// Property: "UTM Campaign (Relation)" (select)
	"UTM Campaign (Relation)": NotionSelectProperty; // Options: "brand2025" | "beta2025" | "bf2025" | "fall2025" | "co-startup-week" | "beta_signup" | "investor_deck" | "cosw2025" | "ty-linkedin" | "Cofounder-Test" | "alpha_0.1" | "investor_follow_up_0.1" | "newsletter-welcome" | "pre-recruit-q1-25";

	// Property: "Destination" (url)
	Destination: NotionUrlProperty;

	// Property: "Affiliate Code" (select)
	"Affiliate Code": NotionSelectProperty; // Options: ;

	// Property: "End Date" (date)
	"End Date": NotionDateProperty;

	// Property: "Redirect To Download First File" (select)
	"Redirect To Download First File": NotionSelectProperty; // Options: "Yes" | "No";

	// Property: "UTM Source" (select)
	"UTM Source": NotionSelectProperty; // Options: "youtube" | "linkedin" | "facebook" | "email" | "cosw2025" | "business_card" | "csw_handout" | "linktree" | "landing-page" | "powerpoint-qr" | "Reddit" | "x-twitter" | "instagram" | "website" | "github" | "investor-application-general" | "beehiiv" | "tik-tok" | "blue-sky" | "wellfound" | "gumroad";

	// Property: "Details" (rich_text)
	Details: NotionRichTextProperty;

	// Property: "UTM Medium" (select)
	"UTM Medium": NotionSelectProperty; // Options: "social" | "cpc" | "newsletter" | "linktree" | "qr_code" | "vCard" | "Post" | "link";

	// Property: "Thumbnail" (url)
	Thumbnail: NotionUrlProperty;

	// Property: "Highlighted" (select)
	Highlighted: NotionSelectProperty; // Options: "Yes" | "No";

	// Property: "Redirects (Clicks)" (number)
	"Redirects (Clicks)": NotionNumberProperty;

	// Property: "Image" (files)
	Image: NotionFilesProperty;

	// Property: "Title" (rich_text)
	Title: NotionRichTextProperty;

	// Property: "File" (files)
	File: NotionFilesProperty;

	// Property: "Redirect Type" (select)
	"Redirect Type": NotionSelectProperty; // Options: "External" | "Internal";

	// Property: "Discount Code" (select)
	"Discount Code": NotionSelectProperty; // Options: ;

	// Property: "Redirects (Calls)" (number)
	"Redirects (Calls)": NotionNumberProperty;

	// Property: "Category" (select)
	Category: NotionSelectProperty; // Options: "Test" | "Event-Kit" | "Product" | "Contact" | "Offerings" | "Investors" | "Physical" | "Social-Kit" | "Customer" | "Beehiiv" | "Reports" | "Recruiting";

	// Property: "Link Tree Enabled" (select)
	"Link Tree Enabled": NotionSelectProperty; // Options: "True" | "False";

	// Property: "Start Date" (date)
	"Start Date": NotionDateProperty;

	// Property: "Slug" (title)
	Slug: NotionTitleProperty;
}
