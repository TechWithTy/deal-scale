"use client";

import { useDataModule } from "@/stores/useDataModuleStore";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

export const ContactHero = () => {
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
                        <section className="relative overflow-hidden bg-background-dark px-6 py-20 lg:px-8">
                                <div className="text-center text-muted-foreground">Loading contact information…</div>
                        </section>
                );
        }

        if (!hasCompany) {
                if (isError) {
                        console.error("[ContactHero] Failed to load company contact info", error);
                }

                return (
                        <section className="relative overflow-hidden bg-background-dark px-6 py-20 lg:px-8">
                                <div className="text-center text-muted-foreground">
                                        Contact information is coming soon.
                                </div>
                        </section>
                );
        }

        return (
                <section className="relative overflow-hidden bg-background-dark px-6 py-20 lg:px-8">
                        <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute inset-0 bg-grid-lines opacity-10" />
                                <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-full max-h-3xl w-full max-w-3xl rounded-full bg-blue-pulse opacity-30 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl">
						Get In <span className="text-primary">Touch</span>
					</h1>
					<p className="mx-auto mb-12 max-w-3xl text-black text-lg md:text-xl dark:text-white/70">
						Ready to transform your business with our AI-powered solutions?
						Reach out to us today and let's start building the future together.
					</p>

                                        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
                                                {/* Email */}
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                                                <Mail className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <h3 className="mb-2 font-semibold text-lg">Email Us</h3>
                                                        <p className="text-black dark:text-white/70">
                                                                <a
                                                                        href={`mailto:${company.contactInfo.email}`}
                                                                        className="transition-colors hover:text-primary"
                                                                >
                                                                        {company.contactInfo.email}
                                                                </a>
                                                        </p>
                                                </div>

                                                {/* Phone */}
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                                                <Phone className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <h3 className="mb-2 font-semibold text-lg">Call Us</h3>
                                                        <p className="text-black dark:text-white/70">
                                                                <a
                                                                        href={`tel:${company.contactInfo.phone}`}
                                                                        className="transition-colors hover:text-primary"
                                                                >
                                                                        {company.contactInfo.phone}
                                                                </a>
                                                        </p>
                                                </div>

                                                {/* Live Chat */}
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                                                <MessageSquare className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <h3 className="mb-2 font-semibold text-lg">Live Chat</h3>
                                                        <p className="text-black dark:text-white/70">
                                                                <Link
									href="/contact"
									className="transition-colors hover:text-primary"
								>
									Start a conversation
								</Link>
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
