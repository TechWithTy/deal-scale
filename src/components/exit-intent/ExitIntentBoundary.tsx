"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
	ExitIntentHandler,
	ExitIntentSettings,
} from "@external/use-exit-intent";
import { useExitIntent } from "@external/use-exit-intent";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	exitIntentDebugEnabled,
	exitIntentEnabled,
	exitIntentSnoozeMs,
} from "@/lib/config/exitIntent";

interface ExitIntentBoundaryProps {
	children: React.ReactNode;
	/**
	 * Predefined copy and setting bundles keyed by the target route or feature.
	 */
	variant?: ExitIntentVariant;
	/**
	 * Optional override for the primary CTA url.
	 */
	primaryHref?: string;
}

type ExitIntentCopy = {
	headline: string;
	body: string;
	primaryCta: string;
	secondaryCta: string;
	primaryHref?: string;
};

export const EXIT_INTENT_COPY: Record<string, ExitIntentCopy> = {
	home: {
		headline: "Before you go, automate your deal flow",
		body: "Our AI agents follow up with motivated sellers within minutes. Want the playbook?",
		primaryCta: "Book a pilot strategy session",
		secondaryCta: "No thanks",
		primaryHref: "/contact-pilot?utm_source=exit-intent",
	},
	contact: {
		headline: "Need more help before you leave?",
		body: "We can prep your outreach workflow and hand it off. Want a guided walkthrough?",
		primaryCta: "Talk with onboarding",
		secondaryCta: "Maybe later",
		primaryHref: "/contact?utm_source=exit-intent",
	},
	"contact-pilot": {
		headline: "Lock in your priority pilot slot",
		body: "Finish the pilot intake and we’ll reserve a seat for your team this week.",
		primaryCta: "Reserve my pilot onboarding",
		secondaryCta: "Skip for now",
		primaryHref: "/contact-pilot?utm_source=exit-intent",
	},
	affiliate: {
		headline: "Earn commissions on every referred deal",
		body: "Grab your affiliate toolkit and start sharing the Deal Scale automation stack.",
		primaryCta: "Get affiliate resources",
		secondaryCta: "Not right now",
		primaryHref: "/affiliate?utm_source=exit-intent",
	},
	pricing: {
		headline: "Get pricing tailored to your funnel",
		body: "We’ll model ROI on your current lead volumes and send a tailored roll-out plan.",
		primaryCta: "Request a pricing blueprint",
		secondaryCta: "View pricing later",
		primaryHref: "/pricing?utm_source=exit-intent",
	},
	product: {
		headline: "See this automation in action",
		body: "We can drop a guided walkthrough into your inbox in the next few minutes.",
		primaryCta: "Send the product walkthrough",
		secondaryCta: "I’ll explore later",
		primaryHref: "/contact?utm_source=exit-intent",
	},
};

export type ExitIntentVariant = keyof typeof EXIT_INTENT_COPY;

const DEFAULT_VARIANT: ExitIntentVariant = "home";

const DEFAULT_SETTINGS: ExitIntentSettings = {
	cookie: {
		key: "deal-scale-exit-intent",
		daysToExpire: 30,
	},
	desktop: {
		triggerOnIdle: false,
		triggerOnMouseLeave: true,
		delayInSecondsToTrigger: 12,
		mouseLeaveDelayInSeconds: 4,
		useBeforeUnload: false,
	},
	mobile: {
		triggerOnIdle: true,
		delayInSecondsToTrigger: 10,
	},
};

const VARIANT_SETTINGS: Partial<
	Record<
		ExitIntentVariant,
		Pick<ExitIntentSettings, "desktop" | "mobile">
	>
> = {
	contact: {
		desktop: {
			delayInSecondsToTrigger: 8,
			mouseLeaveDelayInSeconds: 3,
		},
	},
	"contact-pilot": {
		desktop: {
			delayInSecondsToTrigger: 6,
			mouseLeaveDelayInSeconds: 2,
		},
	},
	pricing: {
		desktop: {
			delayInSecondsToTrigger: 10,
			mouseLeaveDelayInSeconds: 3,
		},
	},
	product: {
		desktop: {
			delayInSecondsToTrigger: 7,
			mouseLeaveDelayInSeconds: 2,
		},
	},
};

function mergeSettings(
	variant: ExitIntentVariant,
): ExitIntentSettings {
	const overrides = VARIANT_SETTINGS[variant] ?? {};

	return {
		cookie: { ...DEFAULT_SETTINGS.cookie },
		desktop: {
			...DEFAULT_SETTINGS.desktop,
			...(overrides.desktop ?? {}),
		},
		mobile: {
			...DEFAULT_SETTINGS.mobile,
			...(overrides.mobile ?? {}),
		},
	};
}

function EnabledExitIntentBoundary({
	children,
	variant = DEFAULT_VARIANT,
	primaryHref,
}: ExitIntentBoundaryProps) {
	const [isOpen, setIsOpen] = useState(false);
	const snoozeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const closingRef = useRef(false);
	const debugEnabled = exitIntentDebugEnabled();
	const log = useCallback(
		(event: string, details?: Record<string, unknown>) => {
			if (!debugEnabled) return;
			if (details) {
				// eslint-disable-next-line no-console
				console.info("[exit-intent]", event, details);
			} else {
				// eslint-disable-next-line no-console
				console.info("[exit-intent]", event);
			}
		},
		[debugEnabled],
	);

	const settings = useMemo(() => {
		const merged = mergeSettings(variant);
		log("settings:merge", { variant, settings: merged });
		return merged;
	}, [log, variant]);

	const {
		registerHandler,
		unsubscribe,
		resetState,
		isUnsubscribed,
	} = useExitIntent(settings);

	const copy = EXIT_INTENT_COPY[variant] ?? EXIT_INTENT_COPY[DEFAULT_VARIANT];
	const resolvedPrimaryHref = primaryHref ?? copy.primaryHref;
	const snoozeDelay = exitIntentSnoozeMs();

	useEffect(() => {
		const triggerConfig: ExitIntentHandler = {
			id: `exit-intent-${variant}-trigger`,
			context: ["onTrigger", "onDesktop", "onMobile"],
			handler: () => {
				log("trigger:open", { variant });
				setIsOpen(true);
			},
		};

		const unsubscribeConfig: ExitIntentHandler = {
			id: `exit-intent-${variant}-unsubscribe`,
			context: ["onUnsubscribe"],
			handler: () => {
				log("trigger:unsubscribe-close", { variant });
				setIsOpen(false);
			},
		};

		log("handlers:register", { variant });
		registerHandler(triggerConfig);
		registerHandler(unsubscribeConfig);

		return () => {
			log("handlers:cleanup", { variant });
		};
	}, [log, registerHandler, variant]);

	useEffect(() => {
		if (isUnsubscribed && isOpen) {
			log("state:is-unsubscribed", { variant });
			setIsOpen(false);
		}
	}, [isOpen, isUnsubscribed, log, variant]);

	useEffect(() => {
		return () => {
			if (snoozeTimeoutRef.current) {
				log("snooze:clear-timeout", { variant });
				clearTimeout(snoozeTimeoutRef.current);
			}
		};
	}, [log, variant]);

	const scheduleReset = useCallback(() => {
		if (snoozeTimeoutRef.current) {
			log("snooze:clear-existing", { variant });
			clearTimeout(snoozeTimeoutRef.current);
			snoozeTimeoutRef.current = null;
		}

		if (!Number.isFinite(snoozeDelay) || snoozeDelay <= 0) {
			log("snooze:reset-immediately", { variant });
			resetState();
			return;
		}

		log("snooze:start", { variant, delayMs: snoozeDelay });
		snoozeTimeoutRef.current = setTimeout(() => {
			log("snooze:reset-fired", { variant });
			resetState();
			snoozeTimeoutRef.current = null;
		}, snoozeDelay);
	}, [log, resetState, snoozeDelay, variant]);

	const closeWithSnooze = useCallback(() => {
		closingRef.current = true;
		log("modal:close-requested", { variant });
		unsubscribe();
		scheduleReset();
		setIsOpen(false);
	}, [log, scheduleReset, unsubscribe, variant]);

	const handleSecondary = () => {
		closeWithSnooze();
	};

	const handleKeepExploring = () => {
		closeWithSnooze();
	};

	const handleDialogOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			log("modal:open", { variant });
			setIsOpen(true);
			return;
		}

		setIsOpen(false);
		log("modal:close", { variant });

		if (closingRef.current) {
			closingRef.current = false;
			log("modal:close-with-snooze", { variant });
			return;
		}

		log("modal:close-external", { variant });
		unsubscribe();
		scheduleReset();
	};

	return (
		<div className="contents" data-testid="exit-intent-boundary">
			{children}
			<Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
				<DialogContent className="max-w-xl space-y-4">
					<DialogHeader>
						<DialogTitle>{copy.headline}</DialogTitle>
						<DialogDescription>{copy.body}</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:flex-col sm:items-stretch">
						<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
							<Button
								variant="secondary"
								onClick={handleSecondary}
								type="button"
							>
								{copy.secondaryCta}
							</Button>
							{resolvedPrimaryHref ? (
								<Button asChild type="button">
									<Link href={resolvedPrimaryHref}>
										{copy.primaryCta}
									</Link>
								</Button>
							) : (
								<Button
									type="button"
									onClick={() => setIsOpen(false)}
								>
									{copy.primaryCta}
								</Button>
							)}
						</div>
						<Button
							variant="ghost"
							type="button"
							onClick={handleKeepExploring}
						>
							Keep exploring
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export function ExitIntentBoundary(props: ExitIntentBoundaryProps) {
	if (!exitIntentEnabled()) {
		if (exitIntentDebugEnabled()) {
			// eslint-disable-next-line no-console
			console.info("[exit-intent]", "modal:disabled", {
				variant: props.variant ?? "default",
			});
		}
		return <>{props.children}</>;
	}

	return <EnabledExitIntentBoundary {...props} />;
}

export default ExitIntentBoundary;

