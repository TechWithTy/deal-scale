# language: en
@strapi @landing @export
Feature: Export landing page static content into Strapi
  # Mirrors the implementation roadmap documented in `_docs/strapi/landing-page-export-plan.md`.
  # Ensures every hard-coded dataset gains a deterministic JSON artifact for Strapi import.

  Background:
    Given Strapi is running locally with the landing content types defined
    And the repository contains landing data modules under "src/data"
    And the CLI command `pnpm export:landing` is available

  Scenario Outline: Export <dataset> data for Strapi seeding
    Given the <dataset> source module is located at "<source>"
    When the developer runs `pnpm export:landing --entity <entity>`
    Then the exporter writes "<output>" containing records for the Strapi "<target_type>"
    And each record matches the schema defined for "<target_type>"

    Examples:
      | dataset              | source                                               | entity            | target_type            | output                                              |
      | services catalogue   | src/data/service/services/index.ts                  | services          | services               | content/strapi-export/landing/services.json         |
      | service categories   | src/data/service/services/categories.ts             | serviceCategories | service-categories     | content/strapi-export/landing/service-categories.json |
      | pricing plans        | src/data/service/slug_data/pricing.ts               | pricingPlans      | pricing-plans          | content/strapi-export/landing/pricing-plans.json    |
      | testimonials         | src/data/service/slug_data/testimonials.ts          | testimonials      | testimonials           | content/strapi-export/landing/testimonials.json     |
      | partner logos        | src/data/service/slug_data/trustedCompanies.ts      | companyLogos      | company-logos          | content/strapi-export/landing/company-logos.json    |
      | case studies         | src/data/caseStudy/caseStudies.ts                   | caseStudies       | case-studies           | content/strapi-export/landing/case-studies.json     |
      | faq entries          | src/data/faq/default.ts                             | faqItems          | faq-items              | content/strapi-export/landing/faq-items.json        |
      | bento features       | src/data/bento/main.ts                              | bentoFeatures     | bento-features         | content/strapi-export/landing/bento-features.json   |
      | blog fallback posts  | src/data/medium/posts.ts                            | blogFallbacks     | blog-fallbacks         | content/strapi-export/landing/blog-fallbacks.json   |
      | contact form options | src/data/contact/formFields.ts                      | formOptions       | form-options           | content/strapi-export/landing/form-options.json     |
      | seo defaults         | src/data/constants/seo.ts                           | seoDefaults       | seo-defaults           | content/strapi-export/landing/seo-defaults.json     |

  Scenario: Persist relation metadata for downstream imports
    Given the exporter resolves parent-child relationships among landing entities
    When the developer runs `pnpm export:landing`
    Then the exporter emits relation mapping files under "content/strapi-export/landing/meta"
    And every relation ID references a record produced in the same export run

  Scenario: Validate export artifacts before committing
    Given unit tests exist in "__tests__/strapi/export-landing.test.ts"
    When the developer executes `pnpm test -- export-landing`
    Then all schema validation tests pass
    And the snapshot of exported file counts matches the expected landing inventory

  Scenario: Document exported entities for content editors
    Given the export completes without errors
    When the developer records the generated Strapi IDs and slugs in `_docs/strapi/content-mapping.md`
    Then content editors can map each landing section to its Strapi entry during QA
