import "../index.css";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/AppProviders";
import { monoFont, sansFont } from "@/styles/fonts";
import { SchemaInjector, buildOrganizationSchema, buildWebSiteSchema } from "@/utils/seo/schema";

const ORGANIZATION_SCHEMA = buildOrganizationSchema();
const WEBSITE_SCHEMA = buildWebSiteSchema();

const clarityProjectId =
        process.env.CLARITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const googleAnalyticsId =
        process.env.GOOGLE_ANALYTICS_ID ?? process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
const googleTagManagerId =
        process.env.GOOGLE_TAG_MANAGER_ID ?? process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
const zohoWidgetCode =
        process.env.ZOHO_SALES_IQ_WIDGET_CODE ??
        process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE ??
        process.env.ZOHOSALESIQ_WIDGETCODE;

const initialAnalyticsConfig = {
        clarityId: clarityProjectId,
        gaId: googleAnalyticsId,
        gtmId: googleTagManagerId,
        zohoCode: zohoWidgetCode,
};

export default function RootLayout({ children }: { children: ReactNode }) {
        return (
                <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
                        <body className="theme-cyberoni min-h-screen bg-background font-sans antialiased">
                                <SchemaInjector schema={ORGANIZATION_SCHEMA} />
                                <SchemaInjector schema={WEBSITE_SCHEMA} />
                                <AppProviders
                                        clarityProjectId={clarityProjectId}
                                        zohoWidgetCode={zohoWidgetCode}
                                        initialAnalyticsConfig={initialAnalyticsConfig}
                                >
                                        {children}
                                </AppProviders>
                        </body>
                </html>
        );
}
