import type { DataModuleKey, DataModuleModule } from "@/data/__generated__/manifest";
import * as aboutHeroModule from "../about/hero";
import * as aboutMarqueeModule from "../about/marquee";
import * as aboutMilestonesModule from "../about/milestones";
import * as aboutTeamModule from "../about/team";
import * as aboutTimelineModule from "../about/timeline";
import * as affiliateModule from "../affiliate/index";
import * as authFormfieldsModule from "../auth/formFields";
import * as authResetpasswordModule from "../auth/resetPassword";
import * as authSigninModule from "../auth/signIn";
import * as authSignupModule from "../auth/signUp";
import * as bentoCasestudyModule from "../bento/caseStudy";
import * as bentoLandingsnapshotModule from "../bento/landingSnapshot";
import * as bentoMainModule from "../bento/main";
import * as casestudyCasestudiesModule from "../caseStudy/caseStudies";
import * as casestudySlugdetailsCopyModule from "../caseStudy/slugDetails/copy";
import * as casestudySlugdetailsTestimonialsModule from "../caseStudy/slugDetails/testimonials";
import * as categoriesModule from "../categories";
import * as companyModule from "../company";
import * as constantsBookingModule from "../constants/booking";
import * as constantsLegalCookiesModule from "../constants/legal/cookies";
import * as constantsLegalGdprModule from "../constants/legal/GDPR";
import * as constantsLegalHippaModule from "../constants/legal/hippa";
import * as constantsLegalPiiModule from "../constants/legal/PII";
import * as constantsLegalPrivacyModule from "../constants/legal/privacy";
import * as constantsLegalTcpcomplianceModule from "../constants/legal/tcpCompliance";
import * as constantsLegalTermsModule from "../constants/legal/terms";
import * as constantsSeoModule from "../constants/seo";
import * as contactAffiliateModule from "../contact/affiliate";
import * as contactAuthformfieldsModule from "../contact/authFormFields";
import * as contactFormfieldsModule from "../contact/formFields";
import * as contactPilotformfieldsModule from "../contact/pilotFormFields";
import * as discountModule from "../discount/index";
import * as discountMockdiscountcodesModule from "../discount/mockDiscountCodes";
import * as eventsModule from "../events/index";
import * as faqDefaultModule from "../faq/default";
import * as featuresModule from "../features/index";
import * as featuresDealScalesTimelineModule from "../features/deal_scales_timeline";
import * as featuresFeatureTimelineModule from "../features/feature_timeline";
import * as landingStrapilandingcontentModule from "../landing/strapiLandingContent";
import * as layoutNavModule from "../layout/nav";
import * as legalLegaldocumentsModule from "../legal/legalDocuments";
import * as mediumPostModule from "../medium/post";
import * as mlspropertiesModule from "../mlsProperties";
import * as partnersModule from "../partners/index";
import * as portfolioModule from "../portfolio/index";
import * as productsModule from "../products/index";
import * as productsAgentsModule from "../products/agents";
import * as productsCopyModule from "../products/copy";
import * as productsCreditsModule from "../products/credits";
import * as productsEssentialsModule from "../products/essentials";
import * as productsFreeResourceCopyModule from "../products/free-resource-copy";
import * as productsFreeResourcesModule from "../products/free-resources";
import * as productsHeroModule from "../products/hero";
import * as productsLicenseModule from "../products/license";
import * as productsNotionModule from "../products/notion";
import * as productsReviewsModule from "../products/reviews";
import * as productsSizingchartModule from "../products/sizingChart";
import * as productsWorkflowModule from "../products/workflow";
import * as projectsModule from "../projects";
import * as serviceServicesModule from "../service/services";
import * as serviceSlugDataConsultationstepsModule from "../service/slug_data/consultationSteps";
import * as serviceSlugDataCopyrightModule from "../service/slug_data/copyright";
import * as serviceSlugDataFaqModule from "../service/slug_data/faq";
import * as serviceSlugDataHowItWorksModule from "../service/slug_data/how_it_works";
import * as serviceSlugDataIntegrationsModule from "../service/slug_data/integrations";
import * as serviceSlugDataMethodologiesModule from "../service/slug_data/methodologies/index";
import * as serviceSlugDataPricingModule from "../service/slug_data/pricing";
import * as serviceSlugDataPricingOtherModule from "../service/slug_data/pricing/other";
import * as serviceSlugDataProblemsSolutionsModule from "../service/slug_data/problems_solutions";
import * as serviceSlugDataTestimonialsModule from "../service/slug_data/testimonials";
import * as serviceSlugDataTrustedcompaniesModule from "../service/slug_data/trustedCompanies";
import * as shippingModule from "../shipping/index";
import * as skipttraceexampleModule from "../skiptTraceExample/index";
import * as socialShareModule from "../social/share";
import * as transcriptsModule from "../transcripts/index";
import * as transcriptsVoicecloningafterModule from "../transcripts/voiceCloningAfter";
import * as transcriptsVoicecloningbeforeModule from "../transcripts/voiceCloningBefore";
import * as valuesModule from "../values/index";
import * as worklowDslModule from "../worklow/dsl";

export const dataModules = {
        "about/hero": aboutHeroModule,
        "about/marquee": aboutMarqueeModule,
        "about/milestones": aboutMilestonesModule,
        "about/team": aboutTeamModule,
        "about/timeline": aboutTimelineModule,
        affiliate: affiliateModule,
        "auth/formFields": authFormfieldsModule,
        "auth/resetPassword": authResetpasswordModule,
        "auth/signIn": authSigninModule,
        "auth/signUp": authSignupModule,
        "bento/caseStudy": bentoCasestudyModule,
        "bento/landingSnapshot": bentoLandingsnapshotModule,
        "bento/main": bentoMainModule,
        "caseStudy/caseStudies": casestudyCasestudiesModule,
        "caseStudy/slugDetails/copy": casestudySlugdetailsCopyModule,
        "caseStudy/slugDetails/testimonials": casestudySlugdetailsTestimonialsModule,
        categories: categoriesModule,
        company: companyModule,
        "constants/booking": constantsBookingModule,
        "constants/legal/cookies": constantsLegalCookiesModule,
        "constants/legal/GDPR": constantsLegalGdprModule,
        "constants/legal/hippa": constantsLegalHippaModule,
        "constants/legal/PII": constantsLegalPiiModule,
        "constants/legal/privacy": constantsLegalPrivacyModule,
        "constants/legal/tcpCompliance": constantsLegalTcpcomplianceModule,
        "constants/legal/terms": constantsLegalTermsModule,
        "constants/seo": constantsSeoModule,
        "contact/affiliate": contactAffiliateModule,
        "contact/authFormFields": contactAuthformfieldsModule,
        "contact/formFields": contactFormfieldsModule,
        "contact/pilotFormFields": contactPilotformfieldsModule,
        discount: discountModule,
        "discount/mockDiscountCodes": discountMockdiscountcodesModule,
        events: eventsModule,
        "faq/default": faqDefaultModule,
        features: featuresModule,
        "features/deal_scales_timeline": featuresDealScalesTimelineModule,
        "features/feature_timeline": featuresFeatureTimelineModule,
        "landing/strapiLandingContent": landingStrapilandingcontentModule,
        "layout/nav": layoutNavModule,
        "legal/legalDocuments": legalLegaldocumentsModule,
        "medium/post": mediumPostModule,
        mlsProperties: mlspropertiesModule,
        partners: partnersModule,
        portfolio: portfolioModule,
        products: productsModule,
        "products/agents": productsAgentsModule,
        "products/copy": productsCopyModule,
        "products/credits": productsCreditsModule,
        "products/essentials": productsEssentialsModule,
        "products/free-resource-copy": productsFreeResourceCopyModule,
        "products/free-resources": productsFreeResourcesModule,
        "products/hero": productsHeroModule,
        "products/license": productsLicenseModule,
        "products/notion": productsNotionModule,
        "products/reviews": productsReviewsModule,
        "products/sizingChart": productsSizingchartModule,
        "products/workflow": productsWorkflowModule,
        projects: projectsModule,
        "service/services": serviceServicesModule,
        "service/slug_data/consultationSteps": serviceSlugDataConsultationstepsModule,
        "service/slug_data/copyright": serviceSlugDataCopyrightModule,
        "service/slug_data/faq": serviceSlugDataFaqModule,
        "service/slug_data/how_it_works": serviceSlugDataHowItWorksModule,
        "service/slug_data/integrations": serviceSlugDataIntegrationsModule,
        "service/slug_data/methodologies": serviceSlugDataMethodologiesModule,
        "service/slug_data/pricing": serviceSlugDataPricingModule,
        "service/slug_data/pricing/other": serviceSlugDataPricingOtherModule,
        "service/slug_data/problems_solutions": serviceSlugDataProblemsSolutionsModule,
        "service/slug_data/testimonials": serviceSlugDataTestimonialsModule,
        "service/slug_data/trustedCompanies": serviceSlugDataTrustedcompaniesModule,
        shipping: shippingModule,
        skiptTraceExample: skipttraceexampleModule,
        "social/share": socialShareModule,
        transcripts: transcriptsModule,
        "transcripts/voiceCloningAfter": transcriptsVoicecloningafterModule,
        "transcripts/voiceCloningBefore": transcriptsVoicecloningbeforeModule,
        values: valuesModule,
        "worklow/dsl": worklowDslModule,
} as const satisfies { [K in DataModuleKey]: DataModuleModule<K> };

export type DataModules = typeof dataModules;

export const dataModuleKeys = Object.keys(dataModules) as DataModuleKey[];

export function getDataModule<K extends DataModuleKey>(key: K): DataModuleModule<K> {
        return dataModules[key];
}

