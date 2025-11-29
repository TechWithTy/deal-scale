import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LegalDocument } from "../../../data/legal/legalDocuments";
import * as legalDocumentsModule from "../../../data/legal/legalDocuments";
import LegalClient from "../LegalClient";

type TestLegalDocument = LegalDocument;

const toastSuccess = vi.fn();
const toastError = vi.fn();
type ClipboardWriteSpy = ReturnType<typeof vi.spyOn<Clipboard, "writeText">>;
let writeTextMock: ClipboardWriteSpy;

vi.mock("../../../data/legal/legalDocuments", async () => {
	const actual = await vi.importActual<
		typeof import("../../../data/legal/legalDocuments")
	>("../../../data/legal/legalDocuments");
	const store: { docs: TestLegalDocument[] } = { docs: [] };
	return {
		__esModule: true,
		...actual,
		get legalDocuments() {
			return store.docs;
		},
		__setLegalDocuments(docs: TestLegalDocument[]) {
			store.docs.splice(0, store.docs.length, ...docs);
		},
	};
});

const { __setLegalDocuments } = legalDocumentsModule as unknown as {
	__setLegalDocuments: (docs: TestLegalDocument[]) => void;
};

vi.mock("@/components/legal/markdown", () => ({
	MarkdownContent: ({ content }: { content: string }) => (
		<div>{content.replace(/[#*]/g, "").trim()}</div>
	),
}));

vi.mock("sonner", () => ({
	toast: {
		success: (...args: unknown[]) => toastSuccess(...args),
		error: (...args: unknown[]) => toastError(...args),
	},
}));

const renderLegalClient = () => render(<LegalClient />);

describe("LegalClient", () => {
	beforeEach(() => {
		__setLegalDocuments([
			{
				slug: "privacy-policy",
				title: "Privacy Policy",
				description: "How we collect, use, and protect your data.",
				lastUpdated: "2024-07-23",
				content:
					"# Privacy Policy\n\n**Last Updated: July 15, 2025**\n\n### 1. Introduction\n\nDeal Scale is committed to protecting your privacy.",
				source: "fallback",
				path: "/privacy",
			},
		]);

		toastSuccess.mockReset();
		toastError.mockReset();

		const clipboard =
			navigator.clipboard ??
			({
				writeText: async () => undefined,
			} as unknown as Clipboard);

		if (!navigator.clipboard) {
			Object.defineProperty(navigator, "clipboard", {
				value: clipboard,
				configurable: true,
			});
		}

		writeTextMock = vi
			.spyOn(clipboard, "writeText")
			.mockResolvedValue(undefined);
	});

	afterEach(() => {
		writeTextMock.mockRestore();
	});

	it("renders formatted markdown and fallback status for legal documents", async () => {
		const user = userEvent.setup();
		renderLegalClient();

		const card = await screen.findByRole("heading", {
			name: /privacy policy/i,
			level: 3,
		});

		expect(screen.getByText(/fallback template/i)).toBeInTheDocument();
		expect(screen.getByText(/last updated:\s*2024-07-23/i)).toBeInTheDocument();

		const cardLink = screen.getByRole("link", { name: /open template/i });
		expect(cardLink).toHaveAttribute("href", "https://dealscale.io/privacy");
		expect(cardLink).toHaveAttribute("target", "_blank");

		await user.click(card);

		const dialog = await screen.findByRole("dialog");
		const dialogScope = within(dialog);

		expect(
			dialogScope.queryByText(/\*\*last updated:/i),
		).not.toBeInTheDocument();
		expect(
			dialogScope.getByText(/last updated:\s*july 15, 2025/i),
		).toBeInTheDocument();

		const liveTemplateLink = dialogScope.getByRole("link", {
			name: /view live template/i,
		});
		expect(liveTemplateLink).toHaveAttribute(
			"href",
			"https://dealscale.io/privacy",
		);
		expect(liveTemplateLink).toHaveAttribute("target", "_blank");
		expect(liveTemplateLink).toHaveAttribute(
			"rel",
			expect.stringContaining("noopener"),
		);
	});

	it("copies rendered text content to the clipboard", async () => {
		const user = userEvent.setup();
		renderLegalClient();

		await user.click(
			await screen.findByRole("heading", {
				name: /privacy policy/i,
				level: 3,
			}),
		);

		const dialog = await screen.findByRole("dialog");
		const dialogScope = within(dialog);

		const copyButton = dialogScope.getByRole("button", {
			name: /copy/i,
		});

		await user.click(copyButton);

		await waitFor(() => expect(writeTextMock).toHaveBeenCalledTimes(1));

		const copiedValue = writeTextMock.mock.calls[0][0] as string;

		expect(copiedValue).toContain("Last Updated: July 15, 2025");
		expect(copiedValue).not.toContain("**Last Updated");
		expect(toastSuccess).toHaveBeenCalled();
		expect(toastError).not.toHaveBeenCalled();
	});

	it("renders a live status badge when documents come from the live source", async () => {
		__setLegalDocuments([
			{
				slug: "terms-of-service",
				title: "Terms of Service",
				description: "Your legal agreement for using Deal Scale.",
				lastUpdated: "2024-07-23",
				content:
					"# Terms of Service\n\n**Last Updated: July 15, 2025**\n\n### 1. Acceptance of Terms\n\nBy using Deal Scale, you agree to these terms.",
				source: "live",
				path: "/tos",
			},
		]);

		renderLegalClient();

		expect(await screen.findByText(/live template/i)).toBeInTheDocument();
		expect(screen.getByText(/last updated:\s*2024-07-23/i)).toBeInTheDocument();

		const cardLink = screen.getByRole("link", { name: /open template/i });
		expect(cardLink).toHaveAttribute("href", "https://dealscale.io/tos");

		await userEvent.setup().click(
			await screen.findByRole("heading", {
				name: /terms of service/i,
				level: 3,
			}),
		);

		const dialog = await screen.findByRole("dialog");
		const dialogScope = within(dialog);

		const modalLink = dialogScope.getByRole("link", {
			name: /open template/i,
		});
		expect(modalLink).toHaveAttribute("href", "https://dealscale.io/tos");
	});
});
