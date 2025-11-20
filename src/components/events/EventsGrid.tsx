"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import type { NormalizedEvent } from "@/lib/events/eventSchemas";
import { motion } from "framer-motion";
import React, { Suspense } from "react";
const EventCard = React.lazy(() => import("./EventCard"));

interface EventsGridProps {
	events: NormalizedEvent[];
	isCategoryFiltered?: boolean;
}

const EventsGrid: React.FC<EventsGridProps> = ({
	events,
	isCategoryFiltered = false,
}) => {
	const upcomingEvents = events.filter(
		(event) => new Date(event.date) >= new Date(),
	);
	const pastEvents = events.filter(
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
						isCategoryFiltered && (
							<div className="my-16 text-center">
								<p className="text-black dark:text-white/70">
									No upcoming events in this category.
								</p>
							</div>
						)
					)}

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

					{upcomingEvents.length === 0 && pastEvents.length === 0 && (
						<div className="my-16 text-center">
							<p className="text-black dark:text-white/70">
								No events match your filters yet. Check back soon.
							</p>
						</div>
					)}
				</motion.div>
			</div>
		</section>
	);
};

export default EventsGrid;
