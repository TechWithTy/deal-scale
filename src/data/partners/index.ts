import {
	type CompanyLogoDictType,
	companyLogos,
} from "@/data/service/slug_data/trustedCompanies";

export const partners: {
	companies: CompanyLogoDictType;
	list: Array<{
		name: string;
		logo: string;
		description: string;
		url?: string;
	}>;
} = {
	companies: companyLogos,
	list: Object.values(companyLogos).map((company) => ({
		name: company.name,
		logo: company.logo,
		description: company.description ?? "",
		url: company.link,
	})), // Dynamically generated from companyLogos
};
