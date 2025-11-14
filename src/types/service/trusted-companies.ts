export interface CompanyPartner {
	name: string;
	logo: string;
	link?: string;
	description?: string;
}

export type CompanyLogoDictType = Record<string, CompanyPartner>;
