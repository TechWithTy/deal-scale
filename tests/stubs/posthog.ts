import { vi } from "vitest";

export const init = vi.fn();
export const capture = vi.fn();
export const identify = vi.fn();
export const reset = vi.fn();

export default {
	init,
	capture,
	identify,
	reset,
};



