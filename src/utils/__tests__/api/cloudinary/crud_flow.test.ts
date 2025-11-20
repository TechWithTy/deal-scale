import { act } from "@testing-library/react";

// Helper for absolute URLs
import {
	describeIfExternal,
	skipExternalTest,
} from "../../../testHelpers/external";
defineTestEnv();
function defineTestEnv() {
	process.env.API_BASE_URL = "http://localhost:3000";
}
const apiUrl = (path: string) => `${process.env.API_BASE_URL}${path}`;

skipExternalTest("Cloudinary CRUD flow (integration)");
describeIfExternal("Cloudinary CRUD flow (integration)", () => {
	// Use a real public PNG image URL for testing
	const testFile =
		"https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";
	const fileType = "image";
	const uploadedUrl: string | null = null;
	const publicId: string | null = null;

	it("uploads and deletes a file via the real API", async () => {
		// --- UPLOAD ---
		let uploadRes: { data: { url: string } };
		await act(async () => {
			const res = await fetch(apiUrl("/api/cloudinary"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					file: testFile,
					fileType,
					requestType: "UPLOAD",
				}),
			});
			uploadRes = (await res.json()) as { data: { url: string } };
			console.log("DEBUG: upload response:", uploadRes);
		});
		expect(uploadRes).toHaveProperty("data.url");
		const uploadedUrl: string = uploadRes.data.url;
		expect(typeof uploadedUrl).toBe("string");
		// Extract publicId from the URL for deletion
		const publicId: string | null =
			uploadedUrl.split("/").pop()?.split(".")[0] || null;
		expect(publicId).toBeTruthy();

		// --- DELETE ---
		let deleteRes: { data: { result: string } };
		await act(async () => {
			const res = await fetch(apiUrl("/api/cloudinary"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fileId: publicId,
					fileType,
					requestType: "DELETE",
				}),
			});
			deleteRes = (await res.json()) as { data: { result: string } };
			console.log("DEBUG: delete response:", deleteRes);
		});
		expect(deleteRes).toHaveProperty("data.result");
		expect(deleteRes.data.result).toBe("ok");
	});
});
