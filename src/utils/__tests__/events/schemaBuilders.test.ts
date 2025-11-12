import type { NormalizedEvent } from "@/lib/events/eventSchemas";
import {
	buildEventSchema,
	buildEventsItemListSchema,
} from "@/lib/events/schemaBuilders";

describe("schema builders", () => {
	const baseEvent: NormalizedEvent = {
		id: "1",
		slug: "ai-demo",
		title: "AI Demo Day",
		date: "2025-03-10",
		time: "09:00",
		description: "Discover how DealScale uses AI for modern deal management.",
		externalUrl: "https://events.dealscale.io/ai-demo",
		category: "conference",
		location: "Austin, TX",
	};

	test("buildEventsItemListSchema returns an ItemList with canonical URLs", () => {
		const schema = buildEventsItemListSchema([baseEvent]);

		expect(schema["@type"]).toBe("ItemList");
		expect(schema.itemListElement).toHaveLength(1);
		expect(schema.itemListElement[0]).toEqual(
			expect.objectContaining({
				url: "https://dealscale.io/events/ai-demo",
				position: 1,
			}),
		);
	});

	test("buildEventSchema returns a fully qualified Event payload", () => {
		const schema = buildEventSchema(baseEvent);

		expect(schema["@type"]).toBe("Event");
		expect(schema.name).toBe(baseEvent.title);
		const expectedStartDate = new Date(
			`${baseEvent.date}T${baseEvent.time}`,
		).toISOString();

		expect(schema.startDate).toBe(expectedStartDate);
		expect(schema.location).toEqual(
			expect.objectContaining({
				address: expect.objectContaining({
					addressLocality: "Austin",
				}),
			}),
		);
		expect(schema.offers?.url).toBe(baseEvent.externalUrl);
	});
});
