import {
        ProductCategory,
        type ProductResource,
        type ProductType,
} from "@/types/products";

const defaultTypes: ProductType["types"] = [
        { name: "Download", value: "download", price: 0 },
];

const defaultColors: ProductType["colors"] = [];

const defaultSizes: ProductType["sizes"] = [];

const workbookResource: ProductResource = {
        type: "download",
        url: "https://assets.dealscale.ai/free-resources/deal-analyzer-workbook.pdf",
        fileName: "deal-analyzer-workbook.pdf",
        fileSize: "2.4 MB",
        demoUrl: "https://app.supademo.com/embed/9J8F7KZ",
};

const outreachResource: ProductResource = {
        type: "external",
        url: "https://dealscale.notion.site/Cold-Outreach-Message-Pack-0c3e32d1f3d34f0e87a91f6136489bd1",
        demoUrl: "https://app.supademo.com/embed/7L5Q3VA",
};

export const freeResourceProducts: ProductType[] = [
        {
                id: "deal-analyzer-workbook",
                name: "Deal Analyzer Workbook",
                description:
                        "Download a guided, spreadsheet-ready workbook that helps you evaluate real estate investment opportunities in minutes.",
                price: 0,
                sku: "FREE-RESOURCE-DA-001",
                slug: "deal-analyzer-workbook",
                categories: [
                        ProductCategory.FreeResources,
                        ProductCategory.Workflows,
                        ProductCategory.Essentials,
                ],
                images: ["/products/essentials.png"],
                types: defaultTypes,
                reviews: [],
                colors: defaultColors,
                sizes: defaultSizes,
                faqs: [
                        {
                                question: "What formats are included?",
                                answer:
                                        "The workbook ships in Google Sheets and Excel-ready formats with formulas to automate ROI calculations.",
                        },
                        {
                                question: "How often is the workbook updated?",
                                answer:
                                        "We refresh the templates quarterly with the latest acquisition metrics and underwriting assumptions we use internally at Deal Scale.",
                        },
                ],
                resource: workbookResource,
        },
        {
                id: "cold-outreach-message-pack",
                name: "Cold Outreach Message Pack",
                description:
                        "Access 15+ proven SMS, email, and voicemail scripts tailored for motivated seller lead generation.",
                price: 0,
                sku: "FREE-RESOURCE-OUTREACH-001",
                slug: "cold-outreach-message-pack",
                categories: [
                        ProductCategory.FreeResources,
                        ProductCategory.Automation,
                        ProductCategory.Monetize,
                ],
                images: ["/products/workflows.png"],
                types: defaultTypes,
                reviews: [],
                colors: defaultColors,
                sizes: defaultSizes,
                faqs: [
                        {
                                question: "Is there guidance on when to send each message?",
                                answer:
                                        "Yes. Each script includes recommended timing, target persona, and follow-up notes to keep your cadence on track.",
                        },
                        {
                                question: "Can I edit the templates for my market?",
                                answer:
                                        "Absolutely—duplicate the Notion workspace and customize the scripts with your brand voice and service areas.",
                        },
                ],
                resource: outreachResource,
        },
].map((product) => ({
        ...product,
        colors: product.colors ?? defaultColors,
        sizes: product.sizes ?? defaultSizes,
        types: product.types ?? defaultTypes,
}));
