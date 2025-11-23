import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

interface DealScaleUser {
	id?: string;
	name?: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	[key: string]: unknown;
}

type ProfileSetupStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

interface DealScaleAuthResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	user: DealScaleUser;
	session_id: string;
	profile_setup_status: ProfileSetupStatus;
}

type DealScaleTokens = Pick<
	DealScaleAuthResponse,
	| "access_token"
	| "refresh_token"
	| "token_type"
	| "expires_in"
	| "session_id"
	| "profile_setup_status"
>;

declare module "next-auth" {
	interface Session {
		dsTokens?: DealScaleTokens;
		user: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}

	interface User {
		dsTokens?: DealScaleTokens;
		raw?: DealScaleUser;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		dsTokens?: DealScaleTokens;
		user?: {
			id?: string;
			email?: string;
		};
	}
}

function getRequiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is not set`);
	}
	return value;
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Email and Password",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Missing email or password");
				}

				if (credentials.email.startsWith("phone:")) {
					try {
						const authData = JSON.parse(
							credentials.password,
						) as DealScaleAuthResponse;
						const phoneNumber = credentials.email.replace("phone:", "");

						return {
							id: authData.user?.id ?? authData.session_id ?? "user",
							email: phoneNumber,
							name:
								authData.user?.name ?? authData.user?.first_name ?? undefined,
							dsTokens: {
								access_token: authData.access_token,
								refresh_token: authData.refresh_token,
								token_type: authData.token_type,
								expires_in: authData.expires_in,
								session_id: authData.session_id,
								profile_setup_status: authData.profile_setup_status,
							},
							raw: authData.user ?? {},
						};
					} catch {
						throw new Error("Invalid phone authentication data");
					}
				}

				let res: Response;
				try {
					res = await fetch(`${DEALSCALE_API_BASE}/api/v1/auth/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
							device_info: { user_agent: "nextjs-app" },
							remember_me: false,
						}),
					});
				} catch (error) {
					console.error("DealScale login request failed", error);
					throw new Error(
						"Unable to reach authentication service. Please try again later.",
					);
				}

				if (!res.ok) {
					let message = "Invalid credentials";
					try {
						const data = await res.json();
						message = data?.detail ?? data?.message ?? message;
					} catch {}
					throw new Error(message);
				}

				const data: DealScaleAuthResponse = await res.json();

				return {
					id: data.user?.id ?? data.session_id ?? "user",
					email: credentials.email,
					name: data.user?.name ?? data.user?.first_name ?? undefined,
					dsTokens: {
						access_token: data.access_token,
						refresh_token: data.refresh_token,
						token_type: data.token_type,
						expires_in: data.expires_in,
						session_id: data.session_id,
						profile_setup_status: data.profile_setup_status,
					},
					raw: data.user ?? {},
				};
			},
		}),
		LinkedInProvider({
			clientId: getRequiredEnv("LINKEDIN_CLIENT_ID"),
			clientSecret: getRequiredEnv("LINKEDIN_CLIENT_SECRET"),
		}),
		FacebookProvider({
			clientId: getRequiredEnv("FACEBOOK_CLIENT_ID"),
			clientSecret: getRequiredEnv("FACEBOOK_CLIENT_SECRET"),
		}),
	],
	session: { strategy: "jwt" },
	pages: {
		signIn: "/signIn",
		signOut: "/signOut",
		error: "/signIn",
	},
	events: {
		async signIn(message) {
			const provider = message.account?.provider;

			if (provider !== "linkedin" && provider !== "facebook") {
				return;
			}

			const baseUrl =
				process.env.NEXTAUTH_URL ??
				(process.env.VERCEL_URL
					? `https://${process.env.VERCEL_URL}`
					: undefined);

			if (!baseUrl) {
				console.warn(
					"Missing NEXTAUTH_URL or VERCEL_URL; skipping social credential sync",
				);
				return;
			}

			try {
				await fetch(`${baseUrl}/api/auth/social-sign-in`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						provider,
						accessToken: message.account?.access_token,
						refreshToken: message.account?.refresh_token,
						expiresAt: message.account?.expires_at,
					}),
				});
			} catch (error) {
				console.error("Failed to call social credential sync endpoint", error);
			}
		},
	},
	callbacks: {
		async signIn({ account }) {
			if (!account) {
				return true;
			}

			if (account.provider === "linkedin" || account.provider === "facebook") {
				console.info(`Social login detected for provider ${account.provider}`);
			}

			return true;
		},
		async jwt({ token, user }) {
			if (user?.dsTokens) {
				token.dsTokens = user.dsTokens;
				token.user = { id: user.id, email: user.email };
			}
			return token;
		},
		async session({ session, token }) {
			if (token.dsTokens) {
				session.dsTokens = token.dsTokens;
			}
			if (session.user && token.user) {
				session.user.id = token.user.id;
				session.user.email = token.user.email;
			}
			return session;
		},
	},
};
