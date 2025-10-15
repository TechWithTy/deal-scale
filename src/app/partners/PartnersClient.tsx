"use client";

import TrustedByMarquee from "@/components/contact/utils/TrustedByScroller";
import HeroSessionMonitor from "@/components/home/heros/HeroSessionMonitor";
import { Card, CardContent } from "@/components/ui/card";
import type { CompanyLogoDictType } from "@/data/service/slug_data/trustedCompanies";
import { CTASection } from "../../components/common/CTASection";

interface PartnersClientProps {
        partners: CompanyLogoDictType;
}

export default function PartnersClient({ partners }: PartnersClientProps) {
        return (
                <>
                        <HeroSessionMonitor
				headline="Our Partners"
				subheadline=""
				highlight="Partnerships"
			/>
                        <TrustedByMarquee items={partners} />
                        <div className="m-12 flex flex-col gap-8">
                                <h1 className="text-center font-bold text-3xl">Our Partners</h1>
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
