"use client";
import "../index.css";
import { PageLayout } from "@/components/layout/PageLayout";
import { DeferredThirdParties } from "@/components/providers/DeferredThirdParties";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { PerformanceMonitor } from "@/components/providers/PerformanceMonitor";
import LoadingAnimation from "@/components/ui/loading-animation";
import { Toaster } from "@/components/ui/toaster";
import BodyThemeSync from "@/contexts/BodyThemeSync";
import { ThemeProvider } from "@/contexts/theme-context";
import { monoFont, sansFont } from "@/styles/fonts";
import {
        SchemaInjector,
        buildOrganizationSchema,
        buildWebSiteSchema,
} from "@/utils/seo/schema";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

const queryClient = new QueryClient();

const ORGANIZATION_SCHEMA = buildOrganizationSchema();
const WEBSITE_SCHEMA = buildWebSiteSchema();

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const zohoWidgetCode =
	process.env.NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE ??
	process.env.ZOHOSALESIQ_WIDGETCODE;

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
        return (
                <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
                        <body className="theme-cyberoni min-h-screen bg-background font-sans antialiased">
                                <SchemaInjector schema={ORGANIZATION_SCHEMA} />
                                <SchemaInjector schema={WEBSITE_SCHEMA} />
                                <ThemeProvider>
                                        <BodyThemeSync />
					<PerformanceMonitor />
					<Suspense fallback={<LoadingAnimation />}>
						<Toaster />
						<NextAuthProvider>
							<QueryClientProvider client={queryClient}>
								<PageLayout>{children}</PageLayout>
							</QueryClientProvider>
						</NextAuthProvider>
					</Suspense>
					<DeferredThirdParties
						clarityProjectId={clarityProjectId}
						zohoWidgetCode={zohoWidgetCode}
					/>
				</ThemeProvider>
			</body>
		</html>
	);
}
