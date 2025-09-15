"use client";

import { SignUpForm } from "@/components/contact/form/SignUp";
import { useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || undefined;
	return (
		<div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="hidden h-full bg-muted lg:block" />
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="font-semibold text-2xl tracking-tight">
							Create an account
						</h1>
						<p className="text-muted-foreground text-sm">
							Enter your details to create your account
						</p>
					</div>
					<div className="grid gap-6">
						<SignUpForm callbackUrl={callbackUrl} />
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>
						<div className="grid gap-2">
							<Button variant="outline" type="button">
								<Icons.linkedIn className="mr-2 h-4 w-4" /> Continue with
								LinkedIn
							</Button>
							<Button variant="outline" type="button">
								<Icons.facebook className="mr-2 h-4 w-4" /> Continue with
								Facebook
							</Button>
						</div>
					</div>
					<p className="px-8 text-center text-muted-foreground text-sm">
						Already have an account?{" "}
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
