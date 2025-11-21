import { type Lead, addToSendGrid } from "@/lib/externalRequests/sendgrid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface CloserApplicationRequest {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	realEstateLicense: string;
	licenseState: string;
	yearsExperience: string;
	dealsClosed: string;
	availability: string;
	portfolioUrl?: string;
	whyApply: string;
	termsAccepted: boolean;
}

export async function POST(req: NextRequest) {
	try {
		const body: CloserApplicationRequest = await req.json();

		// Basic validation
		if (!body.email) {
			return NextResponse.json(
				{ error: "Email is a required field." },
				{ status: 400 },
			);
		}

		if (!body.termsAccepted) {
			return NextResponse.json(
				{ error: "You must accept the terms and conditions." },
				{ status: 400 },
			);
		}

		// Construct the lead object for SendGrid
		const lead: Lead = {
			firstName: body.firstName ?? "",
			lastName: body.lastName ?? "",
			companyName: "",
			landingPage: "/closers/apply",
			email: body.email,
			phone: body.phone ?? "",
			postal_code: "",
			selectedService: "Remote Closer Application",
			message: `Remote Closer Application Details:
License: ${body.realEstateLicense} (${body.licenseState})
Experience: ${body.yearsExperience}
Deals Closed: ${body.dealsClosed}
Availability: ${body.availability}
Portfolio: ${body.portfolioUrl || "Not provided"}

Why Apply:
${body.whyApply}`,
			termsAccepted: body.termsAccepted,
			startupStage: "",
			fundingRaised: "",
			timeline: "",
			budget: "",
			newsletterSignup: false,
			files: [],
			beta_tester: false,
			pilot_member: false,
		};

		// Add to SendGrid list
		const listName = "Deal Scale Closers"; // You may want to create a specific list for closers
		const statusCode = await addToSendGrid(lead, listName);

		if (statusCode !== 202) {
			return NextResponse.json(
				{
					error: "Failed to submit closer application.",
					details: `Status code: ${statusCode}`,
				},
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ message: "Closer application submitted successfully." },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Closer Application API Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json(
			{ error: "An internal server error occurred.", details: errorMessage },
			{ status: 500 },
		);
	}
}


