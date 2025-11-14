"use client";

import { PhoneLoginForm } from "@/components/contact/form/PhoneLogin";
import { SignInForm } from "@/components/contact/form/SignIn";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function SignInPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || undefined;
	const supabase = createClientComponentClient();

	const buildRedirectTo = useCallback(
		(provider: "linkedin" | "facebook") => {
			if (typeof window === "undefined") {
				return undefined;
			}

			const search = new URLSearchParams({ provider });
			if (callbackUrl) {
				search.set("redirectTo", callbackUrl);
			}

			return `${window.location.origin}/api/auth/supabase/callback?${search.toString()}`;
		},
		[callbackUrl],
	);

	const handleLinkedIn = useCallback(async () => {
		const destination = buildRedirectTo("linkedin");
		if (!destination) {
			return;
		}

		await supabase.auth.signInWithOAuth({
			provider: "linkedin_oidc",
			options: { redirectTo: destination },
		});
		toast({
			title: "LinkedIn OAuth",
			description: "LinkedIn account connected. Finishing sign-in...",
		});
	}, [buildRedirectTo, supabase]);

	const handleFacebook = useCallback(async () => {
		const destination = buildRedirectTo("facebook");
		if (!destination) {
			return;
		}

		await supabase.auth.signInWithOAuth({
			provider: "facebook",
			options: { redirectTo: destination },
		});
		toast({
			title: "Facebook OAuth",
			description: "Facebook account connected. Finishing sign-in...",
		});
	}, [buildRedirectTo, supabase]);
	return (
		<div className="container grid min-h-screen w-screen flex-col items-center py-12 lg:max-w-none lg:grid-cols-2 lg:px-0 lg:py-20">
			<div className="hidden h-full bg-muted lg:block" />
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="font-semibold text-2xl tracking-tight">Welcome</h1>
						<p className="text-muted-foreground text-sm">
							Sign in to pick up right where you left off.
						</p>
					</div>
					<div className="grid gap-6">
						<Tabs defaultValue="email" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="email">Email</TabsTrigger>
								<TabsTrigger value="phone">Phone</TabsTrigger>
							</TabsList>
							<TabsContent value="email" className="space-y-4">
								<SignInForm callbackUrl={callbackUrl} />
							</TabsContent>
							<TabsContent value="phone" className="space-y-4">
								<PhoneLoginForm callbackUrl={callbackUrl} />
							</TabsContent>
						</Tabs>
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
							<Button
								variant="outline"
								type="button"
								onClick={() => void handleLinkedIn()}
							>
								<Icons.linkedIn className="mr-2 h-4 w-4" /> Continue with
								LinkedIn
							</Button>
							<Button
								variant="outline"
								type="button"
								onClick={() => void handleFacebook()}
							>
								<Icons.facebook className="mr-2 h-4 w-4" /> Continue with
								Facebook
							</Button>
						</div>
					</div>
					<p className="px-8 text-center text-muted-foreground text-sm">
						Don't have an account?{" "}
						<Link
							href="/signUp"
							className="underline underline-offset-4 hover:text-brand"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
