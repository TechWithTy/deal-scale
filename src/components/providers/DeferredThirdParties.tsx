"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Analytics = dynamic(() => import("@/components/analytics/Analytics"), {
	ssr: false,
});
const GAAnalyticsProvider = dynamic(() => import("./GAAnalyticsProvider"), {
	ssr: false,
});
const MicrosoftClarityScript = dynamic(
	() =>
		import("@/utils/clarity/ClarityScript").then(
			(mod) => mod.MicrosoftClarityScript,
		),
	{ ssr: false },
);

const INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
	"scroll",
	"pointerdown",
	"keydown",
];

function useDeferredLoad() {
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		if (shouldLoad || typeof window === "undefined") {
			return;
		}

		let cancelled = false;

		const enable = () => {
			if (!cancelled) {
				setShouldLoad(true);
			}
		};

		const idle = () => {
			if ("requestIdleCallback" in window) {
				window.requestIdleCallback(() => enable(), { timeout: 2000 });
			} else {
				window.setTimeout(() => enable(), 1200);
			}
		};

		if (document.readyState === "complete") {
			idle();
		} else {
			window.addEventListener("load", idle, { once: true });
		}

		INTERACTION_EVENTS.forEach((eventName) => {
			window.addEventListener(eventName, enable, { once: true, passive: true });
		});

		return () => {
			cancelled = true;
			window.removeEventListener("load", idle);
			INTERACTION_EVENTS.forEach((eventName) => {
				window.removeEventListener(eventName, enable);
			});
		};
	}, [shouldLoad]);

	return shouldLoad;
}

declare global {
	interface Window {
		$zoho?: {
			salesiq?: {
				ready: () => void;
			};
		};
	}
}

interface DeferredThirdPartiesProps {
	clarityProjectId?: string;
	zohoWidgetCode?: string;
}

export function DeferredThirdParties({
	clarityProjectId,
	zohoWidgetCode,
}: DeferredThirdPartiesProps) {
	const shouldLoad = useDeferredLoad();

	useEffect(() => {
		if (!shouldLoad || !zohoWidgetCode || typeof window === "undefined") {
			return;
		}

		if (document.getElementById("zsiqscript")) {
			return;
		}

		window.$zoho = window.$zoho || {};
		window.$zoho.salesiq = window.$zoho.salesiq || { ready: () => undefined };

		const script = document.createElement("script");
		script.id = "zsiqscript";
		script.src = `https://salesiq.zohopublic.com/widget?wc=${zohoWidgetCode}`;
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		return () => {
			script.remove();
		};
	}, [shouldLoad, zohoWidgetCode]);

	if (!shouldLoad) {
		return null;
	}

	return (
		<>
			<Analytics />
			<GAAnalyticsProvider />
			<MicrosoftClarityScript projectId={clarityProjectId} />
		</>
	);
}
