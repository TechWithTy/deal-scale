/**
 * Zoho Support Chat Configuration and Utilities
 * For Support Chat Widget (e.g., Zoho Desk)
 *
 * Usage: Place <ZohoSupportScript /> in your layout or page.
 *
 * Env variable: NEXT_PUBLIC_ZOHO_SUPPORT_WIDGET_CODE
 */

import * as React from "react";

export const ZOHO_SUPPORT_CONFIG = {
	WIDGET_CODE: process.env.NEXT_PUBLIC_ZOHOSUPPORT_WIDGETCODE || "",
	WIDGET_URL: "https://salesiq.zoho.com/widget", // Change if support widget uses a different URL
} as const;

export const initializeZohoSupport = () => {
	if (typeof window === "undefined") return;
	window.$zoho = window.$zoho || {};
	window.$zoho.support = window.$zoho.support || {
		widgetcode: ZOHO_SUPPORT_CONFIG.WIDGET_CODE,
		values: {},
		ready: () => {},
	};
	if (!document.getElementById("zoho-support-script")) {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.id = "zoho-support-script";
		script.defer = true;
		script.src = ZOHO_SUPPORT_CONFIG.WIDGET_URL;
		const firstScript = document.getElementsByTagName("script")[0];
		if (firstScript?.parentNode) {
			firstScript.parentNode.insertBefore(script, firstScript);
		}
	}
};

export function ZohoSupportScript() {
	React.useEffect(() => {
		initializeZohoSupport();
	}, []);
	return null;
}
