import "../index.css";
import type { ReactNode } from "react";

import { AppProviders } from "@/components/providers/AppProviders";
import { monoFont, sansFont } from "@/styles/fonts";
import { SchemaInjector, buildOrganizationSchema, buildWebSiteSchema } from "@/utils/seo/schema";

const ORGANIZATION_SCHEMA = buildOrganizationSchema();
const WEBSITE_SCHEMA = buildWebSiteSchema();

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const zohoWidgetCode =
        process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE ?? process.env.ZOHOSALESIQ_WIDGETCODE;

export default function RootLayout({ children }: { children: ReactNode }) {
        return (
                <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
                        <body className="theme-cyberoni min-h-screen bg-background font-sans antialiased">
                                <SchemaInjector schema={ORGANIZATION_SCHEMA} />
                                <SchemaInjector schema={WEBSITE_SCHEMA} />
                                <AppProviders
                                        clarityProjectId={clarityProjectId}
                                        zohoWidgetCode={zohoWidgetCode}
                                >
                                        {children}
                                </AppProviders>
                        </body>
                </html>
        );
}
