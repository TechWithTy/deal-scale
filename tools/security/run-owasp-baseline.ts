import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const execFileAsync = promisify(execFile);

async function ensureDirectory(dirPath: string) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function runOwaspBaselineScan() {
	const baselineCommand = process.env.OWASP_BASELINE_CMD ?? "zap-baseline.py";
	const target = process.env.OWASP_TARGET ?? "http://localhost:3000";
	const extraArgs =
		process.env.OWASP_BASELINE_ARGS?.split(" ").filter(Boolean) ?? [];
	const reportDir = path.resolve("reports", "security", "owasp");
	const reportPath = path.join(reportDir, "latest-report.html");
	const logPath = path.join(reportDir, "latest-report.log");

	await ensureDirectory(reportDir);

	try {
		const { stdout, stderr } = await execFileAsync(
			baselineCommand,
			["-t", target, "-r", reportPath, ...extraArgs],
			{ env: process.env },
		);

		if (stdout.trim().length > 0) {
			await fs.writeFile(logPath, stdout, "utf8");
		}

		if (stderr.trim().length > 0) {
			await fs.appendFile(logPath, `\n[stderr]\n${stderr}`, "utf8");
		}

		console.info(
			`[security:owasp] OWASP ZAP baseline scan finished. Report saved to ${reportPath}`,
		);
	} catch (error) {
		const execError = error as NodeJS.ErrnoException & {
			stdout?: string;
			stderr?: string;
		};

		if (execError.code === "ENOENT") {
			console.warn(
				`[security:owasp] Skipping scan because "${baselineCommand}" is not available. Install OWASP ZAP or set OWASP_BASELINE_CMD.`,
			);
			return;
		}

		if (execError.stdout || execError.stderr) {
			if (execError.stdout?.trim()) {
				await fs.writeFile(logPath, execError.stdout, "utf8");
			}

			if (execError.stderr?.trim()) {
				await fs.appendFile(logPath, `\n[stderr]\n${execError.stderr}`, "utf8");
			}

			console.warn(
				`[security:owasp] OWASP baseline scan completed with warnings. Review ${logPath} for details.`,
			);
			return;
		}

		console.error(
			"[security:owasp] Failed to execute OWASP baseline scan.",
			execError,
		);
		throw error;
	}
}

runOwaspBaselineScan().catch((error) => {
	console.error(
		"[security:owasp] Unexpected error while running OWASP baseline scan.",
		error,
	);
	process.exitCode = 1;
});




