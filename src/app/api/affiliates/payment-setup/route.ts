import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.leadorchestra.com";

/**
 * Submit payment setup information for approved affiliates (Step 2).
 * This endpoint requires the user to be approved before submitting banking information.
 */
export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user || !session?.dsTokens?.access_token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// First, check if the user is approved
	const statusResponse = await fetch(
		`${DEALSCALE_API_BASE}/api/v1/affiliates/application/status`,
		{
			headers: {
				Authorization: `Bearer ${session.dsTokens.access_token}`,
			},
		},
	);

	if (!statusResponse.ok) {
		return NextResponse.json(
			{ error: "Failed to verify affiliate status" },
			{ status: 500 },
		);
	}

	const statusData = (await statusResponse.json()) as { status?: string };
	if (statusData.status !== "approved" && statusData.status !== "active") {
		return NextResponse.json(
			{
				error:
					"Payment setup is only available for approved affiliates. Please wait for approval.",
			},
			{ status: 403 },
		);
	}

	const body = await req.json();
	const response = await fetch(
		`${DEALSCALE_API_BASE}/api/v1/affiliates/payment-setup`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${session.dsTokens.access_token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		},
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		return NextResponse.json(
			{ error: errorData?.error || "Failed to submit payment setup" },
			{ status: response.status },
		);
	}

	return NextResponse.json(await response.json());
}

