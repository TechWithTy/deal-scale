"use client";
import Header from "@/components/common/Header";
import { useDeferredLoad } from "@/components/providers/useDeferredLoad";
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
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGpuOptimizations } from "@/hooks/useGpuOptimizations";
// ! Removed CompanyRenderer import, rendering images directly below.

interface TrustedByMarqueeProps {
	items: CompanyLogoDictType;
	variant?: "default" | "secondary";
}

const TrustedByMarquee: React.FC<TrustedByMarqueeProps> = ({
	items,
	variant = "default",
}) => {
	const shouldAnimate = useDeferredLoad({
		requireInteraction: false,
		timeout: 2000,
	});
	const entries: [string, CompanyPartner][] = Object.entries(items);
	const controls = useAnimation();
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const restartAnimationRef = useRef<() => void>(() => {});
	const repeatedEntries = useMemo(
		() =>
			Array.from({ length: 3 }, (_, repeatIndex) =>
				entries.map(([companyName, company]) => ({
					key: `${companyName}-${repeatIndex}`,
					companyName,
					company,
				})),
			).flat(),
		[entries],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!shouldAnimate) {
			return;
		}

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
	}, [controls, entries, shouldAnimate]);

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
			<span role="img" aria-label={`${companyName} logo`} {...baseProps}>
				<LogoImage
					companyName={companyName}
					logoUrl={company.logo}
					description={company.description}
				/>
			</span>
		);
	};

	const renderLogoWithTooltip = (
		companyName: string,
		company: CompanyPartner,
	) => (
		<Tooltip>
			<TooltipTrigger asChild>
				{renderLogoTrigger(companyName, company)}
			</TooltipTrigger>
			<TooltipContent
				side="top"
				sideOffset={12}
				className="max-w-xs text-left text-sm"
			>
				<div className="font-semibold text-foreground">{companyName}</div>
				{company.description && (
					<p className="mt-1 text-muted-foreground">{company.description}</p>
				)}
			</TooltipContent>
		</Tooltip>
	);

	const enableGpu = useGpuOptimizations();
	const gpuShellClass = enableGpu
		? "transform-gpu will-change-transform will-change-opacity"
		: "";
	const gpuDepthClass = enableGpu
		? "transform-gpu will-change-transform will-change-opacity translate-z-0"
		: "";

	return (
    <TooltipProvider delayDuration={150}>
            <div
				className={`my-5 flex w-full flex-col ${gpuShellClass}`}
				style={{ overflowClipMargin: '24px' }}
			>
				{variant === "default" && (
					<div className="mb-4 text-center">
						<Header
							title="Trusted Partners of DealScale"
							subtitle="Trusted by top-performing real estate teams and investors nationwide."
						/>
					</div>
				)}
                <div
					className={`relative w-full overflow-hidden rounded-xl p-4 text-center ${gpuShellClass} ${
						variant === "secondary"
							? "mb-2 border-2 border-primary/30 bg-background-dark/30 shadow-lg shadow-primary/10/20"
							: "border border-white/10 bg-background-dark/50"
					} backdrop-blur-sm`}
                >
					{shouldAnimate ? (
						<div
							className={`relative flex h-16 items-center overflow-hidden ${gpuDepthClass}`}
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
								{repeatedEntries.map(({ key, companyName, company }) => (
									<motion.div
										key={key}
										className="my-5 flex h-16 w-24 shrink-0 items-center justify-center"
										whileHover={{ scale: 1.05 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										{renderLogoWithTooltip(companyName, company)}
									</motion.div>
								))}
							</motion.div>
						</div>
					) : (
						<div className="relative flex flex-wrap justify-center gap-6 rounded-xl border border-white/5 bg-gradient-to-br from-slate-900/10 via-slate-900/5 to-slate-900/10 p-6 dark:from-white/5 dark:via-white/10 dark:to-white/5">
							{entries.slice(0, 8).map(([companyName, company]) => (
								<div
									key={companyName}
									className="flex h-16 w-24 items-center justify-center rounded-lg border border-white/10 bg-white/70 text-black dark:bg-white/10"
								>
									{renderLogoWithTooltip(companyName, company)}
								</div>
							))}
							<div className="absolute inset-x-0 top-2 flex justify-center">
								<span className="rounded-full bg-black/60 px-3 py-1 font-semibold text-white/80 text-xs uppercase tracking-[0.3em] dark:bg-white/20">
									Tap or scroll to animate
								</span>
							</div>
						</div>
					)}
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
				{companyName.charAt(0).toUpperCase()}
			</div>
		);
	}

	return (
		<Image
			src={logoUrl}
			alt={
				description ? `${companyName} - ${description}` : `${companyName} logo`
			}
			width={56}
			height={56}
			sizes="56px"
			className="h-14 w-14 rounded-md bg-white object-contain p-1"
			onError={() => setImgError(true)}
		/>
	);
};

export default TrustedByMarquee;
