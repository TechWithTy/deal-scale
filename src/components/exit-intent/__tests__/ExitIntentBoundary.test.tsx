import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ExitIntentSettings } from "@external/use-exit-intent";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ExitIntentBoundary, {
	EXIT_INTENT_COPY,
	type ExitIntentVariant,
} from "../ExitIntentBoundary";

const registerHandlerMock = vi.fn();
const unsubscribeMock = vi.fn();
const resetStateMock = vi.fn();
const updateSettingsMock = vi.fn();

let lastInitArgs: ExitIntentSettings | undefined;
const originalEnabled = process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT;
const originalSnooze = process.env.NEXT_PUBLIC_EXIT_INTENT_SNOOZE_MS;

vi.mock("@external/use-exit-intent", () => ({
	useExitIntent: (args?: ExitIntentSettings) => {
		lastInitArgs = args;

		return {
			registerHandler: registerHandlerMock,
			unsubscribe: unsubscribeMock,
			resetState: resetStateMock,
			updateSettings: updateSettingsMock,
			settings: args ?? {},
			isTriggered: false,
			isUnsubscribed: false,
			willBeTriggered: true,
		};
	},
}));

const VARIANT_KEYS = Object.keys(EXIT_INTENT_COPY) as ExitIntentVariant[];

const triggerExitIntent = (suffix: string) => {
	const openCall = registerHandlerMock.mock.calls
		.map(([config]) => config)
		.find((config) => config?.id.endsWith(suffix));

	expect(openCall).toBeDefined();
	expect(openCall?.handler).toBeTypeOf("function");

	act(() => {
		openCall?.handler();
	});
};

beforeEach(() => {
	registerHandlerMock.mockImplementation(() => undefined);
});

afterEach(() => {
	registerHandlerMock.mockClear();
	unsubscribeMock.mockClear();
	resetStateMock.mockClear();
	updateSettingsMock.mockClear();
	lastInitArgs = undefined;
});

beforeAll(() => {
	process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT = "true";
	process.env.NEXT_PUBLIC_EXIT_INTENT_SNOOZE_MS = "0";
});

afterAll(() => {
	if (originalEnabled === undefined) {
		delete process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT;
	} else {
		process.env.NEXT_PUBLIC_ENABLE_EXIT_INTENT = originalEnabled;
	}

	if (originalSnooze === undefined) {
		delete process.env.NEXT_PUBLIC_EXIT_INTENT_SNOOZE_MS;
	} else {
		process.env.NEXT_PUBLIC_EXIT_INTENT_SNOOZE_MS = originalSnooze;
	}
});

describe("ExitIntentBoundary", () => {
	it("renders children inside the boundary container", () => {
		render(
			<ExitIntentBoundary variant="home">
				<p data-testid="child">Hello</p>
			</ExitIntentBoundary>,
		);

		expect(screen.getByTestId("exit-intent-boundary")).toBeInTheDocument();
		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("initialises useExitIntent with shared defaults", () => {
		render(
			<ExitIntentBoundary variant="home">
				<div>content</div>
			</ExitIntentBoundary>,
		);

		expect(lastInitArgs).toMatchObject({
			cookie: { key: "deal-scale-exit-intent", daysToExpire: 30 },
			desktop: expect.objectContaining({
				triggerOnMouseLeave: true,
				delayInSecondsToTrigger: expect.any(Number),
				mouseLeaveDelayInSeconds: expect.any(Number),
			}),
			mobile: expect.objectContaining({
				triggerOnIdle: true,
				delayInSecondsToTrigger: expect.any(Number),
			}),
		});
	});

	it("registers trigger and unsubscribe handlers", () => {
		render(
			<ExitIntentBoundary variant="home">
				<div>content</div>
			</ExitIntentBoundary>,
		);

		expect(registerHandlerMock).toHaveBeenCalledWith(
			expect.objectContaining({
				id: "exit-intent-home-trigger",
				context: ["onTrigger", "onDesktop", "onMobile"],
			}),
		);
		expect(registerHandlerMock).toHaveBeenCalledWith(
			expect.objectContaining({
				id: "exit-intent-home-unsubscribe",
				context: ["onUnsubscribe"],
			}),
		);
	});

	it.each(VARIANT_KEYS)(
		"shows variant specific copy when triggered for %s",
		(variant) => {
			render(
				<ExitIntentBoundary variant={variant}>
					<div>content</div>
				</ExitIntentBoundary>,
			);

			triggerExitIntent("trigger");

			const copy = EXIT_INTENT_COPY[variant];
			const primaryRole = copy.primaryHref ? "link" : "button";

			expect(
				screen.getByRole("heading", { name: copy.headline }),
			).toBeInTheDocument();
			expect(screen.getByText(copy.body)).toBeInTheDocument();
			expect(
				screen.getByRole(primaryRole, { name: copy.primaryCta }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: copy.secondaryCta }),
			).toBeInTheDocument();
		},
	);

	it("unsubscribes when the secondary action is chosen", () => {
		render(
			<ExitIntentBoundary variant="home">
				<div>content</div>
			</ExitIntentBoundary>,
		);

		triggerExitIntent("trigger");

		fireEvent.click(
			screen.getByRole("button", {
				name: EXIT_INTENT_COPY.home.secondaryCta,
			}),
		);

		expect(unsubscribeMock).toHaveBeenCalledTimes(1);
	});

	it("resets state when the user dismisses the modal to keep exploring", () => {
		render(
			<ExitIntentBoundary variant="home">
				<div>content</div>
			</ExitIntentBoundary>,
		);

		triggerExitIntent("trigger");

		fireEvent.click(
			screen.getByRole("button", { name: "Keep exploring" }),
		);

		expect(resetStateMock).toHaveBeenCalledTimes(1);
	});
});

