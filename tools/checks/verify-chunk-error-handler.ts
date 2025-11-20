import "tsconfig-paths/register";
import { spawnSync } from "node:child_process";

/**
 * Runs the ChunkErrorHandler test before build to ensure
 * chunk loading error handling is working correctly.
 */
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
