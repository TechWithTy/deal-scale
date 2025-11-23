/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { vi } from "vitest";

declare global {
	// eslint-disable-next-line no-var
	var jest: typeof vi & {
		mocked<T>(item: T): T;
		requireActual<T = unknown>(modulePath: string): T;
		requireMock<T = unknown>(modulePath: string): T;
		resetModules(): void;
		setTimeout(timeout: number): void;
		clearAllMocks(): void;
		resetAllMocks(): void;
		restoreAllMocks(): void;
		useFakeTimers(): void;
		useRealTimers(): void;
		runOnlyPendingTimers(): void;
		advanceTimersByTime(msToRun: number): void;
		clearAllTimers(): void;
		spyOn<T extends object, Key extends keyof T>(
			obj: T,
			method: Key,
		): ReturnType<typeof vi.spyOn<T, Key>>;
	};
}

export {};




