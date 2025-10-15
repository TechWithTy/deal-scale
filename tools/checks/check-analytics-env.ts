import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local" });

interface FieldDescriptor {
        privateName: string;
        fallbackName: string;
        label: string;
}

const fields: FieldDescriptor[] = [
        {
                privateName: "CLARITY_PROJECT_ID",
                fallbackName: "NEXT_PUBLIC_CLARITY_PROJECT_ID",
                label: "Microsoft Clarity project ID",
        },
        {
                privateName: "GOOGLE_ANALYTICS_ID",
                fallbackName: "NEXT_PUBLIC_GOOGLE_ANALYTICS",
                label: "Google Analytics measurement ID",
        },
        {
                privateName: "GOOGLE_TAG_MANAGER_ID",
                fallbackName: "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID",
                label: "Google Tag Manager container ID",
        },
        {
                privateName: "ZOHO_SALES_IQ_WIDGET_CODE",
                fallbackName: "NEXT_PUBLIC_ZOHOSALESIQ_WIDGETCODE",
                label: "Zoho SalesIQ widget code",
        },
];

const missing: string[] = [];
const fallbackWarnings: string[] = [];

for (const field of fields) {
        const privateValue = process.env[field.privateName];
        const fallbackValue = process.env[field.fallbackName];

        if (!privateValue && !fallbackValue) {
                missing.push(
                        `• ${field.label} is missing. Add ${field.privateName} to your environment and restart the dev server.`,
                );
                continue;
        }

        if (!privateValue && fallbackValue) {
                fallbackWarnings.push(
                        `• Using ${field.fallbackName} fallback for ${field.label}. Prefer configuring ${field.privateName}.`,
                );
        }
}

if (fallbackWarnings.length > 0) {
        console.warn("[analytics-env] Development fallbacks in use:\n" + fallbackWarnings.join("\n"));
}

if (missing.length > 0) {
        console.error("[analytics-env] Missing analytics configuration:\n" + missing.join("\n"));
        console.error("Analytics providers will not load until these values are provided and the server is restarted.\n");
} else {
        console.log("[analytics-env] Analytics environment variables detected.");
}
