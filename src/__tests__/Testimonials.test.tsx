import { act, render, screen } from "@testing-library/react";
import Testimonials from "@/components/home/Testimonials";
import { usePersonaStore } from "@/stores/usePersonaStore";
import { beforeAll, afterEach, describe, expect, test, vi } from "vitest";

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
		usePersonaStore.getState().setPersona("Investor");
		usePersonaStore.getState().setGoal("");
	});

	test("renders interactive spotlight accents for testimonials", () => {
		render(
			<Testimonials
				testimonials={[]}
				title="What Our Clients Say"
				subtitle="Hear from our clients about their experiences with our services"
			/>,
		);

		expect(
			screen.getByTestId("testimonial-spotlight-container"),
		).toBeInTheDocument();
		expect(
			screen.getByTestId("testimonial-orbit-accent"),
		).toBeInTheDocument();
	});

	test("switches testimonial content when persona changes", () => {
		render(
			<Testimonials
				testimonials={[]}
				title="What Our Clients Say"
				subtitle="Hear from our clients about their experiences with our services"
			/>,
		);

		expect(screen.getByText("Ava Moretti")).toBeInTheDocument();

		act(() => {
			usePersonaStore.getState().setPersona("Agent");
		});

		expect(screen.getByText("Maya Thompson")).toBeInTheDocument();
	});
});

