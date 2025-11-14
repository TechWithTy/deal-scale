"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({
	error,
}: { error: Error & { digest?: string } }) {
	useEffect(() => {
		// You can add analytics or error reporting here if needed
		console.error("Error page accessed", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<h1 className="mb-4 font-bold text-4xl">An Error Occurred</h1>
			{error && <p className="mb-2 text-lg text-red-400">{error.message}</p>}
			<Button onClick={() => redirect("/")}>Return Home</Button>
		</div>
	);
}
