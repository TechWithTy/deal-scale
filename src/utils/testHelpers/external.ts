export const isExternalIntegrationEnabled = process.env.RUN_EXTERNAL_TESTS === "true";

export const describeIfExternal = isExternalIntegrationEnabled ? describe : describe.skip;
export const itIfExternal = isExternalIntegrationEnabled ? it : it.skip;
export const testIfExternal = itIfExternal;

export function skipExternalTest(reason: string) {
        if (!isExternalIntegrationEnabled) {
                console.warn(
                        `[tests] Skipping external integration test: ${reason}. Set RUN_EXTERNAL_TESTS=true to enable.`,
                );
        }
}
