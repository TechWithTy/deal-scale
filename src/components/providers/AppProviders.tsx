"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { Suspense, useMemo, useState } from "react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Toaster } from "@/components/ui/toaster";
import BodyThemeSync from "@/contexts/BodyThemeSync";
import { AnalyticsConsentProvider } from "@/contexts/analytics-consent-context";
import { ThemeProvider } from "@/contexts/theme-context";

import type { AnalyticsConfig } from "@/lib/analytics/config";

import NextAuthProvider from "./NextAuthProvider";

const SuspenseFallback = () => (
	<div className="min-h-screen w-full bg-slate-950 text-white">
		<div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
			<div className="animate-spin rounded-full border-2 border-white/30 border-t-transparent p-3" />
			<p className="font-semibold text-white/70 text-xs uppercase tracking-[0.3em]">
				Preparing interface
			</p>
		</div>
	</div>
);

interface AppProvidersProps {
	children: ReactNode;
	clarityProjectId?: string;
	zohoWidgetCode?: string;
	facebookPixelId?: string;
	plausibleDomain?: string;
	plausibleEndpoint?: string;
	initialAnalyticsConfig?: Partial<AnalyticsConfig>;
}

const ClientExperience = dynamic(
	() =>
		import("./ClientExperience").then((mod) => ({
			default: mod.ClientExperience,
		})),
	{ ssr: false, loading: () => null },
);

export function AppProviders({
	children,
	clarityProjectId,
	zohoWidgetCode,
	facebookPixelId,
	plausibleDomain,
	plausibleEndpoint,
	initialAnalyticsConfig,
}: AppProvidersProps) {
	const [queryClient] = useState(() => new QueryClient());
	const defaultAnalyticsConsent =
		process.env.NEXT_PUBLIC_ANALYTICS_AUTOLOAD === "true";
	const analyticsProps = useMemo(
		() => ({
			clarityProjectId,
			zohoWidgetCode,
			facebookPixelId,
			plausibleDomain,
			plausibleEndpoint,
			initialAnalyticsConfig,
		}),
		[
			clarityProjectId,
			facebookPixelId,
			initialAnalyticsConfig,
			plausibleDomain,
			plausibleEndpoint,
			zohoWidgetCode,
		],
	);

	return (
		<AnalyticsConsentProvider defaultConsent={defaultAnalyticsConsent}>
			<ThemeProvider>
				<BodyThemeSync />
				<Suspense fallback={<SuspenseFallback />}>
					<Toaster />
					<NextAuthProvider>
						<QueryClientProvider client={queryClient}>
							<PageLayout>{children}</PageLayout>
						</QueryClientProvider>
					</NextAuthProvider>
				</Suspense>
				<ClientExperience {...analyticsProps} />
			</ThemeProvider>
		</AnalyticsConsentProvider>
	);
}
