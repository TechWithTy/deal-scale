import { CTASection } from "@/components/common/CTASection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { fetchEvents } from "@/lib/events/fetchEvents";
import type { NormalizedEvent } from "@/lib/events/eventSchemas";
import { buildEventSchema, buildEventUrl } from "@/lib/events/schemaBuilders";
import { SchemaInjector } from "@/utils/seo/schema/SchemaInjector";
import { formatDate } from "@/utils/date-formatter";
import type { Metadata, PageProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react";

export const revalidate = 1800;
// ! Keep this value in sync with EVENTS_REVALIDATE_SECONDS in src/lib/events/constants.ts

async function getEventBySlug(slug: string): Promise<NormalizedEvent | undefined> {
        const events = await fetchEvents();
        return events.find((event) => event.slug === slug);
}

export async function generateStaticParams() {
        const events = await fetchEvents();
        return events.map((event) => ({ slug: event.slug }));
}

type EventPageProps = PageProps<{ slug: string }>;

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
        const resolvedParams = params ? await params : undefined;
        if (!resolvedParams?.slug) {
                notFound();
        }

        const event = await getEventBySlug(resolvedParams.slug);
        if (!event) {
                notFound();
        }

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
                        type: "event",
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
        const resolvedParams = params ? await params : undefined;
        if (!resolvedParams?.slug) {
                notFound();
        }

        const event = await getEventBySlug(resolvedParams.slug);
        if (!event) {
                notFound();
        }

        const eventSchema = buildEventSchema(event);
        const isPastEvent = new Date(event.date) < new Date();

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
                                                </div>
                                                <h1 className="font-heading text-3xl md:text-4xl">
                                                        {event.title}
                                                </h1>
                                                <p className="text-muted-foreground text-lg leading-relaxed">
                                                        {event.description}
                                                </p>
                                                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
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
                                                <h2 className="text-xl font-semibold">Why attend?</h2>
                                                <p className="text-muted-foreground leading-relaxed">
                                                        {event.description}
                                                </p>
                                                <Button asChild size="lg">
                                                        <Link href={event.externalUrl} target="_blank" rel="noopener noreferrer">
                                                                Register now
                                                                <ExternalLink className="ml-2 h-4 w-4" />
                                                        </Link>
                                                </Button>
                                        </GlassCard>
                                </article>
                                <aside className="space-y-6">
                                        <GlassCard className="space-y-4 p-6">
                                                <h2 className="text-lg font-semibold">Event details</h2>
                                                <ul className="space-y-3 text-sm text-muted-foreground">
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
                                                        <Link href={event.externalUrl} target="_blank" rel="noopener noreferrer">
                                                                Visit event site
                                                                <ExternalLink className="ml-2 h-4 w-4" />
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
