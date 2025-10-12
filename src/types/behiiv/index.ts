export interface Subscriber {
	id: string;
	email: string;
	status: "validating" | "active" | "unsubscribed" | "pending";
	created: number;
	subscription_tier: string;
	subscription_premium_tier_names: string[];
	utm_source?: string;
	utm_medium?: string;
	utm_channel?: string;
	utm_campaign?: string;
	referring_site?: string;
	referral_code?: string;
}

// * Beehiiv BeehiivPost type (partial, extend as needed)
export interface BeehiivPostContentEmailStats {
	recipients: number;
	delivered: number;
	opens: number;
	unique_opens: number;
	clicks: number;
	unique_clicks: number;
	unsubscribes: number;
	spam_reports: number;
}

export interface BeehiivPostContentWebStats {
	views: number;
	clicks: number;
}

export interface BeehiivPostContentClickStats {
	total_clicks: number;
	total_unique_clicks: number;
	total_click_through_rate: number;
}

export interface BeehiivPostStats {
	email?: BeehiivPostContentEmailStats;
	web?: BeehiivPostContentWebStats;
	clicks?: BeehiivPostContentClickStats[];
	[key: string]: unknown;
}

export interface BeehiivPostContentSection {
	web?: string;
	email?: string;
	rss?: string;
	[key: string]: string | undefined;
}

export interface BeehiivPostContent {
	free: {
		web: string;
		email: string;
		rss: string;
	};
	premium: {
		web: string;
		email: string;
	};
}

export interface BeehiivPost {
	id: string;
	subtitle: string;
	title: string;
	authors?: string[];
	created?: number;
	status?: string;
	published_at?: string | number;
	split_tested?: boolean;
	subject_line?: string;
	preview_text?: string;
	slug?: string;
	thumbnail_url?: string;
	web_url?: string;
        audience?: string;
        platform?: string;
        content_tags?: string[];
        hidden_from_feed?: boolean;
        published_at?: number | string | Date | null;
        publish_date?: number;
        displayed_date?: number;
        meta_default_description?: string;
        meta_default_title?: string;
        content?: BeehiivPostContent;
	stats?: BeehiivPostStats;
	[key: string]: unknown;
}

// * Aggregate stats response
export interface AggregateStats {
	stats: Record<string, unknown>;
}
export interface PublicationStats {
	active_subscriptions: number;
	active_premium_subscriptions: number;
	active_free_subscriptions: number;
	average_open_rate: number;
	average_click_rate: number;
	total_sent: number;
	total_unique_opened: number;
	total_clicked: number;
}

export interface Publication {
	id: string;
	name: string;
	organization_name: string;
	referral_program_enabled: boolean;
	created: number;
	stats?: PublicationStats;
}

export interface PublicationsResponse {
	data: Publication[];
	limit: number;
	page: number;
	total_results: number;
	total_pages: number;
}
