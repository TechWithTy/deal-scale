import { services } from "@/data/service/services";
import {
	SERVICE_CATEGORIES,
	type ServiceItemData,
} from "@/types/service/services";
import { defaultSeo } from "@/utils/seo/staticSeo";
import { getServiceSeo } from "../../../seo/seo";

describe("getServiceSeo", () => {
	it("returns correct SEO metadata for a service", () => {
		const mockService: ServiceItemData =
			services[SERVICE_CATEGORIES.AI_FEATURES].aiInboundAgent;

		const seo = getServiceSeo(mockService);

		expect(seo.title).toBe("AI Inbound Agent | Services | Deal Scale");
		expect(seo.description).toBe(
			mockService.description ?? defaultSeo.description,
		);
		expect(seo.canonical).toBe(
			"https://dealscale.io/features/ai-inbound-agent",
		);
		expect(seo.image).toBe(defaultSeo.image);
		expect(seo.type).toBe("article");
		expect(typeof seo.datePublished).toBe("string");
		expect(typeof seo.dateModified).toBe("string");
	});
});
