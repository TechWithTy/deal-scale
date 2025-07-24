// src/app/api/beehiiv/subscribe/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log("[API] Request body:", body);

		const {
			email,
			reactivate_existing,
			send_welcome_email,
			utm_source,
			utm_medium,
			utm_campaign,
			referring_site,
			stripe_customer_id,
		} = body;
		if (!email) {
			console.error("[API] Missing email in request body");
			return NextResponse.json(
				{ message: "Email is required" },
				{ status: 400 },
			);
		}

		const beehiivUrl = `https://api.beehiiv.com/v2/publications/${process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2}/subscriptions`;
		const beehiivHeaders = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
		};
		const beehiivBody = JSON.stringify({
			email,
			reactivate_existing: reactivate_existing || false,
			send_welcome_email: send_welcome_email || false,
			utm_source: utm_source || "default_source",
			utm_medium: utm_medium || "default_medium",
			utm_campaign: utm_campaign || "default_campaign",
			referring_site: referring_site || "default_site",
			stripe_customer_id: stripe_customer_id || "",
		});
		console.log("[API] Sending request to Beehiiv:", {
			url: beehiivUrl,
			headers: beehiivHeaders,
			body: beehiivBody,
		});

		const beehiivRes = await fetch(beehiivUrl, {
			method: "POST",
			headers: beehiivHeaders,
			body: beehiivBody,
		});

		const text = await beehiivRes.text();
		let beehiivData: { message?: unknown; raw?: string };
		try {
			beehiivData = text ? JSON.parse(text) : {};
		} catch (parseError) {
			console.error(
				"[API] Failed to parse Beehiiv response as JSON:",
				parseError,
				text,
			);
			beehiivData = { raw: text };
		}
		console.log("[API] Beehiiv API response:", beehiivRes.status, beehiivData);

		if (!beehiivRes.ok) {
			console.error("[API] Beehiiv API error:", beehiivRes.status, beehiivData);
			return NextResponse.json(
				{
					message: beehiivData.message || "Failed to subscribe",
					beehiivStatus: beehiivRes.status,
					beehiivData,
				},
				{ status: beehiivRes.status },
			);
		}

		const response = NextResponse.json(beehiivData, { status: 200 });
		response.cookies.set("userSubscribedNewsletter", "true", {
			maxAge: 60 * 60 * 24 * 365,
		});
		return response;
	} catch (error) {
		console.error("[API] Internal server error:", error);
		return NextResponse.json(
			{
				message: "Internal server error",
				error: error instanceof Error ? error.stack : error,
			},
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	// Read by email: /api/beehiiv/subscribe?email=foo@bar.com
	const { searchParams } = new URL(req.url);
	const email = searchParams.get("email");
	if (!email) {
		return NextResponse.json({ message: "Email is required" }, { status: 400 });
	}
	try {
		const apiKey = process.env.BEEHIIV_API_KEY;
		const publicationId = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
		const url = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/by_email/${encodeURIComponent(email)}`;
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${apiKey}` },
		});
		const data = await res.json();
		if (!res.ok) {
			return NextResponse.json(
				{ message: data.message || "Not found", data },
				{ status: res.status },
			);
		}
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Internal server error",
				error: error instanceof Error ? error.stack : error,
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(req: Request) {
	// Remove by email: expects { email } in JSON body
	try {
		const body = await req.json();
		const { email } = body;
		if (!email)
			return NextResponse.json(
				{ message: "Email is required" },
				{ status: 400 },
			);
		const apiKey = process.env.BEEHIIV_API_KEY;
		const publicationId = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
		// 1. Lookup subscription by email
		const lookupRes = await fetch(
			`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/by_email/${encodeURIComponent(email)}`,
			{ headers: { Authorization: `Bearer ${apiKey}` } },
		);
		if (!lookupRes.ok) {
			const errData = await lookupRes.json();
			return NextResponse.json(
				{ message: "Could not find subscription for email", errData },
				{ status: 404 },
			);
		}
		const lookupData = await lookupRes.json();
		const subscriptionId = lookupData?.data?.id;
		if (!subscriptionId)
			return NextResponse.json(
				{ message: "No subscription ID found for email" },
				{ status: 404 },
			);
		// 2. Delete subscription
		const delRes = await fetch(
			`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/${subscriptionId}`,
			{ method: "DELETE", headers: { Authorization: `Bearer ${apiKey}` } },
		);
		if (!delRes.ok && delRes.status !== 204) {
			const errData = await delRes.json();
			return NextResponse.json(
				{ message: "Failed to delete subscription", errData },
				{ status: delRes.status },
			);
		}
		return NextResponse.json(
			{ message: "Subscription deleted", subscriptionId },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Internal server error",
				error: error instanceof Error ? error.stack : error,
			},
			{ status: 500 },
		);
	}
}

export async function PUT(req: Request) {
	// Update subscription by ID: expects { subscriptionId, updates } in JSON body
	try {
		const body = await req.json();
		const { subscriptionId, updates } = body;
		if (!subscriptionId || !updates)
			return NextResponse.json(
				{ message: "subscriptionId and updates required" },
				{ status: 400 },
			);
		const apiKey = process.env.BEEHIIV_API_KEY;
		const publicationId = process.env.NEXT_PUBLIC_BEEHIIV_NEWSLETTER_ID_V2;
		const url = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/${subscriptionId}`;
		const res = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updates),
		});
		const data = await res.json();
		if (!res.ok) {
			return NextResponse.json(
				{ message: data.message || "Failed to update subscription", data },
				{ status: res.status },
			);
		}
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Internal server error",
				error: error instanceof Error ? error.stack : error,
			},
			{ status: 500 },
		);
	}
}
