"use client";

import { CTASection } from "@/components/common/CTASection";
import EventsFilter from "@/components/events/EventsFilter";
import EventsGrid from "@/components/events/EventsGrid";
import type { NormalizedEvent } from "@/lib/events/eventSchemas";
import { useMemo, useState } from "react";

interface EventsClientProps {
	events: NormalizedEvent[];
}

export default function Events({ events }: EventsClientProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("all");

	const categories = useMemo(() => {
		const uniqueCategories = Array.from(
			new Set(events.map((event) => event.category)),
		);
		return [
			{ id: "all", name: "All Events" },
			...uniqueCategories.filter(Boolean).map((category) => ({
				id: category,
				name: category.charAt(0).toUpperCase() + category.slice(1),
			})),
		];
	}, [events]);

	const filteredEvents = useMemo(() => {
		const normalizedSearch = searchTerm.toLowerCase();
		return events.filter((event) => {
			const matchesCategory =
				activeCategory === "all" || event.category === activeCategory;
			const matchesSearch =
				event.title?.toLowerCase().includes(normalizedSearch) ||
				event.description?.toLowerCase().includes(normalizedSearch) ||
				event.location?.toLowerCase().includes(normalizedSearch);
			return matchesCategory && matchesSearch;
		});
	}, [activeCategory, events, searchTerm]);

	return (
		<>
			<div className=" ">
				{/* <HeroSessionMonitorClientWithModal /> */}

				<EventsFilter
					categories={categories}
					activeCategory={activeCategory}
					onSearch={setSearchTerm}
					onCategoryChange={setActiveCategory}
				/>
				<EventsGrid
					events={filteredEvents}
					isCategoryFiltered={activeCategory !== "all"}
				/>
				<CTASection
					title="Want to attend our events?"
					description="Join us for exciting discussions and networking opportunities."
					buttonText="Register Now"
					href="/contact"
				/>
			</div>
		</>
	);
}
