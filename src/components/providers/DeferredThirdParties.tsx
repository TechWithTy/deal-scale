import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Analytics = dynamic(
	() =>
		import("@/components/analytics/Analytics").then((mod) => ({
			default: mod.Analytics,
		})),
	{
		ssr: false,
		loading: () => null,
	},
);

const GAAnalyticsProvider = () => null;
const MicrosoftClarityScript = ({ projectId }: { projectId?: string }) => null;

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

		// Simple type guard to ensure we're in browser environment
		const isBrowser = (): boolean => typeof window !== "undefined";

		const idle = () => {
			if (isBrowser() && "requestIdleCallback" in window) {
				window.requestIdleCallback(() => enable(), { timeout: 2000 });
			} else if (isBrowser()) {
				// Use globalThis for better type inference
				globalThis.setTimeout(() => enable(), 1200);
			}
		};

		if (document.readyState === "complete") {
			idle();
		} else {
			window.addEventListener("load", idle, { once: true });
		}

		for (const eventName of INTERACTION_EVENTS) {
			window.addEventListener(eventName, enable, {
				once: true,
				passive: true,
			});
		}

		return () => {
			cancelled = true;
			window.removeEventListener("load", idle);
			for (const eventName of INTERACTION_EVENTS) {
				window.removeEventListener(eventName, enable);
			}
		};
	}, [shouldLoad]);

	return shouldLoad;
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
		window.$zoho.salesiq = window.$zoho.salesiq || {
			widgetcode: "",
			values: {},
			ready: () => undefined
		};

		const script = document.createElement("script");
		script.id = "zsiqscript";
		script.src = `https://salesiq.zohopublic.com/widget?wc=${zohoWidgetCode}`;
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		return () => {
			const scriptElement = document.getElementById("zsiqscript");
			if (scriptElement) {
				scriptElement.remove();
			}
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
