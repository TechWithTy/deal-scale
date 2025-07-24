import { useAuthModal } from "@/components/auth/use-auth-store";
import { X } from "lucide-react";

import { ForgotPasswordForm } from "@/components/contact/form/ForgotPassword";
import { SignInForm } from "@/components/contact/form/SignIn";
import { SignUpForm } from "@/components/contact/form/SignUp";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { AuthView } from "@/types/auth";

// Map views to their respective titles and subtitles
const viewConfig: Record<AuthView, { title: string; subtitle: string }> = {
	signin: {
		title: "Welcome back",
		subtitle: "Enter your credentials to access your account",
	},
	signup: {
		title: "Create an account",
		subtitle: "Enter your details to create your account",
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
				return <SignInForm />;
			case "signup":
				return <SignUpForm />;
			case "reset":
				return <ForgotPasswordForm />;
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
								<Button variant="outline" type="button" className="w-full">
									<Icons.linkedIn className="mr-2 h-4 w-4" /> Continue with
									LinkedIn
								</Button>
								<Button variant="outline" type="button" className="w-full">
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
