export const isExternalIntegrationEnabled =
	process.env.RUN_EXTERNAL_TESTS === "true";

type BddTestFunction = {
	(
		name: string,
		fn: (...args: unknown[]) => unknown,
		timeout?: number,
	): unknown;
	skip?: BddTestFunction;
	only?: BddTestFunction;
};

function getGlobalTestFunction(name: "describe" | "it" | "test") {
	const value = (globalThis as Record<string, unknown>)[name];
	return typeof value === "function" ? (value as BddTestFunction) : undefined;
}

function createUnavailableFallback(
	name: "describe" | "it" | "test",
): BddTestFunction {
	const fallback = ((..._args: Parameters<BddTestFunction>) => {
		throw new Error(
			`[tests] Global test function "${name}" is unavailable. Ensure the test environment exposes it.`,
		);
	}) as BddTestFunction;
	fallback.skip = fallback;
	fallback.only = fallback;
	return fallback;
}

function createSkippedFallback(
	name: "describe" | "it" | "test",
	base: BddTestFunction | undefined,
): BddTestFunction {
	const fallback = ((...args: Parameters<BddTestFunction>) => {
		if (base?.skip) {
			return base.skip(...args);
		}
		console.warn(
			`[tests] ${name} skipped: external integrations are disabled. Set RUN_EXTERNAL_TESTS=true to enable.`,
		);
		return undefined;
	}) as BddTestFunction;
	fallback.skip = base?.skip ?? fallback;
	fallback.only = base?.only ?? fallback;
	return fallback;
}

const describeBase = getGlobalTestFunction("describe");
const itBase = getGlobalTestFunction("it");
const testBase = getGlobalTestFunction("test");

export const describeIfExternal: BddTestFunction = isExternalIntegrationEnabled
	? (describeBase ?? createUnavailableFallback("describe"))
	: createSkippedFallback("describe", describeBase);

export const itIfExternal: BddTestFunction = isExternalIntegrationEnabled
	? (itBase ?? createUnavailableFallback("it"))
	: createSkippedFallback("it", itBase);

export const testIfExternal: BddTestFunction = isExternalIntegrationEnabled
	? (testBase ?? createUnavailableFallback("test"))
	: createSkippedFallback("test", testBase);

export function skipExternalTest(reason: string) {
	if (!isExternalIntegrationEnabled) {
		console.warn(
			`[tests] Skipping external integration test: ${reason}. Set RUN_EXTERNAL_TESTS=true to enable.`,
		);
	}
}
