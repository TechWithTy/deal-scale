import type { ProductType } from "@/types/products";
import { LicenseType, ProductCategory } from "@/types/products";

const BASE_AGENT_IMAGE = "/products/workflows.png";

export const agentProducts: ProductType[] = [
        {
                id: "atlas-voice-concierge",
                name: "Atlas Voice Concierge Agent",
                description:
                        "Launch a ready-to-deploy voice concierge that qualifies inbound seller calls, books appointments, and syncs conversations back to your CRM.",
                price: 349,
                sku: "AG-VOICE-ATLAS",
                slug: "atlas-voice-concierge",
                licenseName: LicenseType.Proprietary,
                categories: [
                        ProductCategory.Agents,
                        ProductCategory.Automation,
                        ProductCategory.Monetize,
                ],
                images: [BASE_AGENT_IMAGE],
                types: [
                        { name: "Monthly License", value: "monthly", price: 349 },
                        { name: "One-Time Launch", value: "one-time", price: 899 },
                ],
                reviews: [],
                colors: [],
                sizes: [],
                faqs: [
                        {
                                question: "What does the Atlas voice agent handle?",
                                answer:
                                        "Atlas manages the entire call flow—from greeting the homeowner to capturing property details and booking appointments on your calendar.",
                        },
                        {
                                question: "Can I customize the call script?",
                                answer:
                                        "Yes. Upload your own persona and sales script to tailor how Atlas speaks with prospects.",
                        },
                ],
                agent: {
                        id: "agent-atlas-voice",
                        name: "Atlas Voice Concierge",
                        type: "phone",
                        description:
                                "AI voice concierge optimized for motivated seller and inbound hotline campaigns.",
                        image: BASE_AGENT_IMAGE,
                        isPublic: true,
                        isFree: false,
                        priceMultiplier: 4,
                        billingCycle: "monthly",
                        voice: "atlas-signature-voice",
                        backgroundNoise: "modern-loft",
                        voicemailScript: "atlas-voicemail-script",
                        campaignGoal: "Qualify and convert inbound seller leads",
                        salesScript:
                                "Guide homeowners through a 5-point qualification workflow and book an appraisal on the first call.",
                        persona:
                                "Confident, empathetic concierge with deep knowledge of the local market and a focus on appointment setting.",
                },
        },
        {
                id: "meridian-direct-mail",
                name: "Meridian Direct Mail Agent",
                description:
                        "Automate follow-up for your direct mail drops with personalized SMS, voicemail, and landing page experiences.",
                price: 279,
                sku: "AG-DIRECT-MERIDIAN",
                slug: "meridian-direct-mail-agent",
                licenseName: LicenseType.Proprietary,
                categories: [
                        ProductCategory.Agents,
                        ProductCategory.Automation,
                        ProductCategory.Workflows,
                ],
                images: [BASE_AGENT_IMAGE],
                types: [
                        { name: "Campaign Bundle", value: "campaign", price: 279 },
                        { name: "Direct Mail + Nurture", value: "bundle", price: 699 },
                ],
                reviews: [],
                colors: [],
                sizes: [],
                faqs: [
                        {
                                question: "What files are included?",
                                answer:
                                        "You receive pre-formatted postcard, letter, and door hanger templates, along with nurture automations for every response scenario.",
                        },
                        {
                                question: "Does it integrate with my CRM?",
                                answer:
                                        "Meridian posts every response and appointment back to your CRM or Google Sheet via Zapier.",
                        },
                ],
                agent: {
                        id: "agent-meridian-direct-mail",
                        name: "Meridian Direct Mail",
                        type: "direct mail",
                        description:
                                "Hybrid agent that connects your offline direct mail campaigns with automated follow-up.",
                        image: BASE_AGENT_IMAGE,
                        isPublic: true,
                        isFree: false,
                        priceMultiplier: 3,
                        billingCycle: "one-time",
                        campaignGoal: "Re-engage homeowners who respond to direct mail",
                        salesScript:
                                "Convert mail callbacks with conversational SMS, voicemail drops, and landing page CTAs.",
                        persona:
                                "Friendly neighborhood specialist focused on fast turnaround and property assessments.",
                        directMailTemplates: [
                                { name: "Postcard - Motivated Seller", version: "v1.2" },
                                { name: "Letter - Absentee Owner", version: "v1.0" },
                                { name: "Door Hanger - Probate", version: "v1.1" },
                        ],
                },
        },
        {
                id: "pulse-social-agent",
                name: "Pulse Social Media Agent",
                description:
                        "Deploy an omnichannel social presence that schedules posts, replies to inbound DMs, and routes high-intent leads to your team.",
                price: 229,
                sku: "AG-SOCIAL-PULSE",
                slug: "pulse-social-agent",
                licenseName: LicenseType.Proprietary,
                categories: [
                        ProductCategory.Agents,
                        ProductCategory.Monetize,
                        ProductCategory.Automation,
                ],
                images: [BASE_AGENT_IMAGE],
                types: [
                        { name: "Social Starter", value: "starter", price: 229 },
                        { name: "Social Pro", value: "pro", price: 529 },
                ],
                reviews: [],
                colors: [],
                sizes: [],
                faqs: [
                        {
                                question: "Which platforms are supported?",
                                answer:
                                        "Pulse includes pre-built prompts for Instagram, Facebook, TikTok, and LinkedIn.",
                        },
                        {
                                question: "Can Pulse reply to DMs?",
                                answer:
                                        "Yes. Pulse triages DMs, captures lead intel, and books callbacks using your calendar links.",
                        },
                ],
                agent: {
                        id: "agent-pulse-social",
                        name: "Pulse Social",
                        type: "social",
                        description:
                                "Omnichannel social agent with brand-ready assets, DM routing, and customizable color palettes.",
                        image: BASE_AGENT_IMAGE,
                        isPublic: true,
                        isFree: false,
                        priceMultiplier: 2,
                        billingCycle: "monthly",
                        avatar: "pulse-avatar-neon",
                        avatarImage: "/products/avatars/pulse.png",
                        backgroundVideo: "pulse-social-loop.mp4",
                        backgroundImage: "pulse-gradient.png",
                        color1: "#1F6FEB",
                        color2: "#A855F7",
                        color3: "#F97316",
                        socialAssets: [
                                "instagram_story_template.png",
                                "facebook_carousel_template.png",
                                "tiktok_hook_variations.pdf",
                        ],
                        campaignGoal: "Fill the top of funnel with warm social leads",
                        salesScript:
                                "Engage followers with conversational prompts and escalate hot leads to the sales team.",
                        persona:
                                "Energetic social strategist who speaks with hype, urgency, and authenticity.",
                },
        },
];
