"use client";

import Header from "@/components/common/Header";
import TrustedByScroller from "@/components/contact/utils/TrustedByScroller";
import { useDataModule } from "@/stores/useDataModuleStore";
import type { CompanyLogoDictType } from "@/types/service/trusted-companies";

/**
 * * TrustedBySection: Logos of trusted companies
 */
export default function TrustedBySection() {
        const { status, companyLogos, error } = useDataModule(
                "service/slug_data/trustedCompanies",
                ({ status: moduleStatus, data, error: moduleError }) => ({
                        status: moduleStatus,
                        companyLogos: (data?.companyLogos ?? {}) as CompanyLogoDictType,
                        error: moduleError,
                }),
        );

        const hasLogos = Object.keys(companyLogos).length > 0;
        const isLoading = status === "idle" || status === "loading";
        const isError = status === "error";

        if (isError) {
                console.error("[TrustedBySection] Failed to load trusted companies", error);
        }

        return (
                <div>
                        <Header title="Beta Testers" subtitle="" />
                        {isError ? (
                                <div className="mt-4 text-center text-destructive">
                                        Unable to load trusted partners right now.
                                </div>
                        ) : isLoading ? (
                                <div className="mt-4 text-center text-muted-foreground">
                                        Loading trusted partners…
                                </div>
                        ) : hasLogos ? (
                                <TrustedByScroller variant="secondary" items={companyLogos} />
                        ) : (
                                <div className="mt-4 text-center text-muted-foreground">
                                        Trusted partners coming soon.
                                </div>
                        )}
                </div>
        );
}
