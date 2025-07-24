"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect } from "react";

/**
 * Global 404 page for the Next.js app directory.
 * This file must be named exactly `not-found.tsx` and live directly in `src/app/`.
 * DO NOT use underscores, folders, or `/page`.
 */
export default function NotFound() {
	useEffect(() => {
		// You can add analytics or error reporting here if needed
		console.log("Not found page accessed");
	}, []);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<h1 className="mb-4 font-bold text-4xl">404 - Page Not Found</h1>
			<Button onClick={() => redirect("/")}>Return Home</Button>
		</div>
	);
}
