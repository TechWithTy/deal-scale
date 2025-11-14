import {
	type Publication,
	usePublications,
} from "@/hooks/beehiiv/use-publications";
import { act, renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
// ! Integration test for Beehiiv publications hook
// * Run only in a safe test environment (real API calls)
import {
	describeIfExternal,
	skipExternalTest,
} from "../../../testHelpers/external";

skipExternalTest("Beehiiv Publications integration");
describeIfExternal("Beehiiv Publications integration", () => {
	it("fetches all publications with stats", async () => {
		const { result } = renderHook(() => usePublications());
		// Wait for loading to become false (max 8s)
		await waitFor(
			() => {
				expect(result.current.loading).toBe(false);
			},
			{ timeout: 8000 },
		);
		// Log hook state before assertions
		// eslint-disable-next-line no-console
		console.log("Final publications:", result.current.publications);
		// eslint-disable-next-line no-console
		console.log("Final error:", result.current.error);
		// eslint-disable-next-line no-console
		console.log("Final loading:", result.current.loading);
		try {
			expect(Array.isArray(result.current.publications)).toBe(true);
			// If you have publications, check the shape
			if (result.current.publications.length > 0) {
				const pub: Publication = result.current.publications[0];
				// eslint-disable-next-line no-console
				console.log("Stats object:", pub.stats);
				expect(pub).toHaveProperty("id");
				expect(pub).toHaveProperty("name");
				expect(pub).toHaveProperty("organization_name");
				expect(pub).toHaveProperty("created");
				expect(pub).toHaveProperty("stats");
				expect(typeof pub.stats?.active_subscriptions).toBe("number");
			}
			// Error should be null if successful
			expect(result.current.error).toBeNull();
		} catch (err) {
			// Log error and state for debugging
			// eslint-disable-next-line no-console
			console.error("Test failed:", err);
			// eslint-disable-next-line no-console
			console.error("Hook state:", {
				publications: result.current.publications,
				error: result.current.error,
			});
			throw err;
		}
	});
});
