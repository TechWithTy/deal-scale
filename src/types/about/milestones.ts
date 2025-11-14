export type CompanyMilestone = {
	title: string;
	description: string;
	date?: string; // e.g. "2022-05-01"
	kpis?: {
		name: string;
		value: number | string;
		unit?: string;
		target?: number | string;
	}[];
	achievements?: string[];
	tags?: string[];
	icon?: string; // optional icon name/id
	externalLinks?: {
		label: string;
		url: string;
	}[];
};
