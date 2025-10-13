"use client";

import SafeMotionDiv from "@/components/ui/SafeMotionDiv";
import SplineModel from "@/components/ui/spline-model";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import * as React from "react";

export interface HeroOfferingProps {
	image?: string | StaticImageData | React.ReactNode;
	imageAlt?: string;
	className?: string;
}

/**
 * HeroOffering: animated product/visual/3D offering for Hero layouts.
 * - If image is provided (string or StaticImageData), animates it in.
 * - If image is a ReactNode, renders as-is (animated).
 * - Otherwise, falls back to SplineModel.
 */
export const HeroOffering: React.FC<HeroOfferingProps> = ({
        image,
        imageAlt,
        className,
}) => {

        const isImageSrc = (img: unknown): img is string | StaticImageData =>
                typeof img === "string" ||
                (typeof img === "object" && img !== null && "src" in img);

        const containerClassName = React.useMemo(
                () =>
                        cn(
                                "mx-auto flex flex-col items-center justify-center self-center px-4 py-6 sm:min-h-[400px] sm:px-6 md:min-h-[460px] md:flex-row md:py-0 md:w-full lg:min-h-[520px] lg:px-8",
                                "w-fit max-w-full md:max-w-none",
                                "max-w-[18rem] sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl",
                                className,
                        ),
                [className],
        );

        const mediaWrapperClassName = React.useMemo(
                () =>
                        cn(
                                "relative mx-auto flex h-full w-fit max-w-full flex-col items-center justify-center",
                                "max-w-[18rem] sm:max-w-md md:w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl",
                        ),
                [],
        );

        const imageWrapperClassName = React.useMemo(
                () =>
                        cn(
                                "flex w-fit max-w-full items-center justify-center p-0",
                                "max-w-[16rem] sm:max-w-md md:w-full md:max-w-lg",
                        ),
                [],
        );

        const imageClassName = React.useMemo(
                () =>
                        cn(
                                "h-auto w-auto max-w-[14rem] rounded-xl object-contain",
                                "sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl",
                        ),
                [],
        );

        const containerRef = React.useRef<HTMLDivElement | null>(null);
        const mediaWrapperRef = React.useRef<HTMLDivElement | null>(null);
        const imageWrapperRef = React.useRef<HTMLDivElement | null>(null);
        const imageElementRef = React.useRef<HTMLImageElement | null>(null);

        React.useEffect(() => {
                if (process.env.NODE_ENV === "production") {
                        return undefined;
                }

                const element = containerRef.current;

                if (!element) {
                        return undefined;
                }

                const logBounds = () => {
                        const getMetrics = (node: HTMLElement | null) => {
                                if (!node) {
                                        return undefined;
                                }

                                const rect = node.getBoundingClientRect();
                                const computedStyles =
                                        typeof window === "undefined"
                                                ? undefined
                                                : window.getComputedStyle(node);

                                return {
                                        className: node.className,
                                        height: Math.round(rect.height),
                                        width: Math.round(rect.width),
                                        offsetWidth: Math.round(node.offsetWidth),
                                        scrollWidth: Math.round(node.scrollWidth),
                                        computed: computedStyles
                                                ? {
                                                          boxSizing: computedStyles.boxSizing,
                                                          display: computedStyles.display,
                                                          marginInline: `${computedStyles.marginLeft} ${computedStyles.marginRight}`,
                                                          maxWidth: computedStyles.maxWidth,
                                                          minWidth: computedStyles.minWidth,
                                                          paddingInline: `${computedStyles.paddingLeft} ${computedStyles.paddingRight}`,
                                                          position: computedStyles.position,
                                                  }
                                                : undefined,
                                };
                        };

                        const viewportWidth =
                                typeof window === "undefined"
                                        ? undefined
                                        : Math.round(window.innerWidth);

                        const parentChain = (() => {
                                if (typeof window === "undefined") {
                                        return undefined;
                                }

                                const parents: Array<{
                                        className: string;
                                        nodeName: string;
                                        width: number;
                                        maxWidth: string | undefined;
                                        paddingInline: string | undefined;
                                }> = [];

                                let current: HTMLElement | null = element.parentElement;

                                while (current) {
                                        const rect = current.getBoundingClientRect();
                                        const computedStyles = window.getComputedStyle(current);

                                        parents.push({
                                                className: current.className,
                                                nodeName: current.nodeName,
                                                width: Math.round(rect.width),
                                                maxWidth: computedStyles.maxWidth || undefined,
                                                paddingInline: computedStyles
                                                        ? `${computedStyles.paddingLeft} ${computedStyles.paddingRight}`
                                                        : undefined,
                                        });

                                        if (current.nodeName === "BODY") {
                                                break;
                                        }

                                        current = current.parentElement;
                                }

                                return parents;
                        })();

                        console.debug("[HeroOffering] layout metrics", {
                                container: getMetrics(element),
                                image: getMetrics(imageElementRef.current),
                                imageWrapper: getMetrics(imageWrapperRef.current),
                                mediaWrapper: getMetrics(mediaWrapperRef.current),
                                parentChain,
                                timestamp: new Date().toISOString(),
                                viewportWidth,
                        });
                };

                logBounds();

                if (typeof window === "undefined") {
                        return undefined;
                }

                const ResizeObserverCtor = window.ResizeObserver;

                if (typeof ResizeObserverCtor === "function") {
                        const observer = new ResizeObserverCtor(() => {
                                logBounds();
                        });

                        observer.observe(element);

                        return () => {
                                observer.disconnect();
                        };
                }

                const handleResize = () => {
                        logBounds();
                };

                console.debug("[HeroOffering] ResizeObserver unavailable; using window resize listener");

                window.addEventListener("resize", handleResize);

                return () => {
                        window.removeEventListener("resize", handleResize);
                };
        }, [containerClassName]);

        return (
                <div ref={containerRef} className={containerClassName}>
                        <div ref={mediaWrapperRef} className={mediaWrapperClassName}>
                                {image ? (
                                        isImageSrc(image) ? (
                                                <SafeMotionDiv
                                                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        transition={{
                                                                type: "spring",
                                                                stiffness: 80,
                                                                damping: 16,
                                                                duration: 0.8,
                                                        }}
                                                >
                                                        <div ref={imageWrapperRef} className={imageWrapperClassName}>
                                                                <Image
                                                                        src={image}
                                                                        alt={imageAlt || "Hero Offering"}
                                                                        className={imageClassName}
                                                                        style={{
                                                                                filter: "drop-shadow(0 8px 32px rgba(80, 0, 255, 0.18))",
                                                                        }}
                                                                        width={800}
                                                                        height={800}
                                                                        priority
                                                                        ref={imageElementRef}
                                                                />
                                                        </div>
                                                </SafeMotionDiv>
                                        ) : (
                                                <SafeMotionDiv
							initial={{ opacity: 0, scale: 0.8, y: 40 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{
								type: "spring",
								stiffness: 80,
								damping: 16,
								duration: 0.8,
							}}
						>
							{image}
						</SafeMotionDiv>
					)
				) : (
                                        <SplineModel />
                                )}
                        </div>
                </div>
        );
};
