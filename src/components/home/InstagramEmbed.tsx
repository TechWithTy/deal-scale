"use client";

import Header from "@/components/common/Header";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

const INSTAGRAM_PROFILE_URL =
	"https://www.instagram.com/deal_scale/?utm_source=ig_embed&utm_campaign=loading";
const INSTAGRAM_EMBED_URL =
	"https://www.instagram.com/deal_scale/embed/?utm_source=ig_embed&utm_campaign=loading&include_footer=false";

type InstagramEmbedProps = {
	className?: string;
};

const InstagramEmbed = ({ className }: InstagramEmbedProps) => {
	const { resolvedTheme, theme } = useTheme();
	const isDark = (resolvedTheme || theme) === "dark";
	const [isLoading, setIsLoading] = useState(true);

	return (
		<section className={cn("px-4 py-12 sm:px-6 lg:px-8", className)}>
			<div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
				<Header
					title="The Deal Scale AI Wealth Engine in real life"
					subtitle="Watch raw moments, automation breakthroughs, client wins, and behind-the-scenes clips from the Deal Scale community. Every post shows how agents, investors, and founders are building momentum, closing more deals, and automating the parts of business that used to slow them down"
					size="lg"
					className="text-center"
				/>
				<div
					className={cn(
						"w-full overflow-hidden rounded-3xl border p-4 shadow-2xl backdrop-blur-sm transition",
						isDark
							? "border-white/15 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_60%)] shadow-blue-500/10"
							: "border-slate-200/70 bg-[rgba(255,255,255,0.92)]",
					)}
					aria-busy={isLoading}
				>
					<div
						data-testid="instagram-embed-loading"
						aria-hidden={isLoading ? "false" : "true"}
						className={cn(
							"flex w-full items-center justify-center rounded-2xl border border-white/20 border-dashed bg-white/30 p-10 transition-all duration-300 dark:border-white/10 dark:bg-white/5",
							isLoading ? "opacity-100" : "pointer-events-none opacity-0",
						)}
					>
						<div className="flex flex-col items-center gap-3 text-center text-slate-600 text-sm dark:text-slate-200">
							<div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-transparent dark:border-white/30" />
							<span>Loading the latest Deal Scale posts…</span>
						</div>
					</div>
					<iframe
						title="Deal Scale Instagram feed"
						src={INSTAGRAM_EMBED_URL}
						className="mx-auto min-h-[420px] w-full max-w-3xl rounded-2xl border-0"
						style={{
							border: 0,
							margin: "0 auto",
							maxWidth: "540px",
							minWidth: "280px",
							padding: 0,
							overflow: "hidden",
							borderRadius: "1.25rem",
							backgroundColor: isDark ? "transparent" : "transparent",
							colorScheme: isDark ? "dark" : "light",
						}}
						loading="lazy"
						onLoad={() => setIsLoading(false)}
						referrerPolicy="no-referrer-when-downgrade"
						allow="encrypted-media"
					/>
					<div className="mt-4 text-center font-medium text-black text-sm dark:text-white">
						If Instagram fails to load,{" "}
						<a
							className="underline transition hover:text-slate-700 dark:hover:text-white"
							href={INSTAGRAM_PROFILE_URL}
							target="_blank"
							rel="noreferrer noopener"
						>
							open Deal Scale on Instagram
						</a>
						.
					</div>
				</div>
			</div>
		</section>
	);
};

export default InstagramEmbed;
