"use client";

import { ConfirmCredentialsForm } from "@/components/contact/form/ConfirmCredentialsForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmCredentialsContent() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	if (!token) {
		return (
			<div className="text-center">
				<h2 className="font-semibold text-xl">Invalid Reset Link</h2>
				<p className="text-muted-foreground">
					The password reset link is missing a token. Please request a new one.
				</p>
				<Link
					href="/forgot-password"
					className="mt-4 inline-block text-brand underline underline-offset-4"
				>
					Request a new link
				</Link>
			</div>
		);
	}

	return <ConfirmCredentialsForm token={token} />;
}

export default function ConfirmCredentialsPage() {
	return (
		<div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="hidden h-full bg-muted lg:block" />
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="font-semibold text-2xl tracking-tight">
							Choose a New Password
						</h1>
						<p className="text-muted-foreground text-sm">
							Enter and confirm your new password below.
						</p>
					</div>
					<Suspense fallback={<div>Loading...</div>}>
						<ConfirmCredentialsContent />
					</Suspense>
					<p className="px-8 text-center text-muted-foreground text-sm">
						Remembered your password?{"	"}
						<Link
							href="/signIn"
							className="underline underline-offset-4 hover:text-brand"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
