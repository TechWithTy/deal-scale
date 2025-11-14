import type { Database } from "@/types/_postgresql/supabase";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase service-role client for server-side use.
 * Throws if required environment variables are missing to avoid silent misconfigurations.
 */
export function createSupabaseServiceClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url) {
		throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
	}

	if (!serviceRoleKey) {
		throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
	}

	return createClient<Database>(url, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
