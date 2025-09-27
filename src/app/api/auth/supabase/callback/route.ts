import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { encryptOAuthToken } from "@/lib/security";
import type { Database } from "@/types/_postgresql/supabase";
import { authOptions } from "@/lib/authOptions";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

function resolveRedirect(target?: string | null) {
	if (!target) {
		return "/settings/integrations";
	}

	try {
		const url = new URL(target, process.env.NEXTAUTH_URL ?? "http://localhost:3000");
		return url.pathname + url.search + url.hash;
	} catch (error) {
		console.warn("Invalid redirectTo provided, falling back to integrations page", error);
		return "/settings/integrations";
	}
}

function redirectWithParams(origin: string, destination: string, params: Record<string, string | null | undefined>) {
	const url = new URL(destination, origin);
	for (const [key, value] of Object.entries(params)) {
		if (typeof value === "string" && value.length > 0) {
			url.searchParams.set(key, value);
		}
	}
	return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const supabaseError = searchParams.get("error");
	const supabaseErrorDescription = searchParams.get("error_description");
	const code = searchParams.get("code");
	const providerParam = searchParams.get("provider");
	const redirectTo = searchParams.get("redirectTo");

	const redirectDestination = resolveRedirect(redirectTo);
	const origin = request.nextUrl.origin;

	if (supabaseError) {
		console.error("Supabase OAuth provider error", {
			supabaseError,
			supabaseErrorDescription,
		});

		return redirectWithParams(origin, redirectDestination, {
			status: "error",
			message: `supabase_${supabaseError}`,
			detail: supabaseErrorDescription ?? undefined,
		});
	}

	if (!code) {
		return redirectWithParams(origin, redirectDestination, {
			status: "error",
			message: "missing_code",
		});
	}

	const provider = providerParam?.toUpperCase();

	if (!provider) {
		return redirectWithParams(origin, redirectDestination, {
			status: "error",
			message: "missing_provider",
		});
	}

	try {
		const cookieStore = await cookies();
		const supabase = createRouteHandlerClient<Database>({
			cookies: () => cookieStore,
		} as unknown as Parameters<typeof createRouteHandlerClient<Database>>[0]);

		const projectRef = (() => {
			const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
			if (!supabaseUrl) {
				return null;
			}

			try {
				return new URL(supabaseUrl).host.split(".")[0] ?? null;
			} catch (error) {
				console.warn("Failed to derive Supabase project ref", {
					supabaseUrl,
					error,
				});
				return null;
			}
		})();

		const codeVerifierCookieNames = projectRef
			? [
				`sb-${projectRef}-auth-token-code-verifier`,
				`sb-${projectRef}-auth-token-code-verifier.0`,
			]
			: [];

		const codeVerifier = codeVerifierCookieNames
			.map((name) => cookieStore.get(name)?.value)
			.find((value) => value);

		console.debug("Supabase OAuth PKCE cookies", {
			projectRef,
			codeVerifierCookieNames,
			codeVerifierPresent: Boolean(codeVerifier),
		});

		if (!codeVerifier) {
			console.error("Supabase PKCE code verifier missing from cookies");
			return redirectWithParams(origin, redirectDestination, {
				status: "error",
				message: "missing_code_verifier",
			});
		}
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (error || !data.session) {
			console.error("Supabase exchangeCodeForSession error", {
				message: error?.message,
				details: error,
				code,
			});
			return redirectWithParams(origin, redirectDestination, {
				status: "error",
				message: "supabase_exchange_failed",
				detail: error?.message,
			});
		}

		const providerAccessToken = data.session.provider_token;
		const providerRefreshToken = data.session.provider_refresh_token;
		const expiresAt = data.session.expires_at;

		if (!providerAccessToken) {
			return redirectWithParams(origin, redirectDestination, {
				status: "error",
				message: "missing_provider_token",
			});
		}

		const session = await getServerSession(authOptions);

		if (!session?.dsTokens?.access_token || !session.user?.id) {
			return redirectWithParams(origin, redirectDestination, {
				status: "error",
				message: "session_required",
			});
		}

		try {
			const providerUserId =
				(data.session.user?.user_metadata?.provider_id as string | undefined) ??
				(data.session.user?.user_metadata?.sub as string | undefined) ??
				data.session.user?.id ??
				null;
			const scope =
				(data.session.user?.user_metadata?.scope as string | undefined) ?? null;
			const expiresIn = data.session.expires_in ?? null;

			const response = await fetch(
				`${DEALSCALE_API_BASE}/api/v1/auth/social`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${session.dsTokens.access_token}`,
					},
					body: JSON.stringify({
						provider,
						provider_user_id: providerUserId,
						access_token: encryptOAuthToken(providerAccessToken),
						refresh_token: providerRefreshToken
							? encryptOAuthToken(providerRefreshToken)
							: null,
						expires_in: expiresIn ?? 3600,
						scope,
						username: session.user.name ?? null,
						handle: null,
						page_id: null,
						company_id: null,
						provider_data: null,
					}),
				},
			);

			if (!response.ok) {
				const payload = await response.text();
				console.error("Failed to persist social credentials", {
					status: response.status,
					payload,
				});
				return redirectWithParams(origin, redirectDestination, {
					status: "error",
					message: "credential_sync_failed",
					detail: response.statusText,
				});
			}
		} catch (error) {
			console.error("Error syncing social credentials", error);
			return redirectWithParams(origin, redirectDestination, {
				status: "error",
				message: "credential_sync_exception",
			});
		}

		return redirectWithParams(origin, redirectDestination, {
			status: "success",
			provider: provider.toLowerCase(),
		});
	} catch (error) {
		console.error("Supabase callback unexpected error", error);
		return redirectWithParams(origin, redirectDestination, {
			status: "error",
			message: "unexpected_error",
		});
	}
}
