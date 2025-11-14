import path from "node:path";
import fs from "node:fs/promises";
import { promisify } from "node:util";
import { execFile } from "node:child_process";

const execFileAsync = promisify(execFile);

const REPORT_ROOT = path.resolve("reports", "security");
const SOURCE_DIR = path.join(REPORT_ROOT, "owasp");
const HISTORY_DIR = path.join(REPORT_ROOT, "history");

async function ensureDirectory(dirPath: string) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(filePath: string) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function archiveOwaspReports() {
	const htmlReport = path.join(SOURCE_DIR, "latest-report.html");
	const logReport = path.join(SOURCE_DIR, "latest-report.log");

	type ReportCandidate = { path: string; suffix: string };
	const candidates: ReportCandidate[] = [
		{ path: htmlReport, suffix: ".html" },
		{ path: logReport, suffix: ".log" },
	];

	const existing: ReportCandidate[] = [];
	for (const candidate of candidates) {
		if (await fileExists(candidate.path)) {
			existing.push(candidate);
		}
	}

	if (existing.length === 0) {
		console.warn(
			"[archive:owasp] No OWASP reports detected. Ensure the scan runs before archiving.",
		);
		return;
	}

	const now = new Date();
	const isoString = now.toISOString();
	const [dateSegmentRaw, rawTimePart = "00:00:00.000Z"] = isoString.split("T");
	const dateSegment = dateSegmentRaw ?? isoString.slice(0, 10);
	const timeSegment = rawTimePart.replace("Z", "").replace(/[:.]/g, "-");
	const destinationDir = path.join(HISTORY_DIR, dateSegment);
	await ensureDirectory(destinationDir);

	for (const candidate of existing) {
		const fileName = `owasp-${timeSegment}${candidate.suffix}`;
		const destinationPath = path.join(destinationDir, fileName);
		await fs.copyFile(candidate.path, destinationPath);
		await stageFile(destinationPath);
	}

	console.info("[archive:owasp] OWASP reports archived and staged.");
}

async function stageFile(filePath: string) {
	await execFileAsync("git", ["add", filePath]);
}

archiveOwaspReports().catch((error) => {
	console.error("[archive:owasp] Failed to archive OWASP reports.", error);
	process.exitCode = 1;
});
