import { exec as execCb } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const exec = promisify(execCb);

const SOURCE_DIR = path.resolve("reports", "lighthouse");
const ARCHIVE_ROOT = path.resolve("reports", "history");

function formatDateSegments(date: Date) {
	const iso = date.toISOString(); // e.g. 2025-11-14T01:23:45.678Z
	const daySegment = iso.slice(0, 10); // YYYY-MM-DD
	const timeSegment = iso.replace(/[:]/g, "-").replace(/\..+/, ""); // YYYY-MM-DDTHH-MM-SS

	return { daySegment, timeSegment };
}

async function ensureDirectory(dirPath: string) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function getReportFiles(): Promise<string[]> {
	try {
		const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isFile())
			.map((entry) => path.join(SOURCE_DIR, entry.name));
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			return [];
		}
		throw error;
	}
}

function buildDestinationPath(
	sourcePath: string,
	daySegment: string,
	timeSegment: string,
) {
	const ext = path.extname(sourcePath);
	const baseName = path.basename(sourcePath, ext);
	const fileName = `${baseName}-${timeSegment}${ext}`;
	return path.join(ARCHIVE_ROOT, daySegment, fileName);
}

async function copyReports() {
	const reportFiles = await getReportFiles();

	if (reportFiles.length === 0) {
		console.info("[reports] No Lighthouse reports found to archive. Skipping.");
		return [];
	}

	const now = new Date();
	const { daySegment, timeSegment } = formatDateSegments(now);
	const destinationDir = path.join(ARCHIVE_ROOT, daySegment);
	await ensureDirectory(destinationDir);

	const archivedFiles: string[] = [];

	for (const sourcePath of reportFiles) {
		const destinationPath = buildDestinationPath(
			sourcePath,
			daySegment,
			timeSegment,
		);
		await ensureDirectory(path.dirname(destinationPath));
		await fs.copyFile(sourcePath, destinationPath);
		archivedFiles.push(destinationPath);
	}

	return archivedFiles;
}

async function stageFiles(filePaths: string[]) {
	if (filePaths.length === 0) {
		return;
	}

	const quoted = filePaths.map((filePath) => `"${filePath}"`).join(" ");
	try {
		await exec(`git add ${quoted}`);
	} catch (error) {
		console.warn(
			"[reports] Unable to automatically stage archived reports.",
			error,
		);
	}
}

async function main() {
	try {
		const archivedFiles = await copyReports();

		if (archivedFiles.length === 0) {
			return;
		}

		await stageFiles(archivedFiles);

		const relativePaths = archivedFiles.map((filePath) =>
			path.relative(process.cwd(), filePath),
		);
		console.info(
			`[reports] Archived ${relativePaths.length} file(s):\n${relativePaths
				.map((filePath) => `  • ${filePath}`)
				.join("\n")}`,
		);
	} catch (error) {
		console.warn("[reports] Failed to archive Lighthouse reports.", error);
	}
}

void main();


