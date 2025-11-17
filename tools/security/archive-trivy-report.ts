import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPORT_ROOT = path.resolve("reports", "security");
const SOURCE_DIR = path.join(REPORT_ROOT, "trivy");
const HISTORY_DIR = path.join(REPORT_ROOT, "history");

type ReportCandidate = { path: string; suffix: string };

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

async function archiveTrivyReports() {
	const jsonReport = path.join(SOURCE_DIR, "latest-report.json");
	const summaryReport = path.join(SOURCE_DIR, "latest-report.txt");

	const candidates: ReportCandidate[] = [
		{ path: jsonReport, suffix: ".json" },
		{ path: summaryReport, suffix: ".txt" },
	];

	const existing: ReportCandidate[] = [];
	for (const candidate of candidates) {
		if (await fileExists(candidate.path)) {
			existing.push(candidate);
		}
	}

	if (existing.length === 0) {
		console.warn(
			"[archive:trivy] No Trivy reports detected. Ensure the scan runs before archiving.",
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
		const fileName = `trivy-${timeSegment}${candidate.suffix}`;
		const destinationPath = path.join(destinationDir, fileName);
		await fs.copyFile(candidate.path, destinationPath);
		await stageFile(destinationPath);
	}

	console.info("[archive:trivy] Trivy reports archived and staged.");
}

async function stageFile(filePath: string) {
	await execFileAsync("git", ["add", filePath]);
}

archiveTrivyReports().catch((error) => {
	console.error("[archive:trivy] Failed to archive Trivy reports.", error);
	process.exitCode = 1;
});



