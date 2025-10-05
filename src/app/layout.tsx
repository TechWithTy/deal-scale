"use client";
import "../index.css";
import { PageLayout } from "@/components/layout/PageLayout";
import { DeferredThirdParties } from "@/components/providers/DeferredThirdParties";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import LoadingAnimation from "@/components/ui/loading-animation";
import { Toaster } from "@/components/ui/toaster";
import BodyThemeSync from "@/contexts/BodyThemeSync";
import { ThemeProvider } from "@/contexts/theme-context";
import { monoFont, sansFont } from "@/styles/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

const queryClient = new QueryClient();

const { ZOHOSALESIQ_WIDGETCODE, NEXT_PUBLIC_CLARITY_PROJECT_ID } = process.env;

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
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
					</Suspense>
					<DeferredThirdParties
						clarityProjectId={NEXT_PUBLIC_CLARITY_PROJECT_ID}
						zohoWidgetCode={ZOHOSALESIQ_WIDGETCODE}
					/>
				</ThemeProvider>
			</body>
		</html>
	);
}
