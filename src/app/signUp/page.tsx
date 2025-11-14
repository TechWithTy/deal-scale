"use client";

import { PhoneLoginForm } from "@/components/contact/form/PhoneLogin";
import { SignUpForm } from "@/components/contact/form/SignUp";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || undefined;
	return (
		<div className="container grid min-h-screen w-screen flex-col items-center py-12 lg:max-w-none lg:grid-cols-2 lg:px-0 lg:py-20">
			<div className="hidden h-full bg-muted lg:block" />
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="font-semibold text-2xl tracking-tight">
							Create your DealScale account
						</h1>
						<p className="text-muted-foreground text-sm">
							We&rsquo;ll confirm everything by email or SMS after you finish.
						</p>
					</div>
					<div className="grid gap-6">
						<Tabs defaultValue="email" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="email">Email</TabsTrigger>
								<TabsTrigger value="phone">Phone</TabsTrigger>
							</TabsList>
							<TabsContent value="email" className="space-y-4">
								<SignUpForm callbackUrl={callbackUrl} />
							</TabsContent>
							<TabsContent value="phone" className="space-y-4">
								<div className="mb-4 space-y-2 text-center">
									<h3 className="font-medium">Sign up with Phone</h3>
									<p className="text-muted-foreground text-sm">
										We'll send you an OTP to verify your phone number
									</p>
								</div>
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
								onClick={async () => {
									toast({
										title: "LinkedIn OAuth",
										description:
											"LinkedIn account connected. We'll finish setting things up.",
									});
									await signIn(
										"linkedin",
										callbackUrl ? { callbackUrl } : undefined,
									);
								}}
							>
								<Icons.linkedIn className="mr-2 h-4 w-4" /> Continue with
								LinkedIn
							</Button>
							<Button
								variant="outline"
								type="button"
								onClick={async () => {
									toast({
										title: "Facebook OAuth",
										description:
											"Facebook account connected. We'll finish setting things up.",
									});
									await signIn(
										"facebook",
										callbackUrl ? { callbackUrl } : undefined,
									);
								}}
							>
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
