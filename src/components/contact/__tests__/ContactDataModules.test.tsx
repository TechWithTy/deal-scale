import { render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useDataModuleMock = vi.fn();

vi.mock("@/stores/useDataModuleStore", () => ({
	__esModule: true,
	useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

vi.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
			<div {...rest}>{children}</div>
		),
	},
}));

vi.mock("next/link", () => ({
	__esModule: true,
	default: ({
		href,
		children,
	}: { href: string; children: React.ReactNode }) => (
		<a href={href}>{children}</a>
	),
}));

const loadContactHero = async () =>
	(await import("../form/ContactHero")).ContactHero;
const loadContactInfo = async () =>
	(await import("../form/ContactInfo")).ContactInfo;

describe("Contact components data module guards", () => {
	beforeEach(() => {
		vi.resetModules();
		useDataModuleMock.mockReset();
	});

	it("renders a loading state for ContactHero while company data is idle", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: (state: unknown) => unknown) => {
				if (key === "company") {
					return selector({
						status: "idle",
						data: undefined,
						error: undefined,
					});
				}

				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

		const ContactHero = await loadContactHero();

		render(<ContactHero />);

		expect(
			screen.getByText(/Loading contact information/i),
		).toBeInTheDocument();
	});

	it("renders a loading state for ContactInfo while company data is idle", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: (state: unknown) => unknown) => {
				if (key === "company") {
					return selector({
						status: "idle",
						data: undefined,
						error: undefined,
					});
				}

				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

		const ContactInfo = await loadContactInfo();

		render(<ContactInfo />);

		expect(screen.getByText(/Loading contact details/i)).toBeInTheDocument();
	});
});
