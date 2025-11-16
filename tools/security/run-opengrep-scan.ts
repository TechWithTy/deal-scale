import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPORT_DIR = path.resolve("reports", "security", "opengrep");
const SARIF_OUTPUT = process.env.OPENGREP_SARIF_OUTPUT
	? path.resolve(process.env.OPENGREP_SARIF_OUTPUT)
	: path.join(REPORT_DIR, "latest-report.sarif");

function getCommand(): string {
	return process.env.OPENGREP_CMD ?? "opengrep";
}

function getRuleArguments(): string[] {
	const rulePath = process.env.OPENGREP_RULES ?? "opengrep-rules";
	return ["-f", rulePath];
}

async function ensureDirectory(dirPath: string) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function runOpengrepScan() {
	const opengrepCommand = getCommand();
	const targetPath = process.env.OPENGREP_TARGET ?? ".";

	const args = [
		"scan",
		"--sarif-output",
		SARIF_OUTPUT,
		...getRuleArguments(),
		targetPath,
	];

	try {
		await ensureDirectory(path.dirname(SARIF_OUTPUT));

		const { stdout, stderr } = await execFileAsync(opengrepCommand, args, {
			env: process.env,
		});

		if (stdout?.trim()) {
			console.info(stdout.trim());
		}

		if (stderr?.trim()) {
			console.warn(stderr.trim());
		}

		console.info(
			`[security:opengrep] Scan complete. SARIF saved to ${path.relative(process.cwd(), SARIF_OUTPUT)}`,
		);
	} catch (error) {
		const execError = error as NodeJS.ErrnoException;

		if (execError.code === "ENOENT") {
			console.warn(
				`[security:opengrep] Skipping scan because "${opengrepCommand}" is not available. Install Opengrep or set OPENGREP_CMD.`,
			);
			return;
		}

		console.error(
			"[security:opengrep] Failed to execute Opengrep scan.",
			execError,
		);
		throw error;
	}
}

runOpengrepScan().catch((error) => {
	console.error(
		"[security:opengrep] Unexpected error while running Opengrep.",
		error,
	);
	process.exitCode = 1;
});


