# language: en
@strapi @landing @integration
Feature: Render landing page content from Strapi-managed single types
  # Drives the implementation steps documented in `_docs/strapi/landing-page-gap-integration-plan.md`.
  # Ensures every section that previously relied on hard-coded copy accepts dynamic props from Strapi.

  Background:
    Given Strapi contains published entries for all landing single types
    And `src/app/page.tsx` fetches landing content via `getLandingContent()`

  Scenario Outline: Hydrate <section> copy from Strapi
    Given the "<component>" component currently renders static defaults
    And Strapi exposes the "<strapi_type>" single type
    When the landing page loader provides the Strapi payload to "<component>"
    Then the <section> on the landing page reflects the Strapi-managed content
    And the component only falls back to hard-coded copy when Strapi returns empty values

    Examples:
      | section                | strapi_type            | component                                                   |
      | hero                   | landing-hero           | src/components/home/heros/HeroSessionMonitorClientWithModal.tsx |
      | trusted by header      | trusted-by-band        | src/components/contact/utils/TrustedByScroller.tsx          |
      | services framing       | landing-services       | src/components/home/Services.tsx                            |
      | upcoming features      | feature-vote-header    | src/components/home/FeatureVote.tsx                         |
      | case studies preview   | case-studies-preview   | src/components/case-studies/CaseStudyGrid.tsx               |
      | testimonials header    | testimonials-header    | src/components/home/Testimonials.tsx                        |
      | faq call to action     | faq-cta                | src/components/faq/index.tsx                                |
      | pricing header         | pricing-header         | src/components/home/Pricing.tsx                             |
      | about highlight        | about-highlight        | src/components/about/AboutUsSection.tsx                     |
      | bento header           | bento-header           | src/components/home/ClientBento.tsx                         |
      | blog preview header    | blog-preview           | src/components/home/BlogPreview.tsx                         |
      | beta form header       | beta-form-header       | src/components/contact/form/ContactForm.tsx                 |

  Scenario: Provide highlight word gradients from Strapi
    Given the hero highlight words are represented in Strapi as repeatable components
    When `HeroSessionMonitor.tsx` receives the highlight word array from `landing-hero`
    Then it renders each gradient and label exactly as defined in Strapi

  Scenario: Allow marketing to update CTAs without redeploys
    Given Strapi stores CTA label and URL fields for hero, pricing, and blog sections
    When an admin updates the CTA values in Strapi and publishes the entries
    Then the landing page renders the new CTA labels and targets after the next ISR revalidation

  Scenario: Handle Strapi outages gracefully
    Given `getLandingContent()` wraps all Strapi requests in error handling
    When Strapi returns a 500 response
    Then the landing page logs the error server-side
    And each component renders its existing hard-coded defaults to avoid blank sections

  Scenario: Validate integration with automated tests
    Given tests exist in `src/__tests__/landing-content-fetch.test.ts`
    When the tests mock Strapi responses with updated copy
    Then the rendered landing page snapshot reflects the mocked Strapi content
    And tests asserting fallback behavior also pass
