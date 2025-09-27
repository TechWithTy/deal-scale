"use client";
import "../index.css";
import { Analytics } from "@/components/analytics/Analytics";
import { PageLayout } from "@/components/layout/PageLayout";
import GAAnalyticsProvider from "@/components/providers/GAAnalyticsProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import LoadingAnimation from "@/components/ui/loading-animation";
import { Toaster } from "@/components/ui/toaster";
import BodyThemeSync from "@/contexts/BodyThemeSync";
import { ThemeProvider } from "@/contexts/theme-context";
import { MicrosoftClarityScript } from "@/utils/clarity/ClarityScript";
import { renderOpenGraphMeta } from "@/utils/seo/seo";
import { defaultSeo } from "@/utils/seo/staticSeo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Script from "next/script";
import { Suspense } from "react";
import { metadata } from "./metadata";

const queryClient = new QueryClient();

const { ZOHOSALESIQ_WIDGETCODE } = process.env;

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="theme-cyberoni min-h-screen bg-background font-sans antialiased">
				<ThemeProvider>
					<BodyThemeSync />
					<Suspense fallback={<LoadingAnimation />}>
						<Toaster />
						<NextAuthProvider>
							<QueryClientProvider client={queryClient}>
								<PageLayout>{children}</PageLayout>
							</QueryClientProvider>
						</NextAuthProvider>
						<Analytics />
						<GAAnalyticsProvider />
						<MicrosoftClarityScript projectId="sttpn4xwgd" />
					</Suspense>
					{/* Zoho SalesIQ direct embed */}
					<Script
						id="zsiq-init"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html:
								"window.$zoho=window.$zoho || {}; $zoho.salesiq=$zoho.salesiq||{ready:function(){}};",
						}}
					/>
					<Script
						id="zsiqscript"
						strategy="afterInteractive"
						src="https://salesiq.zohopublic.com/widget?wc=siq7b1a5f3f6a15e414fcb16d6c1373946d677d54b16f2302c3baca23636aa89295"
						defer
					/>
				</ThemeProvider>
			</body>
		</html>
	);
}
