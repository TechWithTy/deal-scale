"use client";
import { useDataModule } from "@/stores/useDataModuleStore";
import type { CompanyLogoDictType } from "@/types/service/trusted-companies";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
	company: string;
	height?: number;
	width?: number;
}

export const CompanyRenderer = ({
	company,
	height = 50,
	width = 50,
}: Props) => {
	const [isClient, setIsClient] = useState(false);
	const { status, logos, error } = useDataModule(
		"service/slug_data/trustedCompanies",
		({ status: moduleStatus, data, error: moduleError }) => ({
			status: moduleStatus,
			logos: (data?.companyLogos ?? {}) as CompanyLogoDictType,
			error: moduleError,
		}),
	);

	const isLoading = status === "idle" || status === "loading";
	const isError = status === "error";

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	if (isLoading) {
		return (
			<div
				className="flex items-center justify-center rounded bg-gray-100 text-gray-400 text-xs dark:bg-gray-800"
				style={{ width, height }}
			>
				Loading…
			</div>
		);
	}

	if (isError) {
		console.error("[CompanyRenderer] Failed to load company logos", error);
	}

	const normalizedKey = company.trim().toLowerCase();
	const logoEntry = logos[normalizedKey];
	if (logoEntry) {
		return (
			<div
				style={{
					width: `${width * 2.5}px`,
					height: `${height * 2.5}px`,
					position: "relative",
				}}
			>
				<Image
					src={logoEntry.logo}
					alt={`${company} Logo`}
					fill
					className="object-contain"
				/>
			</div>
		);
	}

	return (
		<div
			style={{
				width,
				height,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#f0f0f0",
				borderRadius: "4px",
			}}
		>
			{company.charAt(0).toUpperCase()}
		</div>
	);
};
