import { type NextRequest, NextResponse } from "next/server";

const DEALSCALE_API_BASE =
	process.env.DEALSCALE_API_BASE || "https://api.dealscale.io";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const response = await fetch(
		`${DEALSCALE_API_BASE}/api/v1/affiliates/track/click`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		},
	);

	return NextResponse.json(await response.json());
}
