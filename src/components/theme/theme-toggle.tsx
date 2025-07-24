"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
	className?: string;
	variant?:
		| "ghost"
		| "outline"
		| "link"
		| "default"
		| "destructive"
		| "secondary";
	size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({
	className,
	variant = "ghost",
	size = "icon",
}: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant={variant}
				size={size}
				className={cn("h-9 w-9", className)}
				aria-label="Toggle theme"
			/>
		);
	}

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
	const label = `Switch to ${nextTheme} mode`;

	return (
		<Button
			variant={variant}
			size={size}
			className={cn("h-9 w-9 transition-colors hover:bg-accent/50", className)}
			onClick={toggleTheme}
			aria-label={label}
		>
			{resolvedTheme === "dark" ? (
				<Sun className="h-4 w-4" />
			) : (
				<Moon className="h-4 w-4" />
			)}
			<span className="sr-only">{label}</span>
		</Button>
	);
}
