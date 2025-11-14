# Zoho Recruit Careers Page SEO Integration Plan

## Overview

Integrate the approved Zoho Recruit careers page (`https://dealscale.zohorecruit.com/jobs/Careers`) into DealScale's SEO, AEO, and discoverability infrastructure to maximize organic visibility for job postings.

## Current State

- `/careers` route redirects to `https://dealscale.zohorecruit.com/jobs/Careers`
- Redirect is set to `permanent: false` in `next.config.ts`
- Careers page has `robots: { index: false }` - **preventing indexing**
- Careers is excluded from sitemap
- Organization schema doesn't include careers URL in `sameAs` array

## Integration Strategy

### Option A: Keep Redirect + External URL Optimization (Recommended for Quick Win)

Keep the redirect but optimize SEO signals pointing to the external URL.

**Pros:**
- Quick to implement
- No content management overhead
- Leverages Zoho Recruit's built-in features

**Cons:**
- Less control over SEO
- External URL receives link equity, not internal page

### Option B: Hybrid Approach (Recommended Long-term)

Create an internal `/careers` page that embeds/links to Zoho while maintaining our own SEO-optimized page with JobPosting schema.

**Pros:**
- Full control over SEO metadata
- Can add JobPosting schema per job
- Better for entity linking
- Can add custom content (company culture, benefits, etc.)

**Cons:**
- Requires maintaining sync with Zoho jobs
- More implementation work

## Implementation Plan

### Phase 1: Immediate SEO Signals (Option A - Quick Win)

#### 1.1 Add Careers URL to Organization Schema

Update `src/utils/seo/schema/helpers.ts` to include careers URL in `sameAs`:

```typescript
export const buildSocialProfiles = (): string[] => {
        const { socialLinks } = companyData;
        const CAREERS_URL = "https://dealscale.zohorecruit.com/jobs/Careers";
        
        const socialUrls = [
                socialLinks.linkedin,
                socialLinks.facebook,
                socialLinks.instagram,
                socialLinks.mediumUsername && socialLinks.mediumUsername.trim().length > 0
                        ? `https://medium.com/@${socialLinks.mediumUsername.trim()}`
                        : undefined,
                CAREERS_URL, // Add careers URL
        ].filter((link): link is string => Boolean(link));

        return socialUrls;
};
```

**Impact**: Links careers page to Organization entity graph, improving entity authority signals.

#### 1.2 Update Careers Page Metadata

Update `src/app/careers/page.tsx` to enable indexing and set proper canonical:

```typescript
export async function generateMetadata(): Promise<Metadata> {
        const seo = getStaticSeo("/careers");
        const CAREERS_URL = "https://dealscale.zohorecruit.com/jobs/Careers";
        
        return {
                ...mapSeoMetaToMetadata(seo),
                title: "Careers at DealScale - Join Our Team",
                description: "Explore open roles at DealScale. We're building AI-powered tools for real estate professionals. Join us in revolutionizing the industry.",
                alternates: {
                        canonical: CAREERS_URL, // Point canonical to external URL
                },
                robots: {
                        index: true, // ✅ Enable indexing
                        follow: true,
                        googleBot: {
                                index: true,
                                follow: true,
                        },
                },
                openGraph: {
                        title: "Careers at DealScale",
                        description: "Join our team and help build the future of real estate technology.",
                        url: CAREERS_URL,
                        type: "website",
                },
                twitter: {
                        card: "summary_large_image",
                        title: "Careers at DealScale",
                        description: "Explore open roles at DealScale.",
                },
        };
}
```

**Impact**: Enables search engines to index the careers page and understand the relationship between `/careers` and the external URL.

#### 1.3 Update Sitemap to Include Careers

Update `src/app/sitemap.ts` to include careers entry:

```typescript
const staticPaths = [
        // ... existing paths
        "/careers", // ✅ Add careers back
];

// Update the comment
// ! /careers redirects to Zoho Recruit but should be indexed for SEO signals
```

**Impact**: Ensures careers page is discoverable in sitemap submissions.

#### 1.4 Update Redirect to Permanent

Change redirect in `next.config.ts` from temporary to permanent:

```typescript
{
        source: "/careers",
        destination: "https://dealscale.zohorecruit.com/jobs/Careers",
        permanent: true, // ✅ Change to true (was false)
},
```

**Impact**: 301 redirect passes link equity properly and signals to search engines this is a permanent redirect.

#### 1.5 Update SEO Plan Documentation

Update `_docs/_business/seo/plan.md` to reflect careers integration:

```markdown
- **/careers**
  - ✅ Integrated Zoho Recruit careers page into SEO
  - External URL added to Organization schema `sameAs` array
  - Careers page metadata updated to enable indexing
  - Permanent redirect established from `/careers` to external URL
  - Sitemap includes careers entry
```

### Phase 2: JobPosting Schema Integration (Option B - Enhanced)

#### 2.1 Create JobPosting Schema Builder

Create `src/utils/seo/schema/jobPosting.ts`:

```typescript
import { ORGANIZATION_ID, SCHEMA_CONTEXT } from "./helpers";
import type { JobPostingSchema } from "./types";

export interface JobPostingInput {
        title: string;
        description: string;
        employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN";
        location?: {
                addressLocality?: string;
                addressRegion?: string;
                addressCountry?: string;
                remote?: boolean;
        };
        baseSalary?: {
                currency: string;
                value?: {
                        min?: number;
                        max?: number;
                };
        };
        datePosted: string; // ISO 8601
        validThrough?: string; // ISO 8601
        jobLocationType?: "TELECOMMUTE" | "PLACE";
        hiringOrganizationName?: string;
        applicationUrl: string;
}

export function buildJobPostingSchema(input: JobPostingInput): JobPostingSchema {
        const locationType = input.location?.remote 
                ? "TELECOMMUTE" 
                : (input.jobLocationType || "PLACE");

        return {
                "@context": SCHEMA_CONTEXT,
                "@type": "JobPosting",
                title: input.title,
                description: input.description,
                employmentType: input.employmentType,
                datePosted: input.datePosted,
                validThrough: input.validThrough,
                jobLocationType: locationType,
                hiringOrganization: {
                        "@type": "Organization",
                        "@id": ORGANIZATION_ID,
                        name: input.hiringOrganizationName || "DealScale",
                        sameAs: "https://www.dealscale.io",
                },
                jobLocation: input.location && !input.location.remote ? {
                        "@type": "Place",
                        address: {
                                "@type": "PostalAddress",
                                addressLocality: input.location.addressLocality,
                                addressRegion: input.location.addressRegion,
                                addressCountry: input.location.addressCountry || "US",
                        },
                } : undefined,
                baseSalary: input.baseSalary ? {
                        "@type": "MonetaryAmount",
                        currency: input.baseSalary.currency,
                        value: input.baseSalary.value ? {
                                "@type": "QuantitativeValue",
                                minValue: input.baseSalary.value.min,
                                maxValue: input.baseSalary.value.max,
                        } : undefined,
                } : undefined,
                applicantLocationRequirements: input.location?.remote ? {
                        "@type": "Country",
                        name: "United States", // Adjust as needed
                } : undefined,
                url: input.applicationUrl,
        };
}
```

#### 2.2 Create Zoho Recruit API Integration

Create `src/lib/zoho-recruit/client.ts`:

```typescript
/**
 * Zoho Recruit API Client
 * Fetches job postings from Zoho Recruit for SEO purposes
 */

export interface ZohoJob {
        id: string;
        title: string;
        description: string;
        employmentType: string;
        location: {
                city?: string;
                state?: string;
                country?: string;
        };
        datePosted: string;
        applicationUrl: string;
        // ... other fields
}

export async function fetchZohoJobs(): Promise<ZohoJob[]> {
        const API_KEY = process.env.ZOHO_RECRUIT_API_KEY;
        const API_URL = process.env.ZOHO_RECRUIT_API_URL || 
                "https://recruit.zoho.com/recruit/private/json/Jobs/getRecords";

        if (!API_KEY) {
                console.warn("[Zoho Recruit] API key not configured");
                return [];
        }

        try {
                const response = await fetch(
                        `${API_URL}?apikey=${API_KEY}&scope=recruitapi`,
                        {
                                headers: {
                                        "Content-Type": "application/json",
                                },
                                next: { revalidate: 3600 }, // Cache for 1 hour
                        }
                );

                if (!response.ok) {
                        throw new Error(`Zoho API error: ${response.status}`);
                }

                const data = await response.json();
                // Normalize Zoho response to our format
                return normalizeZohoJobs(data);
        } catch (error) {
                console.error("[Zoho Recruit] Failed to fetch jobs:", error);
                return [];
        }
}

function normalizeZohoJobs(data: unknown): ZohoJob[] {
        // Transform Zoho API response to our interface
        // Implementation depends on Zoho API structure
        return [];
}
```

#### 2.3 Create Careers Page with Job Listings

Update `src/app/careers/page.tsx` to display jobs with schema:

```typescript
import { fetchZohoJobs } from "@/lib/zoho-recruit/client";
import { buildJobPostingSchema } from "@/utils/seo/schema/jobPosting";
import { SchemaInjector } from "@/utils/seo/schema";
import { ItemListSchema } from "@/utils/seo/schema/types";

export default async function CareersPage() {
        const jobs = await fetchZohoJobs();
        
        // Build JobPosting schemas for each job
        const jobSchemas = jobs.map(job => buildJobPostingSchema({
                title: job.title,
                description: job.description,
                employmentType: job.employmentType,
                location: job.location,
                datePosted: job.datePosted,
                applicationUrl: job.applicationUrl,
        }));

        // Build ItemList schema for jobs index
        const jobsItemList: ItemListSchema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "DealScale Job Openings",
                description: "Current open positions at DealScale",
                numberOfItems: jobs.length,
                itemListElement: jobs.map((job, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        item: {
                                "@type": "JobPosting",
                                name: job.title,
                                url: job.applicationUrl,
                        },
                })),
        };

        return (
                <>
                        <SchemaInjector schema={jobsItemList} />
                        {jobSchemas.map((schema, i) => (
                                <SchemaInjector key={i} schema={schema} />
                        ))}
                        
                        <div className="container">
                                <h1>Careers at DealScale</h1>
                                <p>Join us in revolutionizing real estate technology.</p>
                                
                                <div className="jobs-list">
                                        {jobs.map(job => (
                                                <JobCard key={job.id} job={job} />
                                        ))}
                                </div>
                                
                                {/* Link to Zoho for full application */}
                                <a 
                                        href="https://dealscale.zohorecruit.com/jobs/Careers"
                                        className="cta-button"
                                >
                                        View All Openings on Careers Portal
                                </a>
                        </div>
                </>
        );
}
```

### Phase 3: AEO & Discoverability Integration

#### 3.1 Update AEO Plan

Add to `_docs/_business/aeo/plan.md`:

```markdown
### Careers & Hiring Intent

- **FAQ Content**: Create FAQ sections answering common questions:
  - "What jobs are available at DealScale?"
  - "How do I apply for a position?"
  - "What benefits does DealScale offer?"
  - "What is the interview process like?"

- **Conversational Content**: Add structured answers about:
  - Company culture
  - Remote work policies
  - Benefits and perks
  - Growth opportunities

- **Schema**: Ensure JobPosting schema includes all required fields for AI parsing
```

#### 3.2 Update Discoverability Plan

Add to `_docs/_business/discoverability/discoverability.md`:

```markdown
### Careers Discovery

- **Internal Linking**: Add careers links to:
  - Footer navigation
  - About page
  - Blog posts about company culture
  - Case studies (if relevant)

- **External Signals**:
  - Submit to job boards (Indeed, LinkedIn, etc.) with backlinks
  - Include in company profiles
  - Mention in press releases and announcements
```

## Environment Variables

Add to `.env.local`:

```bash
# Zoho Recruit API (optional, for Phase 2)
ZOHO_RECRUIT_API_KEY=your_api_key_here
ZOHO_RECRUIT_API_URL=https://recruit.zoho.com/recruit/private/json/Jobs/getRecords
```

## Testing & Validation

### Phase 1 Validation

1. **Schema Validation**:
   - Run Google Rich Results Test: `https://search.google.com/test/rich-results`
   - Verify Organization schema includes careers URL in `sameAs`

2. **Sitemap Check**:
   - Verify `/careers` appears in sitemap: `https://www.dealscale.io/sitemap.xml`
   - Submit updated sitemap to Google Search Console

3. **Robots Check**:
   - Verify careers page allows indexing
   - Test with: `curl -A "Googlebot" https://www.dealscale.io/careers`

4. **Redirect Check**:
   - Verify redirect works: `curl -I https://www.dealscale.io/careers`
   - Should return `301` status with `Location: https://dealscale.zohorecruit.com/jobs/Careers`

### Phase 2 Validation

1. **JobPosting Schema**:
   - Test each job posting with Rich Results Test
   - Verify all required fields are present
   - Check for JobPosting rich snippets in Search Console

2. **API Integration**:
   - Test Zoho API connectivity
   - Verify error handling for API failures
   - Test caching behavior

## Implementation Checklist

### Phase 1: Quick Win (Immediate)
- [ ] Add careers URL to `buildSocialProfiles()` in `src/utils/seo/schema/helpers.ts`
- [ ] Update careers page metadata to enable indexing
- [ ] Change redirect from temporary to permanent
- [ ] Add `/careers` back to sitemap
- [ ] Update SEO plan documentation
- [ ] Test schema in Google Rich Results Test
- [ ] Submit updated sitemap to Search Console

### Phase 2: Enhanced (Future)
- [ ] Create JobPosting schema builder
- [ ] Create Zoho Recruit API client
- [ ] Update careers page to display jobs with schema
- [ ] Add FAQ content for AEO
- [ ] Test JobPosting schema validation
- [ ] Monitor job posting impressions in Search Console

### Phase 3: Optimization
- [ ] Add internal links to careers page
- [ ] Create careers landing page content
- [ ] Add structured FAQ content
- [ ] Monitor search performance
- [ ] Iterate based on analytics

## Success Metrics

- **Phase 1**:
  - ✅ Organization schema includes careers URL
  - ✅ Careers page indexed in Google
  - ✅ No robots.txt blocking
  - ✅ Sitemap includes careers entry

- **Phase 2**:
  - ✅ JobPosting schemas validated
  - ✅ Jobs appear in Google for Jobs
  - ✅ Rich snippets showing for job postings
  - ✅ Click-through rate from search results

## References

- [Zoho Recruit Careers Page](https://dealscale.zohorecruit.com/jobs/Careers)
- [Google JobPosting Schema](https://developers.google.com/search/docs/appearance/structured-data/job-posting)
- [Schema.org JobPosting](https://schema.org/JobPosting)
- Related docs: `_docs/_business/seo/plan.md`, `_docs/_business/aeo/plan.md`

