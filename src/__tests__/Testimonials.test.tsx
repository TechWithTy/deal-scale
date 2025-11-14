import { act, render, screen } from "@testing-library/react";
import Testimonials from "@/components/home/Testimonials";
import {
	resetPersonaStore,
	usePersonaStore,
} from "@/stores/usePersonaStore";
import { beforeAll, afterEach, describe, expect, test, vi } from "vitest";

vi.mock("@/components/home/testimonials/TestimonialPersonaSwitcher", () => ({
	PersonaSwitcher: () => null,
}));

describe("Testimonials", () => {
	beforeAll(() => {
		if (typeof window.matchMedia !== "function") {
			Object.defineProperty(window, "matchMedia", {
				writable: true,
				value: vi.fn().mockImplementation(() => ({
					matches: false,
					addEventListener: vi.fn(),
					removeEventListener: vi.fn(),
					addListener: vi.fn(),
					removeListener: vi.fn(),
					dispatchEvent: vi.fn(),
					onchange: null,
				})),
			});
		}
	});

	afterEach(() => {
		resetPersonaStore();
	});

	test("renders interactive spotlight accents for testimonials", async () => {
		await act(async () => {
			render(
				<Testimonials
					testimonials={[]}
					title="What Our Clients Say"
					subtitle="Hear from our clients about their experiences with our services"
				/>,
			);
		});
		await act(async () => {});

		expect(
			screen.getByTestId("testimonial-spotlight-container"),
		).toBeInTheDocument();
		expect(
			screen.getByTestId("testimonial-orbit-accent"),
		).toBeInTheDocument();
	});

	test("switches testimonial content when persona changes", async () => {
		await act(async () => {
			render(
				<Testimonials
					testimonials={[]}
					title="What Our Clients Say"
					subtitle="Hear from our clients about their experiences with our services"
				/>,
			);
		});
		await act(async () => {});

		expect(screen.getByText("Ava Moretti")).toBeInTheDocument();

		await act(async () => {
			usePersonaStore.getState().setPersona("agent");
		});

		expect(screen.getByText("Maya Thompson")).toBeInTheDocument();
	});
});

