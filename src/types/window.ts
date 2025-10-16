import type Analytics from "analytics";

type ZohoWidget = {
	widgetcode: string;
	values: Record<string, unknown>;
	ready: () => void;
};

declare global {
	interface Window {
		$zoho?: {
			salesiq?: ZohoWidget;
			support?: ZohoWidget;
		};
		__analytics?: ReturnType<typeof Analytics>;
		fbq?: (...args: unknown[]) => void;
	}
}

export {};
