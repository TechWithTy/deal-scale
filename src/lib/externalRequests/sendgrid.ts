"use server";
import client, { Client } from "@sendgrid/client";
import type { ClientRequest } from "@sendgrid/client/src/request";
import sgMail, { ResponseError } from "@sendgrid/mail";
import { SendVerificationRequestParams } from "next-auth/providers/email";

interface SendGridList {
	id: string;
	name: string;
	contact_count: number;
}

interface SendGridListsResponse {
	result: SendGridList[];
}

export interface Lead {
	firstName: string;
	lastName: string;
	companyName: string;
	landingPage: string;
	email: string;
	phone: string;
	postal_code: string;
	selectedService: string;
	message: string;
	termsAccepted: boolean;
	startupStage: string;
	fundingRaised: string;
	timeline: string;
	budget: string;
	newsletterSignup: boolean;
	files: File[];
	test_segment?: string;
	beta_tester?: boolean;
	pilot_member?: boolean;
}

const isDevEnv = process.env.STAGING_ENVIRONMENT === "DEV";
const SENDGRID_KEY = isDevEnv
	? process.env.SENDGRID_TEST_API_KEY
	: process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_KEY as string);
client.setApiKey(SENDGRID_KEY as string);

// export async function sendMagicLink({ identifier }: SendVerificationRequestParams) {

// }

export async function sendMail(
	email: string,
	message: string,
	p0: string,
	p1: string,
) {
	const msg: sgMail.MailDataRequired = {
		to: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email for integration tests
		from: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email as sender
		subject: "Sendgrid email",
		text: message,
	};

	const response = await sgMail.send(msg);
	return response[0].statusCode;
}

export async function sendMailHtml(
	sender: string,
	email: string,
	subject: string,
	message: string,
) {
	const msg: sgMail.MailDataRequired = {
		to: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email for integration tests
		from: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email as sender
		replyTo: sender,
		subject: subject,
		html: message,
	};

	const response = await sgMail.send(msg);
	return response[0].statusCode;
}

export async function contactForm(
	sender: string,
	message: string,
	subject: string,
	firstName: string,
	lastName: string,
	referral: string,
) {
	const msg: sgMail.MailDataRequired = {
		to: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email for integration tests
		from: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email as sender
		replyTo: sender,
		subject: `Question/Message from ${sender} in ${subject}`,
		html: `
          <section>
            <h1>Contact requested by ${firstName} ${lastName} </h1>
            
            <p>City: ${subject}</p>
            <div>
                <p>message: ${message}</p>
                <p>email: ${sender}</p>
                <p>Reffral: ${referral}</p>
            </div>          
          <section>
        `,
	};

	const response = await sgMail.send(msg);
	return response[0].statusCode;
}
export async function addToSendGrid(
	lead: Lead,
	listName: string,
): Promise<number> {
	try {
		const targetListName = listName;

		// Validate required parameters
		if (!targetListName) {
			throw new Error("SendGrid list name is not provided");
		}

		// Get the target list
		const list = await getList(targetListName);
		if (!list) {
			throw new Error(`Failed to retrieve SendGrid list: ${targetListName}`);
		}

		// Create contact data with metadata
		const data = {
			list_ids: [list.id],
			contacts: [
				{
					email: lead.email,
					first_name: lead.firstName,
					last_name: lead.lastName,
					phone: lead.phone,
					postal_code: lead.postal_code,
					custom_fields: {
						affiliate_id: "",
						affiliate_member: "",
						agree_terms: "",
						bank_name: "",
						beta_tester: lead.beta_tester ? "true" : undefined,
						billing_address: "",
						business_email: "",
						company_name: lead.companyName,
						cookies: "",
						current_crm: "",
						deals_closed_in_last_year: "",
						direct_real_estate_experience: "",
						discount_code: "",
						features_interested: "",
						features_voted_on: "",
						how_did_you_find_us: "",
						huge_win: "",
						industry_niche: "",
						nda: "",
						network_size: "",
						newsletter_signup: lead.newsletterSignup ? "yes" : "no",
						pain_points: "",
						pilot_member: lead.pilot_member ? "true" : undefined,
						primary_sources_for_deals: "",
						privacy: "",
						product_description: "",
						product_features: "",
						product_license: "",
						product_options: "",
						product_pain_points: "",
						product_solutions: "",
						product_title: "",
						referring_url: lead.landingPage,
						shipping_address: "",
						social_handle: "",
						source_url: "",
						team_size: "",
						terms: lead.termsAccepted ? "yes" : "no",
						website: "",
						test_segment: lead.test_segment ?? undefined,
					},
				},
			],
		};

		// Configure API request
		const request: ClientRequest = {
			url: "/v3/marketing/contacts",
			method: "PUT",
			body: data,
		};

		// Make the API call
		console.log(
			"[SendGrid] Making API request to:",
			request.url,
			"with data:",
			JSON.stringify(data, null, 2),
		);
		const response = await client.request(request);
		console.log("[SendGrid] API response:", {
			status: response[0].statusCode,
			headers: response[0].headers,
			body: response[0].body,
		});
		return response[0].statusCode;
	} catch (error) {
		if (error?.response) {
			const errorDetails = {
				status: error.code,
				headers: error.response.headers,
				body: error.response.body,
				errors: error.response.body?.errors,
				request: {
					method: error.response.request?.method,
					path: error.response.request?.path,
					headers: error.response.request?.headers,
					body: error.response.request?.body,
				},
			};
			console.error(
				"SendGrid API Error Details:",
				JSON.stringify(errorDetails, null, 2),
			);
		}
		console.error("SendGrid Error:", error);
		return error.code || 500;
	}
}

export async function sendPasswordEmail({
	email,
	password,
	subject,
}: {
	email: string;
	password: string;
	subject: string;
}) {
	const msg: sgMail.MailDataRequired = {
		to: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email for integration tests
		from: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email as sender
		subject: subject,
		html: `
          <section>
            <h1>Welcome to Deal Scale</h1>
            
            <p>Login using the following credentials:</p>
            <div>
                <p>username: ${email}</p>
                <p>password: ${password}</p>
            </div>          
          <section>
        `,
	};

	const response = await sgMail.send(msg);

	// console.log(response[0].body)
	return response[0].statusCode;
}

async function getList(listName: string) {
	const queryParams = {
		page_size: 100,
	};
	const request: ClientRequest = {
		url: "v3/marketing/lists",
		method: "GET",
		qs: queryParams,
	};

	console.log(
		"[SendGrid] Making API request to:",
		request.url,
		"with data:",
		JSON.stringify(queryParams, null, 2),
	);
	const response = await client.request(request);
	console.log("[SendGrid] API response:", {
		status: response[0].statusCode,
		headers: response[0].headers,
		body: response[0].body,
	});

	const body = response[0].body as SendGridListsResponse;
	const availableListNames = body.result.map((l) => l.name);
	console.log("[SendGrid] Available list names:", availableListNames);
	for (const list of body.result) {
		if (list.name === listName) return list;
	}
	console.error(
		`[SendGrid] List '${listName}' not found. Available lists:`,
		availableListNames,
	);
	return undefined;
}

export async function sendPasswordReset(
	email: string,
	token: string,
	subject = "Deal Scale crud credentials",
) {
	const msg: sgMail.MailDataRequired = {
		to: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email for integration tests
		from: process.env.SENDGRID_SUPPORT_EMAIL as string, // Use support email as sender
		subject: "Deal Scale Password reset request",
		html: `
            <section>
              <h1>Welcome to Deal Scale</h1>
              
              <p>Click on the link to reset Password:</p>
              <div>
                  <p>username: ${email}</p>
                  <a href="${process.env.NEXTAUTH_URL}/auth/reset?token=${token}">Reset Password</a>
              </div>          
            <section>
          `,
	};

	const response = await sgMail.send(msg);

	// console.log(response[0].body)
	return response[0].statusCode;
}

export async function updatePaymentStatus(
	email: string,
	status: boolean,
	listName: string,
) {
	const list = await getList(listName as string);
	if (!list) return;
	const data = {
		list_ids: [list.id],

		contacts: [
			{
				email: email,
				custom_fields: {
					PaymentIsActive: status ? "True" : "False",
				},
			},
		],
	};

	const request: ClientRequest = {
		url: "v3/marketing/contacts",
		method: "PUT",
		body: data,
	};
	console.log(
		"[SendGrid] Making API request to:",
		request.url,
		"with data:",
		JSON.stringify(data, null, 2),
	);
	const response = await client.request(request);
	console.log("[SendGrid] API response:", {
		status: response[0].statusCode,
		headers: response[0].headers,
		body: response[0].body,
	});
	return response[0].statusCode;
}
