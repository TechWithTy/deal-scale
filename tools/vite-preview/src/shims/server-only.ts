/**
 * Minimal stub for the Next.js server-only module. In the Vite preview runtime
 * everything is client-side, so importing this just logs a warning once.
 */
let hasWarned = false;

export function serverOnly(): void {
	if (!hasWarned) {
		console.warn(
			"server-only was imported within the Vite preview runtime. Ensure the module is safe for client-side usage.",
		);
		hasWarned = true;
	}
}


