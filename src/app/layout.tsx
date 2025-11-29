import "../index.css";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/AppProviders";
import type { AnalyticsConfig } from "@/lib/analytics/config";
import { getAnalyticsConfig } from "@/lib/analytics/config";
import { monoFont, sansFont } from "@/styles/fonts";
import { buildKnowledgeGraphSchema, SchemaInjector } from "@/utils/seo/schema";

const KNOWLEDGE_GRAPH_SCHEMA = buildKnowledgeGraphSchema();

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
	zohoCode: zohoWidgetCode,
	facebookPixelId,
	plausibleDomain,
	plausibleEndpoint,
} = initialAnalyticsConfig;

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${sansFont.variable} ${monoFont.variable}`}
			suppressHydrationWarning
		>
			<head>
				{/* Preload small hero logo to stabilize LCP visual */}
				<link
					rel="preload"
					as="image"
					href="/logos/DealScale%20Transparent%20Logo/Deal%20Scale%20No%20Text.png"
					// type omitted; browsers infer from extension
				/>
				{/* Meta Pixel Base Code - Required for Meta Pixel Helper detection */}
				{facebookPixelId && (
					<>
						{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required by Meta Pixel specification */}
						<script
							dangerouslySetInnerHTML={{
								__html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${facebookPixelId}');
`,
							}}
						/>
						<noscript>
							{/* biome-ignore lint/performance/noImgElement: Required by Meta Pixel noscript fallback specification */}
							<img
								height="1"
								width="1"
								style={{ display: "none" }}
								src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
								alt=""
							/>
						</noscript>
					</>
				)}
			</head>
			<body className="theme-dealscale min-h-screen bg-background font-sans antialiased">
				<SchemaInjector schema={KNOWLEDGE_GRAPH_SCHEMA} />
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
