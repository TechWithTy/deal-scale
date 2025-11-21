"use client";
import { useTheme } from "@/contexts/theme-context";
import { useEffect } from "react";

/**
 * Syncs the body class between theme-dealscale and theme-dealscale-light
 * according to the resolved theme from context. Place this at the root layout.
 */
export default function BodyThemeSync() {
	const { resolvedTheme } = useTheme();
	useEffect(() => {
		// Remove all theme classes (both old and new for compatibility)
		document.body.classList.remove(
			"theme-cyberoni",
			"theme-cyberoni-light",
			"theme-dealscale",
			"theme-dealscale-light",
		);
		// Add the appropriate Deal Scale theme class
		document.body.classList.add(
			resolvedTheme === "dark" ? "theme-dealscale" : "theme-dealscale-light",
		);
		// Sync <html> dark class for Tailwind dark mode
		const html = document.documentElement;
		if (resolvedTheme === "dark") {
			html.classList.add("dark");
		} else {
			html.classList.remove("dark");
		}
	}, [resolvedTheme]);
	return null;
}
