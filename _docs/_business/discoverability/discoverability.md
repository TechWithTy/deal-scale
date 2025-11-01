<project name="DealScale Full SEO + AEO Implementation" version="1.0">

  <role name="System Architect">
    <description>
      You are responsible for orchestrating all Next.js app updates required for full SEO (search engine optimization) 
      and AEO (answer engine optimization) capabilities across www.dealscale.io, blog.dealscale.io, and app.dealscale.io.
    </description>
  </role>

  <goal>
    <text>Transform DealScale into an AEO-ready, schema-validated, multi-domain SEO ecosystem.</text>
  </goal>

  <objectives>
    <objective>Enable SSR/ISR for /events, including dynamic slug pages.</objective>
    <objective>Integrate dynamic Schema.org JSON-LD injection across routes using a shared seo-core library.</objective>
    <objective>Add /partners and /careers (Zoho Recruit integration) with structured data.</objective>
    <objective>Add /linktree (Notion-powered resource hub) with ItemList schema for discoverability.</objective>
    <objective>Ensure AI and search engines can parse all public pages for entity context.</objective>
    <objective>Keep app.dealscale.io private yet contextually indexed as a SoftwareApplication schema.</objective>
  </objectives>

  <stylesheet>
    verbosity: high;
    tone: technical;
    output-format: roadmap + task breakdown;
  </stylesheet>

  <architecture>
    <let name="domains" value='["www.dealscale.io","blog.dealscale.io","app.dealscale.io"]' />
    <let name="schemaDir" value="packages/seo-core/schema" />
    <let name="eventRoute" value="apps/www/app/events/[slug]/page.tsx" />
  </architecture>

  <phase id="foundation" title="SEO/AEO Infrastructure Setup">
    <task>
      <title>Update robots.ts and sitemap.ts</title>
      <details>
        Allow public pages "/", "/features", "/pricing", "/case-studies", "/events", "/partners", "/careers".
        Disallow "/private", "/api", "/admin".
        Add "GPTBot", "PerplexityBot", and "ClaudeBot" under userAgent rules.
        Use priority 0.9 for /events and changefreq "daily".
      </details>
    </task>

    <task>
      <title>Create seo-core package (shared metadata + schema generation)</title>
      <path>packages/seo-core/</path>
      <files>
        index.ts, types.ts, constants.ts, SchemaInjector.tsx, generateSeoMeta.ts
      </files>
      <schemaGenerators>
        Organization, WebSite, Service, Product, Event, CreativeWork, ItemList, JobPosting, FAQPage
      </schemaGenerators>
      <description>
        Export reusable JSON-LD builders and SchemaInjector component for all routes.
        Use unified "@id": "https://www.dealscale.io/#organization" for entity linking.
      </description>
    </task>

    <task>
      <title>Global Entity Schema</title>
      <route>/</route>
      <inject type="Organization+WebSite" />
      <output>Static JSON-LD with sameAs linking to all subdomains + socials.</output>
    </task>
  </phase>

  <phase id="events" title="Events Infrastructure and Slug Routing">
    <task>
      <title>Implement /events Index Page</title>
      <path>apps/www/app/events/page.tsx</path>
      <description>
        Server-side fetch event data with revalidate=600.
        Render grid of events with meta, dates, and CTAs.
        Inject ItemList schema containing Event @types.
      </description>
    </task>

    <task>
      <title>Implement /events/[slug] Page</title>
      <path>{{ eventRoute }}</path>
      <description>
        SSR or ISR fetch single event details by slug.
        Add metadata: canonical, title, description.
        Inject Event schema with startDate, endDate, organizer, location, offers.
      </description>
      <example>
        <json>
          {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "From Cold Lead to Hot Appointment",
            "startDate": "2025-10-21T18:00:00-06:00",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "organizer": { "@type": "Organization", "name": "DealScale.io" }
          }
        </json>
      </example>
    </task>
  </phase>

  <phase id="partners" title="Partners Page and Schema Integration">
    <task>
      <title>Develop /partners Route</title>
      <path>apps/www/app/partners/page.tsx</path>
      <description>
        Render partner logos and links dynamically.
        Use Schema.org ItemList where each item is an Organization.
      </description>
      <example>
        <json>
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "DealScale Partners",
            "itemListElement": [
              {
                "@type": "Organization",
                "name": "Zoho",
                "url": "https://zoho.com",
                "description": "Recruitment and CRM partner"
              }
            ]
          }
        </json>
      </example>
    </task>
  </phase>

  <phase id="linktree" title="LinkTree Resource Hub Integration">
    <task>
      <title>Setup /linktree Route with SEO</title>
      <path>src/app/linktree/page.tsx</path>
      <description>
        ✅ Complete: Dynamic resource hub that fetches links from Notion database.
        - Added ItemList schema for structured data
        - Added SEO metadata (title, description, OpenGraph)
        - Included in sitemap for discoverability
        - Fetches from `/api/linktree` which queries Notion database (NOTION_REDIRECTS_ID)
        - Revalidates every 300 seconds for fresh content
        - Links include UTM tracking and click analytics
      </description>
    </task>

    <task>
      <title>ItemList Schema for LinkTree</title>
      <path>src/lib/linktree/schemaBuilders.ts</path>
      <description>
        ✅ Complete: Created `buildLinkTreeItemListSchema()` that generates ItemList schema
        for all links in the linktree. Each link includes position, URL, name, description,
        and nested WebPage item for richer structured data.
      </description>
    </task>
  </phase>

  <phase id="careers" title="Careers Integration with Zoho Recruit">
    <task>
      <title>Setup /careers Route</title>
      <path>apps/www/app/careers/page.tsx</path>
      <description>
        Prepare layout for job listings with Zoho Recruit data integration.
        Create API route /api/jobs to fetch and normalize Zoho job data.
      </description>
    </task>

    <task>
      <title>Add JobPosting Schema</title>
      <path>{{ schemaDir }}/JobPosting.ts</path>
      <inject type="JobPosting" />
      <example>
        <json>
          {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": "Frontend Engineer",
            "employmentType": "FULL_TIME",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "DealScale.io",
              "sameAs": "https://www.dealscale.io"
            },
            "jobLocation": {
              "@type": "Place",
              "address": { "addressLocality": "Remote", "addressCountry": "US" }
            }
          }
        </json>
      </example>
    </task>

    <task>
      <title>Zoho Recruit Integration Prep</title>
      <api>
        GET https://recruit.zoho.com/recruit/private/json/Jobs/getRecords?apikey={{ ZOHO_API_KEY }}
      </api>
      <next>
        Cache results for 1 hour with revalidate=3600.
        Map Zoho fields → JobPosting JSON-LD schema.
      </next>
    </task>
  </phase>

  <phase id="enhancements" title="Cross-Domain SEO and Blog Integration">
    <task>
      <title>Inject Blog Schema on Beehiiv</title>
      <domain>blog.dealscale.io</domain>
      <action>
        Add site-level <script type="application/ld+json"> for Blog and BlogPosting.
        Reference main org ID using "isPartOf": { "@id": "https://www.dealscale.io/#organization" }.
      </action>
    </task>

    <task>
      <title>Connect Case Studies Schema</title>
      <route>/case-studies/[slug]</route>
      <inject type="CreativeWork" />
      <details>
        Include author Organization and optional Review schema for client testimonials.
      </details>
    </task>
  </phase>

  <phase id="validation" title="Testing, Linting, and Metrics">
    <task>
      <title>Rich Result Validation</title>
      <criteria>
        <item>Organization, WebSite, Service, Product, Event, CreativeWork, ItemList, JobPosting</item>
      </criteria>
      <accept>All pass at https://search.google.com/test/rich-results</accept>
    </task>

    <task>
      <title>Lighthouse SEO + Performance</title>
      <thresholds>
        seo >= 95
        performance >= 90
      </thresholds>
    </task>

    <task>
      <title>Bot Snapshot Verification</title>
      <command>curl -A "Googlebot" https://www.dealscale.io/events</command>
      <expect>Returns rendered HTML, not placeholder text.</expect>
    </task>
  </phase>

  <phase id="analytics" title="AEO Observability & Monitoring">
    <task>
      <title>Add AEO Event Tracking</title>
      <tools>
        <tool>PostHog</tool>
        <tool>Plausible</tool>
      </tools>
      <metrics>
        schema_injected=true
        route_type
        schema_validation_status
      </metrics>
    </task>

    <task>
      <title>Connect Search Console + Zoho</title>
      <details>
        Submit new sitemaps (www + careers).
        Enable job posting monitoring under Google Index > Job listings.
        ✅ **Careers Integration Complete**: Added Zoho Recruit careers URL to Organization schema and enabled indexing.
      </details>
    </task>
  </phase>

  <phase id="future" title="Expansion & AEO Evolution">
    <ideas>
      <idea>Add FAQ-rich snippets across top routes (features, pricing).</idea>
      <idea>Add VideoObject schema for demo walkthroughs.</idea>
      <idea>Link internal search to WebSite.potentialAction for site search visibility.</idea>
      <idea>Explore AEO embeddings for voice agent queries.</idea>
    </ideas>
  </phase>

</project>
