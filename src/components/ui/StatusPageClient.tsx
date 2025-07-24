"use client";

import dynamic from "next/dynamic";

// Dynamically import the StatusPage component with no SSR
const StatusPage = dynamic(
	() => import("@/components/ui/StatusPage").then((mod) => mod.StatusPage),
	{ ssr: false },
);

interface StatusPageClientProps {
	type: "success" | "error";
}

export default function StatusPageClient({ type }: StatusPageClientProps) {
	return <StatusPage type={type} />;
}
