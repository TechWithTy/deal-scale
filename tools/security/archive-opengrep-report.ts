import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPORT_ROOT = path.resolve("reports", "security");
const SOURCE_SARIF =
	process.env.OPENGREP_SARIF_OUTPUT ??
	path.join(REPORT_ROOT, "opengrep", "latest-report.sarif");
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

function formatSegments() {
	const iso = new Date().toISOString();
	const [datePart, timePart = "00:00:00.000Z"] = iso.split("T");
	const safeTime = timePart.replace("Z", "").replace(/[:.]/g, "-");
	return { datePart: datePart ?? iso.slice(0, 10), safeTime };
}

async function stageFile(filePath: string) {
	await execFileAsync("git", ["add", filePath]);
}

async function archiveSarif() {
	if (!(await fileExists(SOURCE_SARIF))) {
		console.info(
			"[archive:opengrep] No Opengrep SARIF report detected. Skipping archive.",
		);
		return;
	}

	const { datePart, safeTime } = formatSegments();
	const destinationDir = path.join(HISTORY_DIR, datePart);
	await ensureDirectory(destinationDir);

	const destinationPath = path.join(
		destinationDir,
		`opengrep-${safeTime}.sarif`,
	);
	await fs.copyFile(SOURCE_SARIF, destinationPath);
	await stageFile(destinationPath);

	console.info(
		`[archive:opengrep] Archived Opengrep report to ${path.relative(process.cwd(), destinationPath)}`,
	);
}

archiveSarif().catch((error) => {
	console.error("[archive:opengrep] Failed to archive Opengrep report.", error);
	process.exitCode = 1;
});



