"use client";

import { useDataModule } from "@/stores/useDataModuleStore";
import { Mail, Phone } from "lucide-react";

export function ContactInfo() {
        const { status, company, error } = useDataModule(
                "company",
                ({ status: moduleStatus, data, error: moduleError }) => ({
                        status: moduleStatus,
                        company: data?.companyData,
                        error: moduleError,
                }),
        );

        const isLoading = status === "idle" || status === "loading";
        const isError = status === "error";
        const hasCompany = Boolean(company);

        if (isLoading) {
                return (
                        <div className="my-12 rounded-xl border border-white/10 bg-background-dark/90 p-6 backdrop-blur-sm">
                                <div className="py-6 text-center text-muted-foreground">Loading contact details…</div>
                        </div>
                );
        }

        if (!hasCompany) {
                if (isError) {
                        console.error("[ContactInfo] Failed to load company contact info", error);
                }

                return (
                        <div className="my-12 rounded-xl border border-white/10 bg-background-dark/90 p-6 backdrop-blur-sm">
                                <div className="py-6 text-center text-muted-foreground">
                                        Contact details will be available soon.
                                </div>
                        </div>
                );
        }

        return (
                <div className="my-12 rounded-xl border border-white/10 bg-background-dark/90 p-6 backdrop-blur-sm">
                        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
                                <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <a
                                                href={`mailto:${company.contactInfo.email}`}
                                                className="text-black transition-colors hover:text-primary dark:text-white"
                                        >
                                                {company.contactInfo.email}{" "}
                                        </a>
                                </div>

                                <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-primary" />
                                        <a
                                                href={`tel:${company.contactInfo.phone}`}
                                                className="text-black transition-colors hover:text-primary dark:text-white"
                                        >
                                                {company.contactInfo.phone}
                                        </a>
                                </div>
                        </div>
                </div>
        );
}
