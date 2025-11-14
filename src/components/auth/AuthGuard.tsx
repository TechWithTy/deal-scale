"use client";

import { useAuthModal } from "@/components/auth/use-auth-store";
import { Icons } from "@/components/icons";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface AuthGuardProps {
	children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
	const { data: session, status } = useSession();
	const { open } = useAuthModal();

	useEffect(() => {
		if (status === "unauthenticated") {
			open("signin");
		}
	}, [status, open]);

	if (status === "loading") {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Icons.spinner className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (status === "unauthenticated") {
		// Render nothing, as the modal will be open
		return null;
	}

	return <>{children}</>;
}
