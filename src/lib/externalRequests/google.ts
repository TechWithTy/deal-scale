"use server";

export async function verifyCaptcha(token: string) {
	if (process.env.NODE_ENV === "development") return { success: true };
	const googleResponse = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`,
		{ method: "POST" },
	);
	const resp = await googleResponse.json();
	// console.log(resp);
	return resp;
}
