"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ViewportLazyProps = {
	children: ReactNode;
	rootMargin?: string;
};

export function ViewportLazy({
	children,
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

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
					}
				});
			},
			{ rootMargin },
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [isVisible, rootMargin]);

	return <div ref={containerRef}>{isVisible ? children : null}</div>;
}
