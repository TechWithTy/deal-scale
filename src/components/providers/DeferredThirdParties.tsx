import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Debug logging function (reduced verbosity)
const debugLog = (message: string, data?: unknown) => {
	console.log(`[DeferredThirdParties] ${message}`, data || '');
};

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
const MicrosoftClarityScript = ({ projectId }: { projectId?: string }) => {
	useEffect(() => {
		debugLog("Clarity: Starting effect", { projectId });
		if (!projectId || typeof window === "undefined") {
			debugLog("Clarity: Skipping - no projectId or not in browser");
			return;
		}

		if (document.getElementById("clarity-script")) {
			debugLog("Clarity: Script already exists, skipping");
			return;
		}

		debugLog("Clarity: Injecting script");
		const script = document.createElement("script");
		script.id = "clarity-script";
		script.type = "text/javascript";
		script.innerHTML = `
			(function(c,l,a,r,i,t,y){
				c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
				t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
				y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
			})(window, document, "clarity", "script", "${projectId}");
		`;
		document.head.appendChild(script);
		debugLog("Clarity: Script injected successfully");

		return () => {
			const scriptElement = document.getElementById("clarity-script");
			if (scriptElement) {
				scriptElement.remove();
				debugLog("Clarity: Script removed on cleanup");
			}
		};
	}, [projectId]);

	return null;
};

const INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
	"scroll",
	"pointerdown",
	"keydown",
];

function useDeferredLoad() {
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		debugLog("useDeferredLoad: Effect started", { shouldLoad });
		if (shouldLoad || typeof window === "undefined") {
			debugLog("useDeferredLoad: Already loaded or not in browser, returning");
			return;
		}

		let cancelled = false;

		const enable = () => {
			if (!cancelled) {
				debugLog("useDeferredLoad: Enabling load");
				setShouldLoad(true);
			}
		};

		// Define the event handler outside the loop for cleanup
		const handleEvent = (event: Event) => {
			debugLog(`useDeferredLoad: Event fired: ${event.type}`);
			enable();
		};

		// Load immediately for testing
		debugLog("useDeferredLoad: Loading immediately");
		enable();

		// Keep interaction events as backup
		for (const eventName of INTERACTION_EVENTS) {
			debugLog(`useDeferredLoad: Adding listener for ${eventName}`);
			window.addEventListener(eventName, handleEvent, {
				once: true,
				passive: true,
			});
		}

		// Add manual logging for scroll to ensure it's firing
		debugLog("useDeferredLoad: Listeners added, waiting for events");

		return () => {
			debugLog("useDeferredLoad: Cleaning up");
			cancelled = true;
			for (const eventName of INTERACTION_EVENTS) {
				window.removeEventListener(eventName, handleEvent);
			}
		};
	}, [shouldLoad]);

	debugLog("useDeferredLoad: Returning shouldLoad", { shouldLoad });
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
	debugLog("DeferredThirdParties: Component rendered", {
		clarityProjectId,
		zohoWidgetCode,
	});
	const [providerData, setProviderData] = useState<{
		clarityId?: string;
		zohoCode?: string;
	} | null>(null);
	const shouldLoad = useDeferredLoad();

	// Fetch provider config from API to avoid exposing IDs in client bundle
	useEffect(() => {
		if (!shouldLoad) return;

		const fetchProviders = async () => {
			try {
				const response = await fetch("/api/init-providers");
				const data = await response.json();
				setProviderData(data);
				debugLog("DeferredThirdParties: Fetched provider data", data);
			} catch (error) {
				debugLog("DeferredThirdParties: Error fetching providers", error);
			}
		};

		fetchProviders();
	}, [shouldLoad]);

	// Use fetched data or props
	const clarityId = providerData?.clarityId || clarityProjectId;
	const zohoCode = providerData?.zohoCode || zohoWidgetCode;
	debugLog("DeferredThirdParties: Using IDs", { clarityId, zohoCode });

	// Load immediately if env vars are set
	const hasRequiredVars = clarityId || zohoCode;
	const shouldLoadWithVars = Boolean(hasRequiredVars) || shouldLoad;
	debugLog("DeferredThirdParties: shouldLoad set to", {
		shouldLoadWithVars,
		hasRequiredVars,
	});

	useEffect(() => {
		console.log("DeferredThirdParties: Zoho useEffect running");
		debugLog("DeferredThirdParties: Zoho useEffect started", {
			shouldLoadWithVars,
			zohoCode,
		});
		if (!shouldLoadWithVars || !zohoCode || typeof window === "undefined") {
			debugLog("DeferredThirdParties: Zoho skipping - conditions not met");
			return;
		}

		if (document.getElementById("zsiqscript")) {
			debugLog("DeferredThirdParties: Zoho script already exists, skipping");
			return;
		}

		debugLog("DeferredThirdParties: Injecting Zoho script");
		window.$zoho = window.$zoho || {};
		window.$zoho.salesiq = window.$zoho.salesiq || {
			widgetcode: "",
			values: {},
			ready: () => undefined,
		};

		const script = document.createElement("script");
		script.id = "zsiqscript";
		script.src = `https://salesiq.zohopublic.com/widget?wc=${zohoCode}`;
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
		debugLog("DeferredThirdParties: Zoho script injected");

		return () => {
			const scriptElement = document.getElementById("zsiqscript");
			if (scriptElement) {
				scriptElement.remove();
				debugLog("DeferredThirdParties: Zoho script removed on cleanup");
			}
		};
	}, [shouldLoadWithVars, zohoCode]);

	if (!shouldLoadWithVars) {
		debugLog("DeferredThirdParties: Not loading yet, returning null");
		return null;
	}

	debugLog("DeferredThirdParties: Rendering providers");
	return (
		<>
			<Analytics />
			<GAAnalyticsProvider />
			<MicrosoftClarityScript projectId={clarityId} />
		</>
	);
}
