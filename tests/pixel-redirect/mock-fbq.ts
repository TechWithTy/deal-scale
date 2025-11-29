/**
 * Mock Facebook Pixel (fbq) utility for testing
 * Provides a mock implementation that tracks all pixel calls
 */

export interface FbqCall {
	method: string;
	event: string;
	params?: Record<string, unknown>;
	timestamp: number;
}

export class MockFbq {
	private calls: FbqCall[] = [];
	private mockFn: typeof globalThis.fbq;

	constructor() {
		this.mockFn = ((...args: unknown[]) => {
			const [method, event, params] = args as [
				string,
				string,
				Record<string, unknown> | undefined,
			];
			this.calls.push({
				method,
				event,
				params,
				timestamp: Date.now(),
			});
		}) as typeof globalThis.fbq;
	}

	/**
	 * Get the mock fbq function to assign to window.fbq
	 */
	getMock(): typeof globalThis.fbq {
		return this.mockFn;
	}

	/**
	 * Get all recorded calls
	 */
	getCalls(): FbqCall[] {
		return [...this.calls];
	}

	/**
	 * Check if a specific event was called
	 */
	wasCalledWith(
		method: string,
		event: string,
		params?: Record<string, unknown>,
	): boolean {
		return this.calls.some((call) => {
			if (call.method !== method || call.event !== event) return false;
			if (params) {
				return JSON.stringify(call.params) === JSON.stringify(params);
			}
			return true;
		});
	}

	/**
	 * Get calls for a specific event
	 */
	getCallsForEvent(event: string): FbqCall[] {
		return this.calls.filter((call) => call.event === event);
	}

	/**
	 * Clear all recorded calls
	 */
	clear(): void {
		this.calls = [];
	}

	/**
	 * Get the number of calls
	 */
	getCallCount(): number {
		return this.calls.length;
	}
}

/**
 * Create a mock fbq instance and set it up on window
 */
export function setupMockFbq(): MockFbq {
	const mockFbq = new MockFbq();
	if (typeof window !== "undefined") {
		(window as { fbq?: typeof globalThis.fbq }).fbq = mockFbq.getMock();
	}
	return mockFbq;
}

/**
 * Clean up mock fbq from window
 */
export function cleanupMockFbq(): void {
	if (typeof window !== "undefined") {
		delete (window as { fbq?: typeof globalThis.fbq }).fbq;
	}
}
