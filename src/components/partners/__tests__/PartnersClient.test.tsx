import PartnersClient from "@/app/partners/PartnersClient";
import type { CompanyLogoDictType } from "@/data/service/slug_data/trustedCompanies";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/hooks/useNavigationRouter", () => {
	return {
		useNavigationRouter: () => ({
			push: vi.fn(),
			replace: vi.fn(),
			back: vi.fn(),
			forward: vi.fn(),
			refresh: vi.fn(),
		}),
	};
});

const MockObserver = class {
	observe() {
		return undefined;
	}
	unobserve() {
		return undefined;
	}
	disconnect() {
		return undefined;
	}
};

beforeAll(() => {
	vi.stubGlobal("IntersectionObserver", MockObserver);
	vi.stubGlobal("ResizeObserver", MockObserver);
});

afterAll(() => {
	vi.unstubAllGlobals();
});

const partnersFixture: CompanyLogoDictType = {
	acme: {
		name: "Acme Corp",
		logo: "/partners/acme.svg",
		link: "https://example.com",
		description: "Example integration partner.",
	},
};

describe("PartnersClient", () => {
	it("renders a single level-one heading", () => {
		render(<PartnersClient partners={partnersFixture} />);

		const h1Headings = screen.getAllByRole("heading", { level: 1 });
		expect(h1Headings).toHaveLength(1);
	});
});

