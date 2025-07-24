"use client";

import { CTASection } from "@/components/common/CTASection";
import { CallCompleteModal } from "@/components/deal_scale/talkingCards/session/CallCompleteModal";
import EventsFilter from "@/components/events/EventsFilter";
import EventsGrid from "@/components/events/EventsGrid";
import Hero from "@/components/home/heros/Hero";
import HeroSessionMonitorClientWithModal from "@/components/home/heros/HeroSessionMonitorClientWithModal";
import { Separator } from "@/components/ui/separator";
import { events } from "@/data/events";
import { staticSeoMeta } from "@/utils/seo/staticSeo";
import { useState } from "react";

export default function Events() {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("all");

	const filteredEvents = events.filter((event) => {
		const matchesCategory =
			activeCategory === "all" || event.category === activeCategory;
		const matchesSearch =
			event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			event.description?.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const categories = [
		{ id: "all", name: "All Events" },
		...Array.from(new Set(events.map((event) => event.category)))
			.filter(Boolean)
			.map((category) => ({
				id: category,
				name: category.charAt(0).toUpperCase() + category.slice(1),
			})),
	];

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
				<EventsGrid events={filteredEvents} />
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
