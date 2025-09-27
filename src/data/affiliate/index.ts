// ! Affiliate Data Store
// This file contains mock affiliate data objects for the Deal Scale platform.
// * Uses @faker-js/faker to generate realistic data.

import { discountCodes } from "@/data/discount";
import type { AffiliateProfile } from "@/types/affiliate";
import { faker } from "@faker-js/faker";

const generateAffiliate = (): AffiliateProfile => {
	return {
		id: faker.string.uuid(),
		networkSize: faker.helpers.arrayElement([
			"1-100",
			"101-1,000",
			"1,001-10,000",
			"10,001-100,000",
			"100,001+",
		]),
		social: `@${faker.internet.userName()}`,
		website: faker.internet.url(),
		bankName: faker.company.name(),
		routingNumber: faker.finance.routingNumber(),
		accountNumber: faker.finance.accountNumber(),
		accountType: faker.helpers.arrayElement(["checking", "savings"]),
		hasRealEstateExperience: faker.helpers.arrayElement([
			"yes",
			"no",
			"indirect",
		]),
		termsAccepted: true,
		infoAccurate: true,
		newsletterBeta: faker.datatype.boolean(),
		// Optional fields
		commissionRate: faker.number.int({ min: 10, max: 30 }),
		discountCodes: faker.helpers.arrayElements(discountCodes, {
			min: 1,
			max: 2,
		}),
		approved: faker.datatype.boolean(),
		createdAt: faker.date.past().toISOString(),
	};
};

export const affiliates: AffiliateProfile[] = Array.from(
	{ length: 10 },
	generateAffiliate,
);
