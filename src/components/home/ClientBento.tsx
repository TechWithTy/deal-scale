"use client";

import BentoPage from "@/components/bento/page";
import type { BentoFeature } from "@/types/bento/features";
import { useDataModule } from "@/stores/useDataModuleStore";
import { useMemo } from "react";

interface ClientBentoProps {
        features?: BentoFeature[];
        title?: string;
        subtitle?: string;
}

export default function ClientBento({
        features,
        title = "Why Real Estate Leaders Choose Deal Scale",
        subtitle = "We deliver a scalable and automated solution to keep your deal pipeline consistently full.",
}: ClientBentoProps) {
        const { status, features: moduleFeatures, error } = useDataModule(
                "bento/main",
                ({ status: moduleStatus, data, error: moduleError }) => ({
                        status: moduleStatus,
                        features: data?.MainBentoFeatures ?? [],
                        error: moduleError,
                }),
        );

        const resolvedFeatures = useMemo(() => {
                if (features && features.length > 0) {
                        return features;
                }
                return moduleFeatures;
        }, [features, moduleFeatures]);

        if (!features && status === "loading") {
                return (
                        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-10 text-white/70">
                                <span className="animate-pulse text-sm">Loading feature highlights…</span>
                        </div>
                );
        }

        if (!features && status === "error") {
                console.error("[ClientBento] Failed to load bento features", error);
                return (
                        <div className="flex items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 p-10 text-destructive-foreground">
                                <span className="text-sm">Unable to load feature highlights right now.</span>
                        </div>
                );
        }

        return <BentoPage features={resolvedFeatures} title={title} subtitle={subtitle} />;
}
