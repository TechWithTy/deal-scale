"use client";

import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import { CTASection } from "@/components/common/CTASection";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CompanyLogoDictType } from "@/data/service/slug_data/trustedCompanies";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PartnersClientProps {
	partners: CompanyLogoDictType;
}

export default function PartnersClient({ partners }: PartnersClientProps) {
	return (
		<>
			<PartnersHero />
			<TrustedByMarquee items={partners} />
			<div className="m-12 flex flex-col gap-8">
				<h2 className="text-center font-bold text-3xl">Our Partners</h2>
				<section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{Object.values(partners).map((partner) => (
						<Card
							key={partner.name}
							className="transition-shadow hover:shadow-lg"
						>
							<CardContent className="flex flex-col items-center p-6">
								<img
									src={partner.logo}
									alt={partner.name}
									className="mb-4 h-16 object-contain"
								/>
								<h3 className="mb-2 font-bold text-lg">{partner.name}</h3>
								<p className="mb-2 text-center text-muted-foreground text-sm">
									{partner.description}
								</p>
								{partner.link && (
									<a
										href={partner.link}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-2 text-primary text-xs underline"
									>
										Visit Site
									</a>
								)}
							</CardContent>
						</Card>
					))}
				</section>
			</div>
			<CTASection
				title="Partner With Deal Scale"
				description="Reach new growth opportunities by joining our partner ecosystem. Collaborate with us to drive innovation, enhance your offerings, and deliver more value to your clients."
				buttonText="Become a Partner"
				href="/contact?type=partnership"
			/>
		</>
	);
}

function PartnersHero() {
	return (
		<section className="relative overflow-hidden bg-background py-20 md:py-28">
			<div className="-z-10 absolute inset-0">
				<BlurFade>
					<div className="h-full w-full bg-gradient-to-br from-primary/10 via-focus/10 to-transparent" />
				</BlurFade>
			</div>
			<div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
				<div className="space-y-6 lg:max-w-xl">
					<span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
						Partnerships
					</span>
					<h1 className="font-bold text-4xl tracking-tight md:text-5xl">
						<AuroraText>
							Build revenue driving partnerships with DealScale
						</AuroraText>
					</h1>
					<p className="text-muted-foreground text-lg">
						Collaborate with our team to unlock new growth, expand your
						capabilities, and deliver differentiated value to your clients. We
						co-create go-to-market motions, share product insights, and ensure
						you have the support needed to win more deals together.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
						<Button asChild className="px-8 py-6 text-base">
							<Link href="/contact?type=partnership">Become a Partner</Link>
						</Button>
						<Button
							variant="outline"
							asChild
							className="border-primary/50 px-8 py-6 text-base"
						>
							<Link href="/contact?type=integration">Book a Discovery Call</Link>
						</Button>
					</div>
				</div>
				<div className="grid w-full max-w-xl gap-4 rounded-3xl border border-border/40 bg-background/60 p-8 text-left shadow-lg backdrop-blur">
					<p className="font-semibold text-primary text-sm uppercase tracking-wide">
						Partner Advantages
					</p>
					<ul className="space-y-4 text-muted-foreground text-sm">
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
							<span>
								Co-branded campaigns and demos tailored to your client
								workflows.
							</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
							<span>
								Revenue-sharing plans aligned with pipeline velocity and
								retention.
							</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
							<span>
								Shared insights from DealScale&apos;s AI platform to strengthen
								your services.
							</span>
						</li>
						<li className="flex items-start gap-3">
							<CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
							<span>Dedicated success resources for onboarding and GTM.</span>
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
