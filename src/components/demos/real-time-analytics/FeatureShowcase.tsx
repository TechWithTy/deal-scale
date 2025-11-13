"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";

import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { ShinyButton } from "@/components/ui/shiny-button";
import { cn } from "@/lib/utils";
import { FeaturePanel } from "./FeaturePanel";

import type { RealTimeFeature } from "./feature-config";

export type FeatureShowcaseProps = {
	features: RealTimeFeature[];
};

const indicatorPalette = [
	{ from: "rgba(96,165,250,0.95)", to: "rgba(37,99,235,0.95)" },
	{ from: "rgba(74,222,128,0.95)", to: "rgba(22,163,74,0.95)" },
	{ from: "rgba(192,132,252,0.95)", to: "rgba(147,51,234,0.95)" },
] as const;

const ROI_CALCULATOR_URL =
	"https://app.dealscale.io/external-tools/roi-calculator";

/**
 * FeatureShowcase renders the Macbook demo with contextual copy and metrics.
 */
export function FeatureShowcase({
	features,
}: FeatureShowcaseProps): JSX.Element | null {
	const stableFeatures = useMemo(() => features.filter(Boolean), [features]);
	const featureIds = useMemo(
		() => stableFeatures.map((feature) => feature.id),
		[stableFeatures],
	);

	if (stableFeatures.length === 0) {
		return null;
	}

	const fallbackId = stableFeatures[0]?.id ?? "";
	const generatedId = useId();
	const [activeId, setActiveId] = useState(fallbackId);
	const interactionRef = useRef(false);
	const lastManualSelectionRef = useRef(Date.now());

	const activeFeature =
		stableFeatures.find((feature) => feature.id === activeId) ??
		stableFeatures[0];

	const tablistId = `${generatedId}-tablist`;
	const activeTabId = `${generatedId}-tab-${activeFeature.id}`;
	const activePanelId = `${generatedId}-panel-${activeFeature.id}`;

	const handleOpenRoi = useCallback(() => {
		if (typeof window !== "undefined") {
			window.open(ROI_CALCULATOR_URL, "_blank", "noopener,noreferrer");
		}
	}, []);

	useEffect(() => {
		if (featureIds.length <= 1) {
			return;
		}

		const interval = setInterval(() => {
			if (interactionRef.current) {
				return;
			}

			const now = Date.now();
			if (now - lastManualSelectionRef.current < 9000) {
				return;
			}

			setActiveId((currentId) => {
				const currentIndex = featureIds.indexOf(currentId);
				const nextIndex =
					currentIndex === -1 ? 0 : (currentIndex + 1) % featureIds.length;
				const nextId = featureIds[nextIndex] ?? fallbackId;
				return nextId;
			});
		}, 9000);

		return () => clearInterval(interval);
	}, [featureIds, fallbackId]);

	const handleManualSelection = (featureId: string) => {
		setActiveId(featureId);
		lastManualSelectionRef.current = Date.now();
	};

	const handleInteractionStart = () => {
		interactionRef.current = true;
	};

	const handleInteractionEnd = () => {
		interactionRef.current = false;
	};

	return (
		<section
			className="relative isolate flex flex-col items-center gap-10 rounded-4xl border border-border/50 bg-background/80 px-6 py-12 text-foreground shadow-[0_30px_120px_-60px_rgba(59,130,246,0.45)] backdrop-blur-xl sm:gap-12 md:px-12 md:py-16"
			data-testid="real-time-analytics-demo"
			onMouseEnter={handleInteractionStart}
			onMouseLeave={handleInteractionEnd}
			onTouchStart={handleInteractionStart}
			onTouchEnd={handleInteractionEnd}
		>
			<span className="sr-only">{activeFeature.label}</span>
			<div className="relative mx-auto flex w-full max-w-3xl items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),transparent_55%)] px-2 py-8 sm:px-4">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeFeature.id}
						className="w-full"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -24 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
					>
						<div data-testid="realtime-analytics-chart">
							<MacbookScroll
								src={activeFeature.media.src}
								title={activeFeature.media.alt}
								alt={activeFeature.media.alt}
								showGradient
								variant="embedded"
								className="max-w-full"
								badge={
									<span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 font-medium text-blue-900 text-xs uppercase tracking-wide dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-100">
										Live demo
									</span>
								}
							/>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			<div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center">
				<p className="sr-only">{activeFeature.eyebrow}</p>
				<p className="sr-only">{activeFeature.description}</p>

				<div
					id={tablistId}
					role="tablist"
					aria-label="Real-time analytics feature toggles"
					className="flex flex-wrap justify-center gap-2"
				>
					{stableFeatures.map((feature, index) => {
						const tabId = `${generatedId}-tab-${feature.id}`;
						const panelId = `${generatedId}-panel-${feature.id}`;
						const isSelected = feature.id === activeFeature.id;
						const palette = indicatorPalette[index % indicatorPalette.length];
						return (
							<button
								key={feature.id}
								id={tabId}
								type="button"
								role="tab"
								aria-selected={isSelected}
								aria-controls={panelId}
								data-selected={isSelected}
								className={cn(
									"group inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-sm transition",
									isSelected
										? "border-blue-500 bg-blue-500/10 text-blue-900 shadow-[0_8px_24px_-16px_rgba(59,130,246,0.75)] dark:text-blue-100"
										: "border-border/70 bg-background/50 text-muted-foreground hover:border-blue-400/70 hover:bg-blue-500/10 hover:text-blue-900 dark:hover:border-blue-400/60 dark:hover:text-blue-100",
								)}
								onClick={() => {
									handleManualSelection(feature.id);
								}}
							>
								<span className="relative inline-flex h-3 w-3 items-center justify-center">
									{isSelected ? (
										<motion.span
											className="absolute inset-0 rounded-full"
											style={{
												backgroundImage: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
											}}
											animate={{
												scale: [1.05, 1.7, 1.05],
												opacity: [0.45, 0, 0.45],
											}}
											transition={{
												duration: 2.4,
												repeat: Number.POSITIVE_INFINITY,
												ease: "easeOut",
											}}
										/>
									) : null}
									<motion.span
										className="relative inline-flex h-2.5 w-2.5 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.45)]"
										style={{
											backgroundImage: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
										}}
										animate={
											isSelected
												? { scale: [1, 1.35, 1], opacity: [0.9, 1, 0.9] }
												: { scale: 1, opacity: 0.55 }
										}
										transition={{
											duration: isSelected ? 1.6 : 0.3,
											repeat: isSelected ? Number.POSITIVE_INFINITY : 0,
											repeatType: "mirror",
											ease: "easeInOut",
										}}
									/>
								</span>
								<span className="font-semibold text-xs uppercase tracking-wide sm:text-sm">
									{feature.label}
								</span>
							</button>
						);
					})}
				</div>
				<div className="flex items-center justify-center pt-4">
					<ShinyButton
						onClick={handleOpenRoi}
						primaryColor="rgba(59,130,246,0.9)"
						className="border-blue-500/60 text-blue-900 dark:text-blue-100"
						aria-label="Open ROI calculator in a new tab"
					>
						Get ROI
					</ShinyButton>
				</div>
			</div>

			<AnimatePresence mode="wait">
				<FeaturePanel
					key={activeFeature.id}
					feature={activeFeature}
					panelId={activePanelId}
					tabId={activeTabId}
					activeFeatureId={activeFeature.id}
				/>
			</AnimatePresence>
		</section>
	);
}
