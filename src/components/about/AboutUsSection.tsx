"use client";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

/**
 * AboutUsSection: Responsive and accessible About Us section for homepage.
 * - Supports light/dark mode
 * - Uses Tailwind for consistent styling
 * - Easily composable in any page
 */
export const AboutUsSection: React.FC = () => (
	<section className="w-full px-4 py-12 sm:px-6 lg:px-8">
		<div className="mx-auto flex max-w-screen-xl flex-col items-center gap-8 sm:flex-row">
			{/* Image Section */}
			<div className="flex justify-center p-4 sm:w-1/2">
				<div className="relative aspect-square w-64 overflow-hidden rounded-xl border border-border bg-muted sm:w-80">
					<Image
						src="https://i.imgur.com/WbQnbas.png"
						alt="About our company illustration"
						fill
						className="object-cover object-center"
						sizes="(max-width: 640px) 256px, 320px"
						priority
					/>
				</div>
			</div>
			{/* Text Section */}
			<div className="flex flex-col items-center justify-center p-4 text-center sm:w-1/2 sm:items-start sm:text-left">
				<span className="mb-2 w-fit border-primary border-b-2 px-1 font-semibold text-muted-foreground text-xs uppercase tracking-widest dark:text-gray-400">
					Our Mission
				</span>
				<h2 className="mb-4 font-bold text-3xl text-foreground sm:text-4xl">
					About <span className="text-primary">Deal Scale</span>
				</h2>
				<p className="mb-6 max-w-lg text-base text-muted-foreground dark:text-gray-300">
					Deal Scale connects growth teams with qualified buyers without the
					bottlenecks of manual timelines. Powered by AI sales automation,
					conversational nurture campaigns, and CRM-grade analytics, our revenue
					platform continuously sources, qualifies, and schedules sales-ready
					meetings so your closers can focus on winning new business.
				</p>
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<Link
						href="/about"
						className="inline-block w-fit rounded-md bg-primary px-6 py-3 font-semibold text-sm text-white shadow-lg transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						Learn More
					</Link>
					<Link
						href="/discord"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block w-fit rounded-md border border-primary px-6 py-3 font-semibold text-sm text-primary transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						Join Our Community
					</Link>
				</div>
			</div>
		</div>
	</section>
);

export default AboutUsSection;
