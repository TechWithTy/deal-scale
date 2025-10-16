/**
 * Zoho SalesIQ Configuration and Utilities
 * For Sales Chat Widget
 *
 * Usage: Place <ZohoSalesIQScript /> in your layout or page.
 *
 * Env variable: NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE
 */

import * as React from "react";

/**
 * Zoho SalesIQ widget configuration
 */
export const ZOHO_SALESIQ_CONFIG = {
	WIDGET_CODE: process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE || "",
	// Use the public CDN host per Zoho embed snippet
	WIDGET_URL: "https://salesiq.zohopublic.com/widget",
} as const;

/**
 * Initializes the Zoho SalesIQ widget
 * This function should be called in the browser environment
 */
export const initializeZohoSalesIQ = () => {
	if (typeof window === "undefined") return;
	// Guard: must have widget code
	if (!ZOHO_SALESIQ_CONFIG.WIDGET_CODE) {
		console.warn(
			"Zoho SalesIQ: NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE is missing; widget will not load.",
		);
		return;
	}
	window.$zoho = window.$zoho || {};
	window.$zoho.salesiq = window.$zoho.salesiq || {
		widgetcode: ZOHO_SALESIQ_CONFIG.WIDGET_CODE,
		values: {},
		ready: () => {},
	};
	if (!document.getElementById("zsiqscript")) {
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.id = "zsiqscript";
		script.defer = true;
		script.src = `${ZOHO_SALESIQ_CONFIG.WIDGET_URL}?wc=${encodeURIComponent(
			ZOHO_SALESIQ_CONFIG.WIDGET_CODE,
		)}`;
		const firstScript = document.getElementsByTagName("script")[0];
		if (firstScript?.parentNode) {
			firstScript.parentNode.insertBefore(script, firstScript);
		}
	}
};

/**
 * Component that initializes Zoho SalesIQ
 * Should be placed in the _app.tsx or layout.tsx
 */
export function ZohoSalesIQScript() {
	React.useEffect(() => {
		initializeZohoSalesIQ();
	}, []);
	return null;
}
