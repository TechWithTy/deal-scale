import type { Event } from "@/types/event";
import { Response } from "node-fetch";

describe("fetchEvents", () => {
        const originalEnv = process.env;
        const originalFetch = global.fetch;

        beforeEach(() => {
                jest.resetModules();
                process.env = { ...originalEnv };
                process.env.DEALSCALE_API_BASE = "https://api.example.com";
                global.fetch = jest.fn() as unknown as typeof fetch;
        });

        afterEach(() => {
                process.env = originalEnv;
                global.fetch = originalFetch;
                jest.clearAllMocks();
        });

        test("returns normalized events from the API when the response is valid", async () => {
                const apiEvents: Event[] = [
                        {
                                id: "remote-1",
                                title: "Remote Event",
                                date: "2025-01-01",
                                time: "09:00",
                                description: "An event pulled from the API feed.",
                                externalUrl: "https://events.example.com/remote",
                                category: "conference",
                                location: "Remote",
                        },
                ];

                (global.fetch as jest.Mock).mockResolvedValue(
                        new Response(
                                JSON.stringify({ events: apiEvents }),
                                {
                                        status: 200,
                                        headers: { "Content-Type": "application/json" },
                                },
                        ),
                );

                const { fetchEvents } = await import("@/lib/events/fetchEvents");
                const result = await fetchEvents();

                expect(global.fetch).toHaveBeenCalledWith(
                        "https://api.example.com/api/v1/events",
                        expect.objectContaining({
                                next: { revalidate: 1800 },
                        }),
                );

                expect(result).toEqual([
                        expect.objectContaining({
                                id: "remote-1",
                                slug: "remote-event",
                        }),
                ]);
        });

        test("falls back to static events when the API request fails", async () => {
                jest.doMock("@/data/events", () => ({
                        events: [
                                {
                                        id: "fallback",
                                        title: "Fallback Event",
                                        date: "2025-02-01",
                                        time: "10:00",
                                        description: "A locally sourced fallback event.",
                                        externalUrl: "https://events.example.com/fallback",
                                        category: "meetup",
                                        location: "Chicago, IL",
                                },
                        ],
                }));

                (global.fetch as jest.Mock).mockRejectedValue(new Error("network error"));

                const { fetchEvents } = await import("@/lib/events/fetchEvents");
                const result = await fetchEvents();

                expect(result).toEqual([
                        expect.objectContaining({
                                id: "fallback",
                                slug: "fallback-event",
                                location: "Chicago, IL",
                        }),
                ]);
        });
});
