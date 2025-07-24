"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export function Analytics() {
	const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
	const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

	if (!gaId && !gtmId) {
		return null;
	}

	return (
		<>
			{gaId && <GoogleAnalytics gaId={gaId} />}
			{gtmId && <GoogleTagManager gtmId={gtmId} />}
		</>
	);
}
