"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PageLayout } from "@/components/layout/PageLayout";
import { Toaster } from "@/components/ui/toaster";
import BodyThemeSync from "@/contexts/BodyThemeSync";
import { ThemeProvider } from "@/contexts/theme-context";

import type { AnalyticsConfig } from "@/lib/analytics/config";

import { DeferredThirdParties } from "./DeferredThirdParties";
import NextAuthProvider from "./NextAuthProvider";
import { PerformanceMonitor } from "./PerformanceMonitor";
import LoadingAnimation from "../ui/loading-animation";

interface AppProvidersProps {
        children: ReactNode;
        clarityProjectId?: string;
        zohoWidgetCode?: string;
        initialAnalyticsConfig?: Partial<AnalyticsConfig>;
}

const queryClient = new QueryClient();

export function AppProviders({
        children,
        clarityProjectId,
        zohoWidgetCode,
        initialAnalyticsConfig,
}: AppProvidersProps) {
        return (
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
                                initialConfig={initialAnalyticsConfig}
                        />
                </ThemeProvider>
        );
}
