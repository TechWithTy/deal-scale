import "tsconfig-paths/register";
import { spawnSync } from "node:child_process";

/**
 * Runs the ChunkErrorHandler test before build to ensure
 * chunk loading error handling is working correctly.
 *
 * Skips tests on Vercel/production builds due to jsxDEV runtime issues.
 */
const isVercel = !!process.env.VERCEL;
const isCI = !!process.env.CI;
const skipTests = isVercel || process.env.SKIP_CHUNK_TESTS === "1";

if (skipTests) {
	console.log(
		`[check:chunk] Skipping ChunkErrorHandler tests (VERCEL=${isVercel}, CI=${isCI}, SKIP_CHUNK_TESTS=${process.env.SKIP_CHUNK_TESTS})`,
	);
	process.exit(0);
}

console.log("[check:chunk] Running ChunkErrorHandler tests...");

const result = spawnSync(
	"pnpm",
	[
		"exec",
		"vitest",
		"run",
		"src/components/providers/__tests__/ChunkErrorHandler.test.tsx",
	],
	{
		stdio: "inherit",
		shell: true,
	},
);

if (result.status !== 0) {
	console.error("[check:chunk] ChunkErrorHandler tests failed.");
	process.exit(1);
}

console.log("[check:chunk] ChunkErrorHandler tests passed.");
