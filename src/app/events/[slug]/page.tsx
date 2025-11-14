import { CTASection } from "@/components/common/CTASection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import type { NormalizedEvent } from "@/lib/events/eventSchemas";
import { fetchEvents } from "@/lib/events/fetchEvents";
import { type EventPageParams, resolveEventParams } from "@/lib/events/params";
import { buildEventSchema, buildEventUrl } from "@/lib/events/schemaBuilders";
import { formatDate } from "@/utils/date-formatter";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import {
	ArrowRight,
	Calendar,
	Clock,
	ExternalLink,
	Globe2,
	MapPin,
	Monitor,
	Share2,
	ShieldCheck,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 1800;
// ! Keep this value in sync with EVENTS_REVALIDATE_SECONDS in src/lib/events/constants.ts

async function getEventBySlug(
	slug: string,
): Promise<NormalizedEvent | undefined> {
	const events = await fetchEvents();
	return events.find((event) => event.slug === slug);
}

function handleResolveParamsError(error: unknown): never {
	console.warn("[events] Unable to resolve route params", error);
	notFound();
}

async function resolveSlugOrNotFound(
	params: Promise<EventPageParams>,
): Promise<string> {
	try {
		const resolved = await resolveEventParams(params);
		return resolved.slug;
	} catch (error) {
		return handleResolveParamsError(error);
	}
}

async function loadEventOrNotFound(slug: string): Promise<NormalizedEvent> {
	const event = await getEventBySlug(slug);

	if (!event) {
		console.warn(`[events] Missing event for slug: ${slug}`);
		notFound();
	}

	return event;
}

export async function generateStaticParams() {
	const events = await fetchEvents();
	return events.map((event) => ({ slug: event.slug }));
}

type EventPageProps = {
	params: Promise<EventPageParams>;
};

export async function generateMetadata({
	params,
}: EventPageProps): Promise<Metadata> {
	const slug = await resolveSlugOrNotFound(params);
	const event = await loadEventOrNotFound(slug);

	const canonical = buildEventUrl(event.slug);
	return {
		title: `${event.title} | DealScale Events`,
		description: event.description,
		alternates: {
			canonical,
		},
		openGraph: {
			title: `${event.title} | DealScale Events`,
			description: event.description,
			url: canonical,
			type: "website",
			images: event.thumbnailImage
				? [{ url: event.thumbnailImage, alt: event.title }]
				: undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: `${event.title} | DealScale Events`,
			description: event.description,
			images: event.thumbnailImage ? [event.thumbnailImage] : undefined,
		},
	};
}

export default async function EventDetailPage({ params }: EventPageProps) {
	const slug = await resolveSlugOrNotFound(params);
	const event = await loadEventOrNotFound(slug);

	const eventSchema = buildEventSchema(event);
	const isPastEvent = new Date(event.date) < new Date();
	const accessType = event.accessType ?? "external";
	const attendanceType = event.attendanceType ?? "in-person";
	const accessBadge =
		accessType === "external"
			? { label: "External Event", icon: Globe2 }
			: { label: "Internal Event", icon: ShieldCheck };
	const attendanceBadge = {
		"in-person": { label: "In Person", icon: Users },
		webinar: { label: "Webinar", icon: Monitor },
		hybrid: { label: "Hybrid", icon: Share2 },
	}[attendanceType];
	const AccessBadgeIcon = accessBadge.icon;
	const AttendanceBadgeIcon = attendanceBadge.icon;
	const registrationHref =
		accessType === "external"
			? event.externalUrl ?? buildEventUrl(event.slug)
			: event.internalPath ?? buildEventUrl(event.slug);
	const RegistrationIcon =
		accessType === "external" ? ExternalLink : ArrowRight;
	const registrationLinkProps =
		accessType === "external"
			? { target: "_blank", rel: "noopener noreferrer" as const }
			: {};

	return (
		<div className="container py-12">
			<SchemaInjector schema={eventSchema} />
			<div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
				<article className="space-y-8">
					<header className="space-y-6">
						<div className="flex flex-wrap items-center gap-3">
							<Badge variant="outline">{event.category}</Badge>
							{isPastEvent ? (
								<Badge variant="destructive">Past Event</Badge>
							) : (
								<Badge variant="default">Upcoming</Badge>
							)}
							<Badge variant="secondary" className="gap-1.5">
								<AccessBadgeIcon className="h-3.5 w-3.5" aria-hidden />
								{accessBadge.label}
							</Badge>
							<Badge variant="outline" className="gap-1.5">
								<AttendanceBadgeIcon
									className="h-3.5 w-3.5"
									aria-hidden
								/>
								{attendanceBadge.label}
							</Badge>
						</div>
						<h1 className="font-heading text-3xl md:text-4xl">{event.title}</h1>
						<p className="text-lg text-muted-foreground leading-relaxed">
							{event.description}
						</p>
						<div className="flex flex-wrap gap-6 text-muted-foreground text-sm">
							<span className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								{formatDate(event.date)}
							</span>
							<span className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								{event.time}
							</span>
							<span className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								{event.location}
							</span>
						</div>
					</header>
					<Separator />
					{event.thumbnailImage && (
						<div className="relative aspect-video overflow-hidden rounded-xl">
							<Image
								src={event.thumbnailImage}
								alt={event.title}
								fill
								className="object-cover"
								priority
							/>
						</div>
					)}
					<GlassCard className="space-y-4 p-6">
						<h2 className="font-semibold text-xl">Why attend?</h2>
						<p className="text-muted-foreground leading-relaxed">
							{event.description}
						</p>
						<Button asChild size="lg">
							<Link
								href={registrationHref}
								{...registrationLinkProps}
							>
								Register now
								<RegistrationIcon className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</GlassCard>
				</article>
				<aside className="space-y-6">
					<GlassCard className="space-y-4 p-6">
						<h2 className="font-semibold text-lg">Event details</h2>
						<ul className="space-y-3 text-muted-foreground text-sm">
							<li className="flex items-start gap-2">
								<Calendar className="mt-0.5 h-4 w-4" />
								<span>{formatDate(event.date)}</span>
							</li>
							<li className="flex items-start gap-2">
								<Clock className="mt-0.5 h-4 w-4" />
								<span>{event.time}</span>
							</li>
							<li className="flex items-start gap-2">
								<MapPin className="mt-0.5 h-4 w-4" />
								<span>{event.location}</span>
							</li>
						</ul>
						<Button asChild variant="secondary" className="w-full">
							<Link
								href={registrationHref}
								{...registrationLinkProps}
							>
								Visit event site
								<RegistrationIcon className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</GlassCard>
					<CTASection
						title="Looking for more DealScale events?"
						description="Join our community of operators and investors to stay notified about upcoming sessions."
						buttonText="View all events"
						href="/events"
					/>
				</aside>
			</div>
		</div>
	);
}
