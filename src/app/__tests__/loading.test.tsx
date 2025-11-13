import { render, screen } from "@testing-library/react";

describe("App route loading fallback", () => {
	it("renders a status-aware loading animation", async () => {
		const { default: Loading } = await import("@/app/loading");

		render(<Loading />);

		const spinner = screen.getByRole("status", { name: /loading/i });
		expect(spinner).toBeInTheDocument();
		expect(screen.getByTestId("loading-animation")).toContainElement(spinner);
	});
});

