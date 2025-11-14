import { exec as execCb } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const exec = promisify(execCb);

const COVERAGE_DIR = path.resolve("coverage");
const ARCHIVE_ROOT = path.resolve("reports", "tests", "history");

async function directoryExists(dirPath: string) {
	try {
		const stats = await fs.stat(dirPath);
		return stats.isDirectory();
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			return false;
		}
		throw error;
	}
}

function formatDateSegments(date: Date) {
	const iso = date.toISOString();
	const daySegment = iso.slice(0, 10);
	const timeSegment = iso.replace(/[:]/g, "-").replace(/\..+$/, "");
	return { daySegment, timeSegment };
}

async function ensureDirectory(dirPath: string) {
	await fs.mkdir(dirPath, { recursive: true });
}

const FILES_TO_COPY = [
	"lcov.info",
	"coverage-summary.json",
	"coverage-final.json",
];

async function copyCoverageArtifacts() {
	const coverageExists = await directoryExists(COVERAGE_DIR);
	if (!coverageExists) {
		console.info("[coverage] No coverage directory found. Skipping archive.");
		return null;
	}

	const now = new Date();
	const { daySegment, timeSegment } = formatDateSegments(now);

	const destinationRoot = path.join(ARCHIVE_ROOT, daySegment);
	await ensureDirectory(destinationRoot);

	const destinationDir = path.join(destinationRoot, `coverage-${timeSegment}`);
	await ensureDirectory(destinationDir);

	let copiedCount = 0;

	for (const relativePath of FILES_TO_COPY) {
		const sourcePath = path.join(COVERAGE_DIR, relativePath);
		try {
			await fs.copyFile(sourcePath, path.join(destinationDir, relativePath));
			copiedCount += 1;
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") {
				continue;
			}
			throw error;
		}
	}

	if (copiedCount === 0) {
		console.info(
			"[coverage] No summary coverage files found. Skipping archive.",
		);
		return null;
	}

	const lcovReportDir = path.join(COVERAGE_DIR, "lcov-report");
	const lcovReportExists = await directoryExists(lcovReportDir);
	if (lcovReportExists) {
		const htmlDestination = path.join(destinationDir, "lcov-report");
		await ensureDirectory(htmlDestination);
		await fs
			.copyFile(
				path.join(lcovReportDir, "index.html"),
				path.join(htmlDestination, "index.html"),
			)
			.catch((error) => {
				if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
					throw error;
				}
			});
	}

	return destinationDir;
}

async function stagePath(targetPath: string | null) {
	if (!targetPath) {
		return;
	}

	const relativePath = path.relative(process.cwd(), targetPath);
	try {
		await exec(`git add "${relativePath}"`);
	} catch (error) {
		console.warn(
			"[coverage] Failed to stage archived coverage directory.",
			error,
		);
	}
}

async function main() {
	try {
		const destinationDir = await copyCoverageArtifacts();
		if (!destinationDir) {
			return;
		}

		await stagePath(destinationDir);

		const relativePath = path.relative(process.cwd(), destinationDir);
		console.info(`[coverage] Archived coverage to ${relativePath}`);
	} catch (error) {
		console.warn("[coverage] Failed to archive coverage results.", error);
	}
}

void main();
