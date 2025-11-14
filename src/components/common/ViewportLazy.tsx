"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ViewportLazyProps = {
	children: ReactNode;
	className?: string;
	fallback?: ReactNode;
	rootMargin?: string;
};

type ObserverRegistryEntry = {
	observer: IntersectionObserver;
	targets: Map<Element, (entry: IntersectionObserverEntry) => void>;
};

const observerRegistry = new Map<string, ObserverRegistryEntry>();

function getObserverEntry(rootMargin: string): ObserverRegistryEntry {
	let entry = observerRegistry.get(rootMargin);

	if (!entry) {
		const targets = new Map<
			Element,
			(entry: IntersectionObserverEntry) => void
		>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const callback = targets.get(entry.target);
					if (callback) {
						callback(entry);
					}
				}
			},
			{ rootMargin },
		);

		entry = { observer, targets };
		observerRegistry.set(rootMargin, entry);
	}

	return entry;
}

function subscribeToObserver(
	target: Element,
	rootMargin: string,
	callback: (entry: IntersectionObserverEntry) => void,
) {
	const entry = getObserverEntry(rootMargin);
	entry.targets.set(target, callback);
	entry.observer.observe(target);

	return () => {
		entry.observer.unobserve(target);
		entry.targets.delete(target);

		if (entry.targets.size === 0) {
			entry.observer.disconnect();
			observerRegistry.delete(rootMargin);
		}
	};
}

const DefaultFallback = ({ label }: { label?: string }) => (
	<div
		aria-hidden="true"
		className="min-h-[24rem] w-full animate-pulse rounded-3xl border border-border/40 bg-gradient-to-br from-slate-900/5 via-slate-900/10 to-slate-900/5 dark:from-white/5 dark:via-white/10 dark:to-white/5"
	>
		{label ? (
			<div className="flex h-full items-center justify-center font-semibold text-muted-foreground text-xs uppercase tracking-[0.3em]">
				{label}
			</div>
		) : null}
	</div>
);

export function ViewportLazy({
	children,
	className,
	fallback,
	rootMargin = "256px",
}: ViewportLazyProps) {
	const [isVisible, setIsVisible] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const label = useMemo(() => {
		if (typeof children === "string") {
			return children.slice(0, 24);
		}
		return undefined;
	}, [children]);

	useEffect(() => {
		if (isVisible) return;

		const node = containerRef.current;
		if (!node) return;

		if (!("IntersectionObserver" in window)) {
			setIsVisible(true);
			console.log("[ViewportLazy] revealed", label ?? containerRef.current);
			return;
		}

		const cleanup = subscribeToObserver(node, rootMargin, (entry) => {
			if (entry.isIntersecting) {
				setIsVisible(true);
			}
		});

		return () => {
			cleanup();
		};
	}, [isVisible, label, rootMargin]);

	return (
		<div ref={containerRef} className={className}>
			{isVisible ? children : (fallback ?? <DefaultFallback label={label} />)}
		</div>
	);
}
