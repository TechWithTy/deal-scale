import path from "node:path";
import { mkdir, rm, writeFile } from "node:fs/promises";

import { landingBentoFeatureSeeds } from "../../src/data/bento/landingSnapshot";
import { landingContentGaps } from "../../src/data/landing/strapiLandingContent";
import { caseStudies } from "../../src/data/caseStudy/caseStudies";
import { betaTesterFormFields } from "../../src/data/contact/formFields";
import { faqItems } from "../../src/data/faq/default";
import mockFeatures from "../../src/data/features";
import { PricingPlans } from "../../src/data/service/slug_data/pricing";
import { generalDealScaleTestimonials } from "../../src/data/service/slug_data/testimonials";
import { companyLogos } from "../../src/data/service/slug_data/trustedCompanies";
import { services } from "../../src/data/service/services";

interface ExportLandingOptions {
        outDir?: string;
        clean?: boolean;
        silent?: boolean;
        entities?: string[];
}

interface ExportRecord {
        name: string;
        filename: string;
        payload: unknown;
}

interface ExportSummary {
        destination: string;
        files: string[];
}

const DEFAULT_OUTPUT = path.resolve(process.cwd(), "content/strapi-export/landing");

const sanitizedBentoFeatures = landingBentoFeatureSeeds;

const sanitizedBetaFormFields = betaTesterFormFields.map((field) => {
        const base: Record<string, unknown> = {
                name: field.name,
                label: field.label,
                type: field.type,
        };

        if ("placeholder" in field && field.placeholder) {
                base.placeholder = field.placeholder;
        }

        if ("options" in field && Array.isArray(field.options)) {
                base.options = field.options.map((option) => ({
                        value: option.value,
                        label: option.label,
                        description: option.description ?? null,
                }));
        }

        if ("accept" in field && field.accept) {
                base.accept = field.accept;
        }

        if ("multiple" in field) {
                base.multiple = Boolean(field.multiple);
        }

        if (Object.prototype.hasOwnProperty.call(field, "value")) {
                base.initialValue = field.value ?? null;
        }

        return base;
});

const EXPORT_DEFINITIONS: ExportRecord[] = [
        { name: "hero", filename: "landing-hero.json", payload: landingContentGaps.hero },
        { name: "hero-fallback", filename: "landing-hero-fallback.json", payload: landingContentGaps.hero.fallbacks },
        { name: "trusted-by", filename: "landing-trusted-by.json", payload: landingContentGaps.trustedBy },
        { name: "services-gaps", filename: "landing-services-gaps.json", payload: landingContentGaps.services },
        { name: "upcoming-features-header", filename: "landing-upcoming-features.json", payload: landingContentGaps.upcomingFeatures },
        { name: "case-studies-header", filename: "landing-case-studies-header.json", payload: landingContentGaps.caseStudiesPreview },
        { name: "testimonials-header", filename: "landing-testimonials-header.json", payload: landingContentGaps.testimonials },
        { name: "faq-cta", filename: "landing-faq-cta.json", payload: landingContentGaps.faqCta },
        { name: "pricing-header", filename: "landing-pricing-header.json", payload: landingContentGaps.pricing },
        { name: "about-highlight", filename: "landing-about-highlight.json", payload: landingContentGaps.about },
        { name: "bento-header", filename: "landing-bento-header.json", payload: landingContentGaps.bento },
        { name: "blog-preview", filename: "landing-blog-preview.json", payload: landingContentGaps.blogPreview },
        { name: "contact-form-header", filename: "landing-contact-form-header.json", payload: landingContentGaps.contactForm },
        { name: "services", filename: "services.json", payload: services },
        { name: "pricing-plans", filename: "pricing-plans.json", payload: PricingPlans },
        { name: "testimonials", filename: "testimonials.json", payload: generalDealScaleTestimonials },
        { name: "case-studies", filename: "case-studies.json", payload: caseStudies },
        { name: "faq-items", filename: "faq-items.json", payload: faqItems },
        { name: "bento-features", filename: "bento-features.json", payload: sanitizedBentoFeatures },
        { name: "company-logos", filename: "company-logos.json", payload: companyLogos },
        { name: "beta-form-fields", filename: "contact-form-fields.json", payload: sanitizedBetaFormFields },
        { name: "feature-ideas", filename: "upcoming-features.json", payload: mockFeatures },
];

const replacer = (_key: string, value: unknown) => {
        if (typeof value === "undefined" || typeof value === "function") {
                return undefined;
        }

        if (value instanceof Map) {
                return Object.fromEntries(value);
        }

        if (value && typeof value === "object" && "$$typeof" in (value as Record<string, unknown>)) {
                return undefined;
        }

        return value;
};

const resolveExportRecords = (entities?: string[]): ExportRecord[] => {
        if (!entities || entities.length === 0) {
                return EXPORT_DEFINITIONS;
        }

        const requested = new Set(entities);
        const selected = EXPORT_DEFINITIONS.filter((record) => requested.has(record.name));

        if (selected.length !== requested.size) {
                const missing = [...requested].filter(
                        (entity) => !EXPORT_DEFINITIONS.some((record) => record.name === entity),
                );

                throw new Error(`Unknown export entities: ${missing.join(", ")}`);
        }

        return selected;
};

export async function exportLandingData(options: ExportLandingOptions = {}): Promise<ExportSummary> {
        const { outDir = DEFAULT_OUTPUT, clean = true, silent = false, entities } = options;

        const records = resolveExportRecords(entities);

        if (clean) {
                await rm(outDir, { recursive: true, force: true });
        }

        await mkdir(outDir, { recursive: true });

        const writtenFiles: string[] = [];

        for (const record of records) {
                const destination = path.join(outDir, record.filename);
                const sanitized = JSON.parse(JSON.stringify(record.payload, replacer));
                await writeFile(destination, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");
                writtenFiles.push(destination);

                if (!silent) {
                        // eslint-disable-next-line no-console -- CLI feedback
                        console.log(`✓ exported ${record.name} -> ${path.relative(process.cwd(), destination)}`);
                }
        }

        return { destination: outDir, files: writtenFiles };
}

interface CliContext {
        args?: string[];
}

interface ParsedCliOptions {
        helpRequested: boolean;
        options: ExportLandingOptions;
}

const parseCliArgs = (rawArgs: string[]): ParsedCliOptions => {
        const options: ExportLandingOptions = {};
        const entities: string[] = [];
        let helpRequested = false;

        const consumeValue = (index: number, current: string): [number, string] => {
                const [, value] = current.split("=", 2);

                if (value) {
                        return [index, value];
                }

                const nextValue = rawArgs[index + 1];

                if (!nextValue) {
                        throw new Error(`Missing value for ${current}`);
                }

                return [index + 1, nextValue];
        };

        for (let index = 0; index < rawArgs.length; index += 1) {
                const arg = rawArgs[index];

                if (arg === "--") {
                        continue;
                }

                switch (true) {
                        case arg === "--help" || arg === "-h": {
                                helpRequested = true;
                                break;
                        }
                        case arg.startsWith("--outDir") || arg === "-o": {
                                const [nextIndex, value] = consumeValue(index, arg);
                                options.outDir = value;
                                index = nextIndex;
                                break;
                        }
                        case arg.startsWith("--entity") || arg === "-e": {
                                const [nextIndex, value] = consumeValue(index, arg);
                                entities.push(value);
                                index = nextIndex;
                                break;
                        }
                        case arg === "--no-clean": {
                                options.clean = false;
                                break;
                        }
                        case arg === "--clean": {
                                options.clean = true;
                                break;
                        }
                        case arg === "--silent" || arg === "-s": {
                                options.silent = true;
                                break;
                        }
                        default: {
                                throw new Error(`Unknown argument: ${arg}`);
                        }
                }
        }

        if (entities.length > 0) {
                options.entities = entities;
        }

        return { helpRequested, options };
};

const printCliUsage = () => {
        // eslint-disable-next-line no-console -- CLI feedback
        console.log(`Usage: pnpm export:landing [options]\n\nOptions:\n  -o, --outDir <path>     Destination directory for export files\n  -e, --entity <name>     Export only the matching dataset (can be repeated)\n      --clean             Remove the destination directory before exporting (default)\n      --no-clean          Keep existing files in the destination directory\n  -s, --silent            Suppress success log output\n  -h, --help              Show this help message`);
};

export async function run(context: CliContext = {}): Promise<void> {
        const rawArgs = context.args ?? process.argv.slice(2);
        const { helpRequested, options } = parseCliArgs(rawArgs);

        if (helpRequested) {
                printCliUsage();
                return;
        }

        await exportLandingData(options);
}

export default run;

if (require.main === module) {
        run().catch((error) => {
                // eslint-disable-next-line no-console -- CLI feedback
                console.error("Landing export failed", error);
                process.exit(1);
        });
}
