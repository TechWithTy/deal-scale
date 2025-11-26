export type SchemaContext = "https://schema.org";

export type ContactPointSchema = {
	"@type": "ContactPoint";
	contactType: string;
	telephone?: string;
	email?: string;
	areaServed?: string[];
	availableLanguage?: string[];
};

export type PostalAddressSchema = {
	"@type": "PostalAddress";
	streetAddress: string;
	addressLocality?: string;
	addressRegion?: string;
	postalCode?: string;
	addressCountry?: string;
};

export type OfferInput = {
	price: number | string;
	priceCurrency: string;
	availability?: string;
	url?: string;
	validFrom?: string;
};

export type OfferSchema = OfferInput & {
	"@type": "Offer";
};

export type AggregateRatingSchema = {
	"@type": "AggregateRating";
	ratingValue: number;
	reviewCount: number;
	bestRating?: number;
	worstRating?: number;
	ratingExplanation?: string;
};

export type OrganizationSchema = {
	"@context": SchemaContext;
	"@type": "Organization";
	"@id": string;
	name: string;
	legalName: string;
	url: string;
	description: string;
	sameAs: string[];
	alternateName?: string | string[];
	foundingDate?: string;
	founder?: {
		"@type": "Person";
		name: string;
		jobTitle?: string;
		url?: string;
	};
	knowsAbout?: string[];
	brand?: {
		"@type": "Brand";
		name: string;
		logo?: string;
	};
	logo: string;
	image?: string | string[];
	contactPoint: ContactPointSchema[];
	address?: PostalAddressSchema;
	aggregateRating?: AggregateRatingSchema;
	review?: ReviewSchema[];
};

export type WebSiteSchema = {
	"@context": SchemaContext;
	"@type": "WebSite";
	"@id": string;
	url: string;
	name: string;
	description: string;
	publisher: {
		"@id": string;
	};
	potentialAction?: {
		"@type": "SearchAction";
		target: string;
		"query-input": string;
	};
	hasPart?: WebPageReference[];
};

export type WebPageReference = {
	"@type": "WebPage" | "CreativeWork";
	"@id": string;
	url: string;
	name?: string;
};

export type ServiceSchemaInput = {
	name: string;
	description: string;
	url: string;
	serviceType?: string;
	category?: string;
	areaServed?: string[];
	offers?: OfferInput;
	aggregateRating?: AggregateRatingSchema;
	reviews?: ReviewSchema[];
};

export type ServiceSchema = {
	"@context": SchemaContext;
	"@type": "Service";
	"@id": string;
	name: string;
	description: string;
	url: string;
	serviceType: string;
	category?: string;
	areaServed?: string[];
	provider: {
		"@id": string;
	};
	offers?: OfferSchema;
	aggregateRating?: AggregateRatingSchema;
	review?: ReviewSchema[];
};

export type ProductSchemaInput = {
	name: string;
	description: string;
	url: string;
	sku?: string;
	brand?: string;
	image?: string | string[];
	offers: OfferInput;
};

export type ProductSchema = {
	"@context": SchemaContext;
	"@type": "Product";
	"@id": string;
	name: string;
	description: string;
	url: string;
	sku?: string;
	brand: {
		"@type": "Brand";
		name: string;
	};
	image?: string[];
	offers: OfferSchema;
	manufacturer?: {
		"@id": string;
	};
	aggregateRating?: {
		"@type": "AggregateRating";
		ratingValue: number;
		reviewCount: number;
	};
};

export type ReviewRatingSchema = {
	"@type": "Rating";
	ratingValue: number;
	bestRating?: number;
	worstRating?: number;
	ratingExplanation?: string;
};

export type ReviewSchema = {
	"@type": "Review";
	name: string;
	reviewBody: string;
	datePublished?: string;
	itemReviewed?: {
		"@id"?: string;
		"@type"?: string;
		name?: string;
	};
	author?: {
		"@type": "Organization" | "Person";
		name: string;
		"@id"?: string;
	};
	publisher?: {
		"@type": "Organization" | "Person";
		name: string;
		url?: string;
	};
	reviewRating?: ReviewRatingSchema;
};

export type CreativeWorkSchema = {
	"@context": SchemaContext;
	"@type": "CreativeWork";
	"@id": string;
	url: string;
	name: string;
	headline: string;
	description?: string;
	datePublished?: string;
	dateModified?: string;
	inLanguage?: string;
	author: {
		"@type": "Organization";
		"@id": string;
		name: string;
	};
	mainEntityOfPage?: {
		"@type": "WebPage";
		"@id": string;
	};
	citation?: string;
	image?: string;
	keywords?: string[];
	about?: string[];
	review?: ReviewSchema[];
	isRelatedTo?: Array<{
		"@type": "CreativeWork";
		"@id": string;
		url: string;
		name: string;
	}>;
};

export type TechArticleSchema = {
	"@context": SchemaContext;
	"@type": "TechArticle";
	"@id": string;
	url: string;
	headline: string;
	description?: string;
	datePublished?: string;
	dateModified?: string;
	inLanguage?: string;
	mainEntityOfPage?: {
		"@type": "WebPage";
		"@id": string;
	};
	publisher: {
		"@type": "Organization";
		"@id": string;
		name: string;
		url?: string;
	};
	sameAs?: string[];
	image?: string;
	keywords?: string[];
};

export type AnswerSchema = {
	"@type": "Answer";
	text: string;
};

export type QuestionSchema = {
	"@type": "Question";
	name: string;
	acceptedAnswer: AnswerSchema;
};

export type FAQPageSchema = {
	"@context": SchemaContext;
	"@type": "FAQPage";
	"@id": string;
	url: string;
	name: string;
	description?: string;
	mainEntity: QuestionSchema[];
};

export type BlogPostingSchema = {
	"@context": SchemaContext;
	"@type": "BlogPosting";
	"@id": string;
	url: string;
	mainEntityOfPage?: {
		"@type": "WebPage";
		"@id": string;
	};
	headline: string;
	description?: string;
	datePublished?: string;
	dateModified?: string;
	image?: string;
	keywords?: string[];
	articleSection?: string[];
	author?: {
		"@type": "Person" | "Organization";
		name: string;
		"@id"?: string;
	};
	publisher?: {
		"@id": string;
	};
	inLanguage?: string;
};

export type PropertyValueSchema = {
	"@type": "PropertyValue";
	name: string;
	value?: string;
};

export type ThingSchema = {
	"@type": "Thing";
	name: string;
	description?: string;
	additionalProperty?: PropertyValueSchema[];
};

export type DataFeedItemSchema = {
	"@type": "DataFeedItem";
	position: number;
	dateCreated?: string;
	item: ThingSchema;
};

export type DataFeedSchema = {
	"@context": SchemaContext;
	"@type": "DataFeed";
	"@id": string;
	name: string;
	description?: string;
	url: string;
	provider: {
		"@type": "Organization";
		name: string;
		"@id": string;
		url: string;
	};
	dataFeedElement: DataFeedItemSchema[];
};

export type BlogSchema = {
	"@context": SchemaContext;
	"@type": "Blog";
	"@id": string;
	url: string;
	name: string;
	description?: string;
	blogPost?: BlogPostingSchema[];
	publisher: {
		"@id": string;
	};
};

export type SoftwareApplicationSchema = {
	"@context": SchemaContext;
	"@type": "SoftwareApplication";
	"@id": string;
	name: string;
	description?: string;
	url: string;
	image?: string | string[];
	applicationCategory: string;
	operatingSystem: string;
	offers: OfferSchema;
	aggregateRating?: AggregateRatingSchema;
	review?: ReviewSchema[];
	sameAs?: string[];
	publisher: {
		"@id": string;
	};
};

export type DatasetSchema = {
	"@context": SchemaContext;
	"@type": "Dataset";
	"@id": string;
	name: string;
	description: string;
	url: string;
	license?: string;
	keywords?: string[];
	provider: {
		"@type": "Organization";
		"@id": string;
		name: string;
		url: string;
	};
	distribution?: Array<{
		"@type": "DataDownload";
		contentUrl: string;
		encodingFormat?: string;
	}>;
};
