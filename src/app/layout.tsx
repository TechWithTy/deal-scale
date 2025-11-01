import "../index.css";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/AppProviders";
import type { AnalyticsConfig } from "@/lib/analytics/config";
import { getAnalyticsConfig } from "@/lib/analytics/config";
import { monoFont, sansFont } from "@/styles/fonts";
import {
	SchemaInjector,
	buildOrganizationSchema,
	buildWebSiteSchema,
} from "@/utils/seo/schema";

const ORGANIZATION_SCHEMA = buildOrganizationSchema();
const WEBSITE_SCHEMA = buildWebSiteSchema();

const analyticsResult = getAnalyticsConfig();

if (analyticsResult.warnings.length > 0) {
	// * Surface configuration issues early in the server logs.
	console.warn(
		"[layout] Analytics configuration warnings",
		analyticsResult.warnings,
	);
}

const initialAnalyticsConfig: AnalyticsConfig = analyticsResult.config;
const {
	clarityId: clarityProjectId,
	gaId: googleAnalyticsId,
	gtmId: googleTagManagerId,
	zohoCode: zohoWidgetCode,
	facebookPixelId,
	plausibleDomain,
	plausibleEndpoint,
} = initialAnalyticsConfig;

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
			<body className="theme-cyberoni min-h-screen bg-background font-sans antialiased">
				<SchemaInjector schema={ORGANIZATION_SCHEMA} />
				<SchemaInjector schema={WEBSITE_SCHEMA} />
				<AppProviders
					clarityProjectId={clarityProjectId}
					zohoWidgetCode={zohoWidgetCode}
					facebookPixelId={facebookPixelId}
					plausibleDomain={plausibleDomain}
					plausibleEndpoint={plausibleEndpoint}
					initialAnalyticsConfig={initialAnalyticsConfig}
				>
					{children}
				</AppProviders>
			</body>
		</html>
	);
}
