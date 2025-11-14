import { type Lead, addToSendGrid } from "@/lib/externalRequests/sendgrid";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// * Basic validation to ensure email is present
		if (!body.email) {
			return NextResponse.json(
				{ error: "Email is a required field." },
				{ status: 400 },
			);
		}

		// * Construct the lead object, providing default values for non-required fields
		const lead: Lead = {
			firstName: body.firstName ?? "",
			lastName: body.lastName ?? "",
			companyName: body.companyName ?? "",
			landingPage: body.landingPage ?? "",
			email: body.email,
			phone: body.phone ?? "",
			postal_code: body.zipCode ?? "",
			selectedService: body.selectedService ?? "",
			message: body.message ?? "",
			termsAccepted: body.termsAccepted ?? false,
			startupStage: body.startupStage ?? "",
			fundingRaised: body.fundingRaised ?? "",
			timeline: body.timeline ?? "",
			budget: body.budget ?? "",
			newsletterSignup: body.newsletterSignup ?? false,
			files: body.files ?? [],
			beta_tester: body.beta_tester ?? false,
			pilot_member: body.pilot_member ?? false,
		};

		// * Add the contact to your main SendGrid list
		const listName = "Deal Scale"; // ? Using the global contact list as requested
		const statusCode = await addToSendGrid(lead, listName);

		if (statusCode !== 202) {
			return NextResponse.json(
				{
					error: "Failed to add contact to SendGrid.",
					details: `Status code: ${statusCode}`,
				},
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ message: "Contact added to SendGrid successfully." },
			{ status: 200 },
		);
	} catch (error) {
		console.error("API Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json(
			{ error: "An internal server error occurred.", details: errorMessage },
			{ status: 500 },
		);
	}
}
