"use client";
import Header from "@/components/common/Header";
import type {
	CompanyLogoDictType,
	CompanyPartner,
} from "@/types/service/trusted-companies";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useEffect, useRef, useState } from "react";
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (containerRef.current && contentRef.current) {
			const updateWidths = () => {
				const contentWidth = contentRef.current?.offsetWidth;
				const visibleWidth = contentWidth / 3; // Split into thirds for seamless loop
				const duration = visibleWidth / 50; // 50px per second

				controls.start({
					x: [-visibleWidth, 0], // Animate one third of total width
					transition: {
						duration,
						ease: "linear",
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "loop",
					},
				});
			};

			// Use ResizeObserver for better performance
			const resizeObserver = new ResizeObserver(updateWidths);
			resizeObserver.observe(contentRef.current);

			// Initial setup
			updateWidths();

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, [controls, entries]);

	// * Render company logos with lazy loading, fallback, and support for both public and remote URLs

	// * Render company logos with optional link wrapping
	const renderLogo = (
		companyName: string,
		company: CompanyPartner,
		key: string,
	) => {
		const logo = (
			<LogoImage
				companyName={companyName}
				logoUrl={company.logo}
				description={company.description}
			/>
		);
		return company.link ? (
			<Link
				href={company.link}
				target="_blank"
				rel="noopener noreferrer"
				key={key}
				className="focus:outline-none"
				tabIndex={0}
				aria-label={`Visit ${companyName}`}
			>
				{logo}
			</Link>
		) : (
			<React.Fragment key={key}>{logo}</React.Fragment>
		);
	};

	return (
		<div className="my-5 flex w-full flex-col">
			{variant === "default" && (
				<div className="mb-4 text-center">
					<Header title="Beta Testers" subtitle="" />
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
				>
					<motion.div
						ref={contentRef}
						className="flex items-center gap-8 whitespace-nowrap"
						style={{ width: "max-content" }}
						animate={controls}
					>
						{entries.map(([companyName, company]) => (
							<motion.div
								key={`${companyName}`}
								className="my-5 flex h-16 w-24 shrink-0 items-center justify-center"
								whileHover={{ scale: 1.05 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								{renderLogo(companyName, company, `${companyName}`)}
							</motion.div>
						))}
						{entries.map(([companyName, company]) => (
							<motion.div
								key={`${companyName}-2`}
								className="my-5 flex h-16 w-24 shrink-0 items-center justify-center"
								whileHover={{ scale: 1.05 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								{renderLogo(companyName, company, `${companyName}-2`)}
							</motion.div>
						))}
						{entries.map(([companyName, company]) => (
							<motion.div
								key={`${companyName}-3`}
								className="my-5 flex h-16 w-24 shrink-0 items-center justify-center"
								whileHover={{ scale: 1.05 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								{renderLogo(companyName, company, `${companyName}-3`)}
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</div>
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
