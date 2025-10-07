"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

import { FB_PIXEL_ID, pageView } from "@/utils/seo/fbpixel";

type IdleCallbackHandle = number | null;

declare global {
	interface Window {
		requestIdleCallback?: (
			callback: IdleRequestCallback,
			options?: IdleRequestOptions,
		) => number;
		cancelIdleCallback?: (handle: number) => void;
	}
}

const hasFacebookPixel = Boolean(FB_PIXEL_ID);

const registerIdleCallback = (onIdle: () => void): (() => void) | undefined => {
	if (typeof window === "undefined") {
		return undefined;
	}

	let idleHandle: IdleCallbackHandle = null;
	let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

	const trigger = () => {
		idleHandle = null;
		timeoutHandle = null;
		onIdle();
	};

	if (window.requestIdleCallback) {
		idleHandle = window.requestIdleCallback(trigger, { timeout: 1500 });
		return () => {
			if (idleHandle !== null && window.cancelIdleCallback) {
				window.cancelIdleCallback(idleHandle);
			}
		};
	}

	timeoutHandle = window.setTimeout(trigger, 1200);
	return () => {
		if (timeoutHandle !== null) {
			clearTimeout(timeoutHandle);
		}
	};
};

export default function DeferredThirdParties() {
	const pathname = usePathname();
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		const cancelIdle = registerIdleCallback(() => setShouldLoad(true));
		return () => {
			if (cancelIdle) cancelIdle();
		};
	}, []);

	useEffect(() => {
		if (!shouldLoad || !hasFacebookPixel) {
			return;
		}

		const trackedPath =
			pathname ??
			(typeof window !== "undefined" ? window.location.pathname : undefined);

		pageView(trackedPath ? { pathname: trackedPath } : undefined);
	}, [pathname, shouldLoad]);

	const pixelMarkup = useMemo(() => {
		if (!shouldLoad || !hasFacebookPixel) {
			return null;
		}

		const pixelId = FB_PIXEL_ID ?? "";

		const bootstrap = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;\n                        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;\n                        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);\n                }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');`;

		const initSnippet = `window.fbq('init', '${pixelId}'); window.fbq('track', 'PageView');`;

		return (
			<>
				<Script
					id="fb-pixel-bootstrap"
					strategy="afterInteractive"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Third-party bootstrap script is trusted
					dangerouslySetInnerHTML={{ __html: bootstrap }}
				/>
				<Script
					id="fb-pixel-init"
					strategy="afterInteractive"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Third-party initialization script is trusted
					dangerouslySetInnerHTML={{ __html: initSnippet }}
				/>
			</>
		);
	}, [shouldLoad]);

	if (!pixelMarkup) {
		return null;
	}

	return pixelMarkup;
}
