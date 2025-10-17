export interface BentoFeatureSeed {
        title: string;
        size: "sm" | "md" | "lg" | "xl";
        summary: string;
        description?: string;
        ctaLabel?: string;
        ctaUrl?: string;
}

export const landingBentoFeatureSeeds: BentoFeatureSeed[] = [
        {
                title: "Unlimited Free Skip Tracing",
                size: "md",
                summary:
                        "Stop paying for data. Get unlimited, high-quality owner data for free with any subscription.",
                description: "A massive cost-saving advantage for teams that rely on accurate property contact data.",
        },
        {
                title: "Your 24/7 AI Qualification Agent",
                size: "xl",
                summary:
                        "Instantly responds to every inquiry, pre-qualifies motivated sellers, and books appointments directly on your calendar.",
                description:
                        "Deal Scale’s always-on agent nurtures leads day and night so your team can focus on closing deals.",
        },
        {
                title: "Hot Transfers",
                size: "md",
                summary: "Instantly connect with motivated sellers without manual follow-up.",
                description: "Our AI agent calls, texts, and nurtures leads so you never miss a sales-ready conversation.",
        },
        {
                title: "AI Voice Cloning",
                size: "md",
                summary: "Speak to prospects in your own cloned voice to build trust and rapport at scale.",
        },
        {
                title: "Appointments on Your Calendar",
                size: "md",
                summary: "Delivers sales-ready appointments straight to your calendar—no extra tools required.",
                description:
                        "Automated scheduling keeps your pipeline full while your team focuses on high-value conversations.",
        },
        {
                title: "140M+ Property Database",
                size: "md",
                summary: "Access over 140 million on-market and off-market property records for hyper-targeted lists.",
        },
        {
                title: "Book Your Demo",
                size: "lg",
                summary: "Become a pilot tester and experience the platform before general availability.",
                ctaLabel: "Apply For Priority Beta Access",
                ctaUrl: "/contact-pilot",
        },
        {
                title: "Save 20+ Hours a Week",
                size: "lg",
                summary: "From data gathering to appointment setting, Deal Scale automates the busywork so you can close more deals.",
                ctaLabel: "Save 20+ Hours / Week",
                ctaUrl: "/contact",
        },
];
