"use client";
import Header from "@/components/common/Header";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
	CompanyLogoDictType,
	CompanyPartner,
} from "@/types/service/trusted-companies";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
// ! Removed CompanyRenderer import, rendering images directly below.

interface TrustedByMarqueeProps {
	items: CompanyLogoDictType;
	variant?: "default" | "secondary";
}

const TrustedByMarquee: React.FC<TrustedByMarqueeProps> = ({
	items,
	variant = "default",
}) => {
	const entries: [string, CompanyPartner][] = Object.entries(items);
	const controls = useAnimation();
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const restartAnimationRef = useRef<() => void>(() => {});
	const repeatedEntries = useMemo(
		() => [...entries, ...entries, ...entries],
		[entries],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (containerRef.current && contentRef.current) {
			const startMarquee = () => {
				const contentWidth = contentRef.current?.offsetWidth ?? 0;
				const visibleWidth = contentWidth / 3;
				const duration = visibleWidth / 30;

				controls.start({
					x: [-visibleWidth, 0],
					transition: {
						duration,
						ease: "linear",
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "loop",
					},
				});
			};

			restartAnimationRef.current = startMarquee;

			const resizeObserver = new ResizeObserver(() => startMarquee());
			resizeObserver.observe(contentRef.current);

			startMarquee();

			return () => {
				resizeObserver.disconnect();
				controls.stop();
			};
		}
	}, [controls, entries]);

	// * Render company logos with lazy loading, fallback, and support for both public and remote URLs

	// * Render company logos with optional link wrapping
	const renderLogoTrigger = (companyName: string, company: CompanyPartner) => {
		const baseProps = {
			className:
				"flex h-full w-full items-center justify-center focus:outline-none",
		};

		if (company.link) {
			return (
				<Link
					href={company.link}
					target="_blank"
					rel="noopener noreferrer"
					tabIndex={0}
					aria-label={`Visit ${companyName}`}
					{...baseProps}
				>
					<LogoImage
						companyName={companyName}
						logoUrl={company.logo}
						description={company.description}
					/>
				</Link>
			);
		}

		return (
			<span
				tabIndex={0}
				role="img"
				aria-label={`${companyName} logo`}
				{...baseProps}
			>
				<LogoImage
					companyName={companyName}
					logoUrl={company.logo}
					description={company.description}
				/>
			</span>
		);
	};

	return (
		<TooltipProvider delayDuration={150}>
			<div className="my-5 flex w-full flex-col">
				{variant === "default" && (
					<div className="mb-4 text-center">
						<Header
							title="Trusted Partners of DealScale"
							subtitle="Trusted by top-performing real estate teams and investors nationwide."
						/>
					</div>
				)}
				<div
					className={`relative w-full overflow-hidden rounded-xl p-4 text-center ${
						variant === "secondary"
							? "mb-2 border-2 border-primary/30 bg-background-dark/30 shadow-lg shadow-primary/10/20"
							: "border border-white/10 bg-background-dark/50"
					} backdrop-blur-sm`}
				>
					<div
						className="relative flex h-16 items-center overflow-hidden"
						ref={containerRef}
						onMouseEnter={() => controls.stop()}
						onMouseLeave={() => restartAnimationRef.current()}
					>
						<motion.div
							ref={contentRef}
							className="flex items-center gap-8 whitespace-nowrap"
							style={{ width: "max-content" }}
							animate={controls}
						>
							{repeatedEntries.map(([companyName, company], index) => (
								<motion.div
									key={`${companyName}-${index}`}
									className="my-5 flex h-16 w-24 shrink-0 items-center justify-center"
									whileHover={{ scale: 1.05 }}
									transition={{ type: "spring", stiffness: 300 }}
								>
									<Tooltip>
										<TooltipTrigger asChild>
											{renderLogoTrigger(companyName, company)}
										</TooltipTrigger>
										<TooltipContent
											side="top"
											sideOffset={12}
											className="max-w-xs text-left text-sm"
										>
											<div className="font-semibold text-foreground">
												{companyName}
											</div>
											{company.description && (
												<p className="mt-1 text-muted-foreground">
													{company.description}
												</p>
											)}
										</TooltipContent>
									</Tooltip>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
};

// * LogoImage component: Handles lazy loading, fallback, and alt text
interface LogoImageProps {
	companyName: string;
	logoUrl: string;
	description?: string;
}

const LogoImage: React.FC<LogoImageProps> = ({
	companyName,
	logoUrl,
	description,
}) => {
	const [imgError, setImgError] = useState(false);

	if (!logoUrl || imgError) {
		return (
			<div
				className="flex h-14 w-14 items-center justify-center rounded bg-gray-100 text-gray-400 text-xs dark:bg-gray-800"
				title={companyName}
			>
				{/* ! Fallback: First letter of company */}
				{companyName.charAt(0).toUpperCase()}
			</div>
		);
	}

	// * Use next/image for optimization, fallback to <img> if needed
	// ! next/image requires absolute URLs or public/ relative paths
	return (
		<img
			src={logoUrl}
			alt={`${companyName} Logo`}
			loading="lazy"
			className="h-14 w-14 object-contain"
			onError={() => setImgError(true)}
			style={{ background: "white", borderRadius: 8 }}
		/>
	);
};

export default TrustedByMarquee;
