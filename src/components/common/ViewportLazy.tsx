"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

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
		const targets = new Map<Element, (entry: IntersectionObserverEntry) => void>();
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

const DefaultFallback = () => (
	<div
		aria-hidden="true"
		className="min-h-[24rem] w-full animate-pulse rounded-3xl border border-border/40 bg-muted/15"
	/>
);

export function ViewportLazy({
	children,
	className,
	fallback,
	rootMargin = "256px",
}: ViewportLazyProps) {
	const [isVisible, setIsVisible] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isVisible) return;

		const node = containerRef.current;
		if (!node) return;

		if (!("IntersectionObserver" in window)) {
			setIsVisible(true);
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
	}, [isVisible, rootMargin]);

	return (
		<div ref={containerRef} className={className}>
			{isVisible ? children : fallback ?? <DefaultFallback />}
		</div>
	);
}
