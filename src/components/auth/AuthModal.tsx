"use client";

import { useCallback } from "react";

import { useAuthModal } from "@/components/auth/use-auth-store";
import { ForgotPasswordForm } from "@/components/contact/form/ForgotPassword";
import { SignInForm } from "@/components/contact/form/SignIn";
import { SignUpForm } from "@/components/contact/form/SignUp";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { AuthView } from "@/types/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// Map views to their respective titles and subtitles
const viewConfig: Record<AuthView, { title: string; subtitle: string }> = {
	signin: {
		title: "Welcome",
		subtitle: "Sign in to pick up right where you left off.",
	},
	signup: {
		title: "Create your DealScale account",
		subtitle: "We'll confirm everything by email or SMS after you finish.",
	},
	reset: {
		title: "Reset Password",
		subtitle: "Enter your email to receive a password reset link",
	},
	"verify-email": {
		title: "Verify your email",
		subtitle: "A verification link has been sent to your email address.",
	},
	"verify-phone": {
		title: "Verify your phone",
		subtitle: "A verification code has been sent to your phone.",
	},
};

export function AuthModal() {
	const { isOpen, view, setView, close } = useAuthModal();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") || undefined;
	const supabase = createClientComponentClient();

	const buildRedirectTo = useCallback(
		(provider: "linkedin" | "facebook") => {
			if (typeof window === "undefined") {
				return undefined;
			}

			const params = new URLSearchParams({ provider });
			if (callbackUrl) {
				params.set("redirectTo", callbackUrl);
			}

			return `${window.location.origin}/api/auth/supabase/callback?${params.toString()}`;
		},
		[callbackUrl],
	);

	const handleLinkedIn = useCallback(async () => {
		if (view === "signin") {
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
			return;
		}

		toast({
			title: "LinkedIn OAuth",
			description:
				"LinkedIn account connected. We'll finish setting things up.",
		});
		await signIn("linkedin", callbackUrl ? { callbackUrl } : undefined);
	}, [view, buildRedirectTo, supabase, callbackUrl]);

	const handleFacebook = useCallback(async () => {
		if (view === "signin") {
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
			return;
		}

		toast({
			title: "Facebook OAuth",
			description:
				"Facebook account connected. We'll finish setting things up.",
		});
		await signIn("facebook", callbackUrl ? { callbackUrl } : undefined);
	}, [view, buildRedirectTo, supabase, callbackUrl]);

	if (!isOpen) return null;

	const { title, subtitle } = viewConfig[view];

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Escape") {
			close();
		}
	};

	const renderForm = () => {
		switch (view) {
			case "signin":
				return <SignInForm callbackUrl={callbackUrl} />;
			case "signup":
				return <SignUpForm callbackUrl={callbackUrl} />;
			case "reset":
				return <ForgotPasswordForm callbackUrl={callbackUrl} />;
			case "verify-email":
			case "verify-phone":
				return null; // No form needed for these views
			default:
				return null;
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onKeyDown={handleKeyDown}
		>
			<div
				role="button"
				tabIndex={0}
				className="fixed inset-0 bg-background/80 backdrop-blur-sm"
				onClick={close}
				onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && close()}
			/>
			<div className="relative z-50 w-full max-w-md overflow-hidden rounded-lg border bg-background p-6 shadow-lg">
				<button
					type="button"
					onClick={close}
					onKeyDown={(e) => e.key === "Enter" && close()}
					className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
				>
					<X className="h-5 w-5" />
					<span className="sr-only">Close</span>
				</button>

				<div className="mx-auto flex w-full flex-col justify-center space-y-6">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
						<p className="text-muted-foreground text-sm">{subtitle}</p>
					</div>

					{(view === "signin" || view === "signup") && (
						<>
							<div className="space-y-3">
								<Button
									variant="outline"
									type="button"
									onClick={() => void handleLinkedIn()}
									className="w-full"
								>
									<Icons.linkedIn className="mr-2 h-4 w-4" /> Continue with
									LinkedIn
								</Button>
								<Button
									variant="outline"
									type="button"
									onClick={() => void handleFacebook()}
									className="w-full"
								>
									<Icons.facebook className="mr-2 h-4 w-4" /> Continue with
									Facebook
								</Button>
							</div>
							<div className="relative my-3">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
						</>
					)}

					{renderForm()}

					<p className="px-8 text-center text-muted-foreground text-sm">
						{view === "signin" && (
							<>
								Don&apos;t have an account?{" "}
								<button
									type="button"
									onClick={() => setView("signup")}
									className="font-medium text-primary underline underline-offset-4"
								>
									Sign up
								</button>
							</>
						)}
						{view === "signup" && (
							<>
								Already have an account?{" "}
								<button
									type="button"
									onClick={() => setView("signin")}
									className="font-medium text-primary underline-offset-4 hover:underline"
								>
									Sign in
								</button>
							</>
						)}
						{view === "reset" && (
							<>
								Remember your password?{" "}
								<button
									type="button"
									onClick={() => setView("signin")}
									className="font-medium text-primary underline-offset-4 hover:underline"
								>
									Sign in
								</button>
							</>
						)}
						{(view === "verify-email" || view === "verify-phone") && (
							<button
								type="button"
								onClick={() => setView("signin")}
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								Back to Sign In
							</button>
						)}
					</p>
				</div>
			</div>
		</div>
	);
}
