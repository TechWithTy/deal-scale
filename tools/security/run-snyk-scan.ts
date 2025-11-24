import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const execFileAsync = promisify(execFile);

async function ensureDirectory(dirPath: string) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function writeFile(filePath: string, contents: string) {
	await ensureDirectory(path.dirname(filePath));
	await fs.writeFile(filePath, contents, "utf8");
}

async function runSnykScan() {
	const snykToken = process.env.SNYK_TOKEN;
	const snykCommand = process.env.SNYK_CMD ?? "snyk";
	const projectTarget = process.env.SNYK_PROJECT ?? process.cwd();
	const reportDir = path.resolve("reports", "security", "snyk");
	const jsonReportPath = path.join(reportDir, "latest-report.json");
	const summaryReportPath = path.join(reportDir, "latest-report.txt");

	if (!snykToken) {
		console.warn(
			"[security:snyk] Skipping Snyk scan because SNYK_TOKEN is not set. Configure the token to enable scans.",
		);
		return;
	}

	try {
		const { stdout } = await execFileAsync(snykCommand, ["test", "--json"], {
			env: process.env,
			cwd: projectTarget,
		});

		await writeFile(jsonReportPath, stdout);

		let summary = "[security:snyk] Snyk scan completed.";
		let vulnerabilityCount = 0;

		try {
			const parsed = JSON.parse(stdout);
			if (Array.isArray(parsed)) {
				vulnerabilityCount = parsed.reduce(
					(total, current) =>
						total +
						(Array.isArray(current.vulnerabilities)
							? current.vulnerabilities.length
							: 0),
					0,
				);
			} else if (parsed && Array.isArray(parsed.vulnerabilities)) {
				vulnerabilityCount = parsed.vulnerabilities.length;
			}

			summary = [
				"[security:snyk] Snyk scan completed.",
				`Project: ${projectTarget}`,
				`Vulnerabilities found: ${vulnerabilityCount}`,
				`Report saved to: ${jsonReportPath}`,
			].join("\n");
		} catch (parseError) {
			console.warn(
				"[security:snyk] Unable to parse Snyk JSON output for summary. Raw output has been saved.",
			);
		}

		await writeFile(summaryReportPath, summary);
		console.info("[security:snyk] Snyk scan results saved.");
	} catch (error) {
		const execError = error as NodeJS.ErrnoException & {
			stdout?: string;
			stderr?: string;
		};

		if (execError.code === "ENOENT") {
			console.warn(
				`[security:snyk] Skipping scan because the command "${snykCommand}" was not found. Install the Snyk CLI or set SNYK_CMD.`,
			);
			return;
		}

		if (
			typeof execError.stdout === "string" &&
			execError.stdout.trim().length > 0
		) {
			await writeFile(jsonReportPath, execError.stdout);
			await writeFile(
				summaryReportPath,
				[
					"[security:snyk] Snyk scan completed with findings.",
					`Project: ${projectTarget}`,
					"Vulnerabilities were detected. Review the JSON report for details.",
					`Report saved to: ${jsonReportPath}`,
				].join("\n"),
			);
			console.warn(
				"[security:snyk] Snyk reported vulnerabilities. Review the generated report for details.",
			);
			return;
		}

		console.error("[security:snyk] Failed to execute Snyk scan:", execError);
		throw error;
	}
}

runSnykScan().catch((error) => {
	console.error(
		"[security:snyk] Unexpected error while running Snyk scan.",
		error,
	);
	process.exitCode = 1;
});
