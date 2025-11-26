import type { FeatureTimelineMilestone } from "@/components/features/FeatureTimelineTable";
import { companyData } from "@/data/company";
import { defaultSeo } from "@/utils/seo/staticSeo";

import { ORGANIZATION_ID, SCHEMA_CONTEXT, buildAbsoluteUrl } from "./helpers";

export interface BuildRoadmapSchemaOptions {
	url?: string;
	name?: string;
	description?: string;
}

function slugifyQuarter(quarter: string): string {
	return quarter
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

export function buildRoadmapSchema(
	milestones: FeatureTimelineMilestone[],
	options: BuildRoadmapSchemaOptions = {},
) {
	const baseUrl = buildAbsoluteUrl(options.url ?? "/features");
	const roadmapId = `${baseUrl}#roadmap`;

	// Map status to schema.org status types
	const getStatusType = (status: string): string => {
		switch (status) {
			case "Completed":
				return "https://schema.org/EventStatusType/EventScheduled";
			case "Alpha":
			case "Active":
			case "In Build":
				return "https://schema.org/EventStatusType/EventScheduled";
			case "Upcoming":
			case "Planned":
				return "https://schema.org/EventStatusType/EventPostponed";
			default:
				return "https://schema.org/EventStatusType/EventScheduled";
		}
	};

	return {
		"@context": SCHEMA_CONTEXT,
		"@type": "ItemList",
		"@id": roadmapId,
		name: options.name ?? "Deal Scale Delivery Roadmap",
		description:
			options.description ??
			"A strategic view of where Deal Scale is today and what's coming next. Statuses and progress come from our Product Ops layer—always live, always current.",
		url: baseUrl,
		numberOfItems: milestones.length,
		itemListElement: milestones.map((milestone, index) => {
			const quarterSlug = slugifyQuarter(milestone.quarter);
			const itemId = `${roadmapId}-${quarterSlug}`;

			// Extract partner links from highlights
			const partnerLinks: string[] = [];
			for (const highlight of milestone.highlights) {
				const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
				let match: RegExpExecArray | null = null;
				while (true) {
					match = linkRegex.exec(highlight);
					if (match === null) {
						break;
					}
					partnerLinks.push(match[2]);
				}
			}

			return {
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Event",
					"@id": itemId,
					name: `${milestone.quarter} – ${milestone.initiative}`,
					description: milestone.summary,
					startDate: milestone.quarter,
					eventStatus: {
						"@type": "EventStatusType",
						"@id": getStatusType(milestone.status),
					},
					about: {
						"@type": "Thing",
						name: milestone.focus,
						description: milestone.summary,
					},
					organizer: {
						"@type": "Organization",
						"@id": ORGANIZATION_ID,
						name: companyData.companyName,
						url: defaultSeo.canonical,
					},
					// Include partner links if available
					...(partnerLinks.length > 0 && {
						url: partnerLinks[0], // Primary partner link
						sameAs: partnerLinks, // All partner links
					}),
					// Include highlights as additional properties
					additionalProperty: milestone.highlights.map((highlight, idx) => ({
						"@type": "PropertyValue",
						name: `Feature ${idx + 1}`,
						value: highlight.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)"), // Convert markdown links to plain text
					})),
				},
			};
		}),
		author: {
			"@type": "Organization",
			"@id": ORGANIZATION_ID,
			name: companyData.companyName,
			url: defaultSeo.canonical,
		},
		dateModified: new Date().toISOString(),
	};
}
