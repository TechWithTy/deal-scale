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
		// GTM dataLayer - compatible with Next.js third-parties/google types
		// biome-ignore lint/complexity/noBannedTypes: Must match Next.js third-parties/google type definition
		dataLayer?: Object[];
		gtag?: (...args: unknown[]) => void;
	}
}

// Export type to make this a module for global augmentation
type WindowAugmentation = Window;
export type { WindowAugmentation };
