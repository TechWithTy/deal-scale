"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ExternalLink, BookOpen, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AwesomeRealEstatePageClient() {
	return (
		<main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
			<div className="mx-auto max-w-4xl">
				{/* Hero Section */}
				<div className="mb-12 text-center">
					<h1 className="mb-4 font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
						Awesome Real Estate Investing
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
						The ultimate curated list of real estate investing resources, tools,
						platforms, and educational content. Open-source collection
						maintained by Deal Scale for investors, agents, and wholesalers.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button asChild size="lg" className="gap-2">
							<Link
								href="https://github.com/Deal-Scale/awesome-real-estate-investing"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Image
									src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
									alt="GitHub"
									width={20}
									height={20}
									className="h-5 w-5"
								/>
								View on GitHub
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="gap-2">
							<Link
								href="https://deal-scale.github.io/awesome-real-estate-investing/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<BookOpen className="h-5 w-5" />
								View GitHub Pages
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="gap-2">
							<Link href="/discord">
								<Users className="h-5 w-5" />
								Join our Community
							</Link>
						</Button>
					</div>
				</div>

				{/* Features Grid */}
				<div className="mb-12 grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<TrendingUp className="h-6 w-6 text-primary" />
							</div>
							<CardTitle>Curated Resources</CardTitle>
							<CardDescription>
								Carefully selected tools, platforms, and educational content for
								real estate professionals.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>• Investment platforms and tools</li>
								<li>• Educational resources and courses</li>
								<li>• Market analysis tools</li>
								<li>• CRM and automation solutions</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<Image
									src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
									alt="GitHub"
									width={24}
									height={24}
									className="h-6 w-6"
								/>
							</div>
							<CardTitle>Open Source</CardTitle>
							<CardDescription>
								Community-driven list that grows with contributions from real
								estate professionals worldwide.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>• Free and open-source</li>
								<li>• Regularly updated</li>
								<li>• Community contributions welcome</li>
								<li>• Maintained by Deal Scale</li>
							</ul>
						</CardContent>
					</Card>
				</div>

				{/* What's Included Section */}
				<Card className="mb-12">
					<CardHeader>
						<CardTitle>What's Included</CardTitle>
						<CardDescription>
							This curated list includes resources across multiple categories:
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<h3 className="mb-2 font-semibold">Tools & Platforms</h3>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li>• CRM systems</li>
									<li>• Lead generation tools</li>
									<li>• Market analysis platforms</li>
									<li>• Deal analysis software</li>
								</ul>
							</div>
							<div>
								<h3 className="mb-2 font-semibold">Education & Learning</h3>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li>• Online courses</li>
									<li>• Books and publications</li>
									<li>• Podcasts and videos</li>
									<li>• Industry blogs</li>
								</ul>
							</div>
							<div>
								<h3 className="mb-2 font-semibold">Data & Research</h3>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li>• Market data sources</li>
									<li>• Property databases</li>
									<li>• Analytics tools</li>
									<li>• Research platforms</li>
								</ul>
							</div>
							<div>
								<h3 className="mb-2 font-semibold">Community & Networking</h3>
								<ul className="space-y-1 text-muted-foreground text-sm">
									<li>• Professional networks</li>
									<li>• Forums and communities</li>
									<li>• Industry events</li>
									<li>• Mentorship programs</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* CTA Section */}
				<Card className="border-primary/20 bg-primary/5">
					<CardHeader>
						<CardTitle>Explore the Full List</CardTitle>
						<CardDescription>
							Browse the complete curated list on GitHub or view the formatted
							version on GitHub Pages.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-4">
							<Button asChild variant="default" className="gap-2">
								<Link
									href="https://github.com/Deal-Scale/awesome-real-estate-investing"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Image
										src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
										alt="GitHub"
										width={16}
										height={16}
										className="h-4 w-4"
									/>
									GitHub Repository
									<ExternalLink className="ml-1 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" className="gap-2">
								<Link
									href="https://deal-scale.github.io/awesome-real-estate-investing/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<BookOpen className="h-4 w-4" />
									GitHub Pages Site
									<ExternalLink className="ml-1 h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" className="gap-2">
								<Link href="/discord">
									<Users className="h-4 w-4" />
									Join our Community
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
