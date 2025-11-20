"use client";
import "../index.css";
import { Analytics } from "@/components/analytics/Analytics";
import { PageLayout } from "@/components/layout/PageLayout";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import LoadingAnimation from "@/components/ui/loading-animation";
import { Toaster } from "@/components/ui/toaster";
import BodyThemeSync from "@/contexts/BodyThemeSync";
import { ThemeProvider } from "@/contexts/theme-context";
import { renderOpenGraphMeta } from "@/utils/seo/seo";
import { defaultSeo } from "@/utils/seo/staticSeo";
import { ZohoSalesIQScript } from "@/utils/zoho/salesiq";
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
						<Analytics config={{}} />
					</Suspense>
					{/* Zoho Chat Widgets */}
					{/* To use Zoho SalesIQ, uncomment the following line and comment out the ZohoSupportScript line below */}
					<ZohoSalesIQScript />
					{/* <ZohoSupportScript /> */}
				</ThemeProvider>
			</body>
		</html>
	);
}
