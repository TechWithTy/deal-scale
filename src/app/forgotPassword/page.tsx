"use client";

import { ForgotPasswordForm } from "@/components/contact/form/ForgotPassword";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || undefined;
	return (
		<div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="hidden h-full bg-muted lg:block" />
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="font-semibold text-2xl tracking-tight">
							Reset Password
						</h1>
						<p className="text-muted-foreground text-sm">
							Enter your email to receive a password reset link
						</p>
					</div>
					<ForgotPasswordForm callbackUrl={callbackUrl} />
					<p className="px-8 text-center text-muted-foreground text-sm">
						Remember your password?{" "}
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
