import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { IntentModal } from "../intent-modal";

describe("IntentModal", () => {
	beforeEach(() => {
		document.body.style.removeProperty("overflow");
	});

	it("renders inline variant without portal structure", () => {
		render(
			<IntentModal
				intent="feedback"
				variant="inline"
				title="Inline feedback"
				description="Tell us what you think"
			>
				<p>Content</p>
			</IntentModal>,
		);

		expect(screen.getByText("Inline feedback")).toBeInTheDocument();
		expect(screen.getByText("Content")).toBeInTheDocument();
		expect(document.body.style.overflow).toBe("");
	});

	it("renders modal variant with overlay and close button", () => {
		const handleClose = vi.fn();
		render(
			<IntentModal
				intent="exit-intent"
				variant="modal"
				open
				onClose={handleClose}
				title="Wait!"
				description="Before you go..."
			>
				<p>Exit content</p>
			</IntentModal>,
		);

		expect(screen.getByText("Wait!")).toBeInTheDocument();
		const overlay = document.querySelector("[aria-hidden='true']");
		expect(overlay).toBeInTheDocument();
		fireEvent.click(overlay!);
		expect(handleClose).toHaveBeenCalledTimes(1);
		expect(document.body.style.overflow).toBe("hidden");
	});

	it("renders drawer variant with actions and handles close button", () => {
		const handleClose = vi.fn();
		render(
			<IntentModal
				intent="newsletter"
				variant="drawer"
				open
				onClose={handleClose}
				title="Subscribe"
				description="Get updates"
				actions={<button type="button">Submit</button>}
			>
				<p>Drawer content</p>
			</IntentModal>,
		);

		expect(screen.getByText("Drawer content")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Close modal" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
		expect(handleClose).toHaveBeenCalled();
	});
});



