"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { eventCategories } from "@/data/events";
import { useCategoryFilter } from "@/hooks/use-category-filter";
import type { Event } from "@/types/event";
import { motion } from "framer-motion";
import React, { Suspense } from "react";
const EventCard = React.lazy(() => import("./EventCard"));

interface EventsGridProps {
	events: Event[];
}

const EventsGrid: React.FC<EventsGridProps> = ({ events }) => {
	const { activeCategory, CategoryFilter } = useCategoryFilter(eventCategories);

	const filteredEvents =
		activeCategory === "all"
			? events
			: events.filter((event) => event.category === activeCategory);

	const upcomingEvents = filteredEvents.filter(
		(event) => new Date(event.date) >= new Date(),
	);
	const pastEvents = filteredEvents.filter(
		(event) => new Date(event.date) < new Date(),
	);

	return (
		<section className="py-12 md:py-16">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Upcoming Events */}
					{upcomingEvents.length > 0 ? (
						<>
							<SectionHeading
								title="Upcoming Events"
								centered
								description="Don't miss upcoming events. Register now to secure your spot."
							/>

							<Suspense
								fallback={<div className="mb-16">Loading events...</div>}
							>
								<div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									{upcomingEvents.map((event, index) => (
										<EventCard key={event.id} event={event} index={index} />
									))}
								</div>
							</Suspense>
						</>
					) : (
						activeCategory !== "all" && (
							<div className="my-16 text-center">
								<p className="text-black dark:text-white/70">
									No upcoming events in this category.
								</p>
							</div>
						)
					)}

					{/* Past Events */}
					{pastEvents.length > 0 && (
						<>
							<SectionHeading
								title="Past Events"
								centered
								description="Browse previous events and conferences."
							/>

							<Suspense fallback={<div>Loading events...</div>}>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									{pastEvents.map((event, index) => (
										<EventCard key={event.id} event={event} index={index} />
									))}
								</div>
							</Suspense>
						</>
					)}

					{/* No events message */}
					{upcomingEvents.length === 0 && pastEvents.length === 0 && (
						<div className="my-16 text-center">
							<p className="text-black dark:text-white/70">
								No events found in this category.
							</p>
						</div>
					)}
				</motion.div>
			</div>
		</section>
	);
};

export default EventsGrid;
