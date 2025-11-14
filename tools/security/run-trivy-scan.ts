import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPORT_ROOT = path.resolve("reports", "security", "trivy");
const JSON_REPORT = path.join(REPORT_ROOT, "latest-report.json");
const SUMMARY_REPORT = path.join(REPORT_ROOT, "latest-report.txt");

function getAdditionalArgs(): string[] {
	const rawFlags = process.env.TRIVY_FLAGS;
	if (!rawFlags) return [];
	return rawFlags
		.split(" ")
		.map((flag) => flag.trim())
		.filter(Boolean);
}

async function ensureDirectory(dirPath: string) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function writeFile(filePath: string, contents: string) {
	await ensureDirectory(path.dirname(filePath));
	await fs.writeFile(filePath, contents, "utf8");
}

async function runTrivyScan() {
	const trivyCommand = process.env.TRIVY_CMD ?? "trivy";
	const target = process.env.TRIVY_TARGET ?? ".";
	const severity = process.env.TRIVY_SEVERITY;
	const ignoreUnfixed = process.env.TRIVY_IGNORE_UNFIXED ?? "true";

	const args: string[] = ["fs", "--format", "json"];

	if (severity) {
		args.push("--severity", severity);
	}

	if (ignoreUnfixed.toLowerCase() === "true") {
		args.push("--ignore-unfixed");
	}

	args.push(...getAdditionalArgs());
	args.push(target);

	try {
		const { stdout } = await execFileAsync(trivyCommand, args, {
			env: process.env,
		});

		await writeFile(JSON_REPORT, stdout);

		let vulnerabilityCount = 0;
		let resultCount = 0;

		try {
			const parsed = JSON.parse(stdout);
			if (parsed && Array.isArray(parsed.Results)) {
				resultCount = parsed.Results.length;
				for (const result of parsed.Results) {
					if (Array.isArray(result.Vulnerabilities)) {
						vulnerabilityCount += result.Vulnerabilities.length;
					}
				}
			}
		} catch (error) {
			console.warn(
				"[security:trivy] Unable to parse JSON output. Raw JSON saved for review.",
			);
		}

		const summaryLines = [
			"[security:trivy] Trivy filesystem scan completed.",
			`Command: ${[trivyCommand, ...args].join(" ")}`,
			`Target: ${target}`,
			`Results: ${resultCount}`,
			`Vulnerabilities found: ${vulnerabilityCount}`,
			`Report saved to: ${JSON_REPORT}`,
		];

		await writeFile(SUMMARY_REPORT, summaryLines.join("\n"));
		console.info("[security:trivy] Trivy scan results saved.");
	} catch (error) {
		const execError = error as NodeJS.ErrnoException & {
			stdout?: string;
			stderr?: string;
		};

		if (execError.code === "ENOENT") {
			console.warn(
				`[security:trivy] Skipping scan because "${trivyCommand}" was not found. Install Trivy CLI or set TRIVY_CMD.`,
			);
			return;
		}

		if (typeof execError.stdout === "string" && execError.stdout.trim()) {
			await writeFile(JSON_REPORT, execError.stdout);
			await writeFile(
				SUMMARY_REPORT,
				[
					"[security:trivy] Trivy scan completed with findings.",
					`Command: ${[trivyCommand, ...args].join(" ")}`,
					"Review the JSON report for details.",
					`Report saved to: ${JSON_REPORT}`,
				].join("\n"),
			);
			console.warn(
				"[security:trivy] Trivy reported vulnerabilities. Review the generated report for details.",
			);
			return;
		}

		console.error("[security:trivy] Failed to execute Trivy scan.", execError);
		throw error;
	}
}

runTrivyScan().catch((error) => {
	console.error(
		"[security:trivy] Unexpected error while running Trivy scan.",
		error,
	);
	process.exitCode = 1;
});
