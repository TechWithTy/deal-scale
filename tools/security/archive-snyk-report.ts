import path from "node:path";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPORT_ROOT = path.resolve("reports", "security");
const SOURCE_DIR = path.join(REPORT_ROOT, "snyk");
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

async function archiveSnykReports() {
	const jsonReport = path.join(SOURCE_DIR, "latest-report.json");
	const summaryReport = path.join(SOURCE_DIR, "latest-report.txt");

	const filesToArchive = (
		await Promise.all([
			jsReportDescriptor(jsonReport),
			textReportDescriptor(summaryReport),
		])
	).filter(Boolean) as Array<{ filePath: string; extension: string }>;

	if (filesToArchive.length === 0) {
		console.warn(
			"[archive:snyk] No Snyk reports found. Ensure the scan runs before archiving.",
		);
		return;
	}

	const now = new Date();
	const dateSegment = now.toISOString().slice(0, 10);
	const timeSegment = now.toISOString().split("T")[1]!.replace(/[:.]/g, "-");
	const destinationDir = path.join(HISTORY_DIR, dateSegment);
	await ensureDirectory(destinationDir);

	for (const { filePath, extension } of filesToArchive) {
		const fileName = `snyk-${timeSegment}${extension}`;
		const destinationPath = path.join(destinationDir, fileName);
		await fs.copyFile(filePath, destinationPath);
		await stageFile(destinationPath);
	}

	console.info("[archive:snyk] Snyk reports archived and staged.");
}

async function jsReportDescriptor(filePath: string) {
	if (!(await fileExists(filePath))) return null;
	return { filePath, extension: ".json" };
}

async function textReportDescriptor(filePath: string) {
	if (!(await fileExists(filePath))) return null;
	return { filePath, extension: ".txt" };
}

async function stageFile(filePath: string) {
	await execFileAsync("git", ["add", filePath]);
}

archiveSnykReports().catch((error) => {
	console.error("[archive:snyk] Failed to archive Snyk reports.", error);
	process.exitCode = 1;
});
