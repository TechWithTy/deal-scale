"use client";

import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ErrorPage({
	error,
}: { error: Error & { digest?: string } }) {
	const router = useRouter();
	const [logs, setLogs] = useState<string>("");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		// Log the error
		console.error("Error page accessed", error);

		// Collect browser console logs
		const collectLogs = () => {
			const errorDetails = {
				message: error.message,
				stack: error.stack,
				digest: error.digest,
				userAgent: navigator.userAgent,
				url: window.location.href,
				timestamp: new Date().toISOString(),
			};

			// Format logs for easy copying
			const logText = `Error Report
================
Timestamp: ${errorDetails.timestamp}
URL: ${errorDetails.url}
User Agent: ${errorDetails.userAgent}

Error Message:
${errorDetails.message}

Error Stack:
${errorDetails.stack || "No stack trace available"}

Error Digest:
${errorDetails.digest || "No digest available"}

Browser Console Logs:
(Please include any relevant console errors you see)`;

			setLogs(logText);
		};

		collectLogs();
	}, [error]);

	const copyLogs = async () => {
		try {
			await navigator.clipboard.writeText(logs);
			setCopied(true);
			toast.success("Error logs copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			toast.error("Failed to copy logs. Please try again.");
			console.error("Failed to copy logs:", err);
		}
	};

	const reportIssue = () => {
		// Navigate to contact page with error context
		const errorParams = new URLSearchParams({
			subject: "Error Report",
			error: error.message,
			digest: error.digest || "",
		});
		router.push(`/contact?${errorParams.toString()}`);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4">
			<div className="mx-auto flex max-w-2xl flex-col items-center text-center">
				<h1 className="mb-4 font-bold text-4xl">Something Went Wrong</h1>
				<p className="mb-6 text-lg text-muted-foreground">
					We encountered an unexpected error. Please try again or return to the homepage.
				</p>

				{/* Error Details (Collapsible) */}
				<div className="mb-6 w-full rounded-lg border border-border bg-muted/50 p-4 text-left">
					<details className="group">
						<summary className="cursor-pointer font-semibold text-sm text-muted-foreground hover:text-foreground">
							Error Details
						</summary>
						<div className="mt-3 space-y-2 font-mono text-xs">
							<div>
								<span className="font-semibold">Message:</span>{" "}
								<span className="text-muted-foreground">{error.message}</span>
							</div>
							{error.digest && (
								<div>
									<span className="font-semibold">Digest:</span>{" "}
									<span className="text-muted-foreground">{error.digest}</span>
								</div>
							)}
						</div>
					</details>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button onClick={() => router.push("/")} variant="default">
						<Home className="mr-2 h-4 w-4" />
						Return Home
					</Button>
					<Button
						onClick={copyLogs}
						variant="outline"
						disabled={!logs}
					>
						<Copy className={`mr-2 h-4 w-4 ${copied ? "text-green-500" : ""}`} />
						{copied ? "Copied!" : "Copy Error Logs"}
					</Button>
					<Button onClick={reportIssue} variant="outline">
						<ExternalLink className="mr-2 h-4 w-4" />
						Report Issue
					</Button>
				</div>

				{/* Help Text */}
				<p className="mt-6 text-sm text-muted-foreground">
					If this problem persists, please copy the error logs and report the issue
					so we can help resolve it.
				</p>
			</div>
		</div>
	);
}
