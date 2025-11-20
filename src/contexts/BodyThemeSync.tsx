"use client";
import { useTheme } from "@/contexts/theme-context";
import { useEffect } from "react";

/**
 * Syncs the body class between theme-cyberoni and theme-cyberoni-light
 * according to the resolved theme from context. Place this at the root layout.
 */
export default function BodyThemeSync() {
	const { resolvedTheme } = useTheme();
	useEffect(() => {
		document.body.classList.remove("theme-cyberoni", "theme-cyberoni-light");
		document.body.classList.add(
			resolvedTheme === "dark" ? "theme-cyberoni" : "theme-cyberoni-light",
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
