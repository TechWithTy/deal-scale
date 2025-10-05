"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ViewportLazyProps = {
        children: ReactNode;
        rootMargin?: string;
        fallback?: ReactNode;
        /**
         * * Optional minimum height applied while waiting for the section to enter the viewport.
         * * Accepts a number (in pixels) or any valid CSS length value.
         */
        minHeight?: number | string;
        /**
         * * Keep the wrapped content mounted even before it becomes visible.
         * ! Useful for components that rely on layout effects on mount.
         */
        keepMounted?: boolean;
};

export function ViewportLazy({
        children,
        rootMargin = "256px",
        fallback,
        minHeight,
        keepMounted = false,
}: ViewportLazyProps) {
        const [isVisible, setIsVisible] = useState(false);
        const containerRef = useRef<HTMLDivElement | null>(null);

        const placeholderStyle = useMemo<CSSProperties | undefined>(() => {
                if (isVisible || !minHeight) return undefined;

                const value = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
                return { minHeight: value };
        }, [isVisible, minHeight]);

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

        const shouldRenderChildren = keepMounted || isVisible;

        return (
                <div
                        ref={containerRef}
                        style={placeholderStyle}
                        aria-busy={!isVisible}
                        data-visible={isVisible}
                >
                        {shouldRenderChildren ? children : fallback ?? null}
                </div>
        );
}
