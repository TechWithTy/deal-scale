"use client";
import { companyLogos } from "@/data/service/slug_data/trustedCompanies";
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

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	const logoUrl = companyLogos[company.toLowerCase()];
	if (logoUrl) {
		return (
			<div
				style={{
					width: `${width * 2.5}px`,
					height: `${height * 2.5}px`,
					position: "relative",
				}}
			>
				<Image
					src={logoUrl.logo}
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
