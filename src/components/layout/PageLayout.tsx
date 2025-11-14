import { AuthModal } from "@/components/auth/AuthModal";
import { Footer } from "@/components/layout/Footer";
import { companyData } from "@/data/company";
import type React from "react";
import Navbar from "./Navbar";

interface PageLayoutProps {
	children: React.ReactNode;
	className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
	return (
		<div className={`flex min-h-screen flex-col ${className}`}>
			<Navbar />
			<main className="flex-grow overflow-x-hidden">{children}</main>
			<Footer {...companyData} />
			<AuthModal />
		</div>
	);
}
