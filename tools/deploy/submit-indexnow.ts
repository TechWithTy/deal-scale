const DEFAULT_HOST = "https://dealscale.io";
const DEFAULT_KEY = "06663aa83dc949d6bde61889ae81d42f";
const DEFAULT_ENDPOINT = "https://api.indexnow.org/indexnow";

function resolveHost(): string {
	const fromEnv = process.env.INDEXNOW_HOST?.trim();
	if (fromEnv) {
		try {
			const url = new URL(
				fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`,
			);
			url.pathname = url.pathname.replace(/\/$/, "");
			return url.toString().replace(/\/$/, "");
		} catch (error) {
			throw new Error(
				`[indexnow] INDEXNOW_HOST is invalid (${fromEnv}): ${(error as Error).message}`,
			);
		}
	}

	return DEFAULT_HOST;
}

function resolveKey(): string {
	const candidates = [
		process.env.PRIVATE_INDEX_NOW_KEY,
		process.env.INDEXNOW_KEY,
		DEFAULT_KEY,
	];

	for (const candidate of candidates) {
		const value = candidate?.trim();
		if (value) {
			return value;
		}
	}

	throw new Error(
		"[indexnow] Missing API key. Set PRIVATE_INDEX_NOW_KEY or INDEXNOW_KEY.",
	);
}

function resolveKeyLocation(host: string, key: string): string {
	const fromEnv = process.env.INDEXNOW_KEY_LOCATION?.trim();
	if (fromEnv) {
		return fromEnv;
	}

	try {
		const url = new URL(`${host}/${key}.txt`);
		return url.toString();
	} catch (error) {
		throw new Error(
			`[indexnow] Unable to build keyLocation using host (${host}) and key (${key}): ${
				(error as Error).message
			}`,
		);
	}
}

function resolveEndpoint(): string {
	return (process.env.INDEXNOW_ENDPOINT ?? DEFAULT_ENDPOINT).trim();
}

function resolveUrlList(host: string): string[] {
	const fromEnv = process.env.INDEXNOW_URLS?.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);

	const relativeUrls =
		fromEnv && fromEnv.length > 0
			? fromEnv
			: ["/", "/portfolio", "/blogs", "/rss.xml"];

	return relativeUrls.map((path) => {
		try {
			const url = new URL(path, host.endsWith("/") ? `${host}` : `${host}/`);
			return url.toString();
		} catch (error) {
			throw new Error(
				`[indexnow] Failed to build URL for path "${path}" with host "${host}": ${
					(error as Error).message
				}`,
			);
		}
	});
}

function shouldSkip(): boolean {
	if (process.env.INDEXNOW_SUBMIT_DISABLE === "1") {
		console.log("[indexnow] Submission disabled via INDEXNOW_SUBMIT_DISABLE.");
		return true;
	}

	if (process.env.NODE_ENV === "test") {
		console.log("[indexnow] Skipping submission in test environment.");
		return true;
	}

	return false;
}

export async function submitIndexNow(): Promise<void> {
	if (shouldSkip()) {
		return;
	}

	const host = resolveHost();
	const key = resolveKey();
	const keyLocation = resolveKeyLocation(host, key);
	const urlList = resolveUrlList(host);
	const endpoint = resolveEndpoint();

	console.log(
		`[indexnow] Submitting ${urlList.length} URL(s) for host ${host} to ${endpoint}.`,
	);

	const payload = {
		host: new URL(host).hostname,
		key,
		keyLocation,
		urlList,
	};

	const response = await fetch(endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify(payload),
	});

	if (response.ok) {
		console.log(`[indexnow] Submission accepted (status ${response.status}).`);
		return;
	}

	const body = await response.text().catch(() => "<unavailable>");
	throw new Error(
		`[indexnow] Submission failed with status ${response.status} (${response.statusText}). Response: ${body}`,
	);
}

async function run(): Promise<void> {
	try {
		await submitIndexNow();
	} catch (error) {
		console.warn("[indexnow] Submission encountered an error:", error);
		process.exitCode = 0;
	}
}

if (require.main === module) {
	void run();
}
