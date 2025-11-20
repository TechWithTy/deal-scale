import apiHandler from "@/errorHandler";
import { deleteFile, uploadFile } from "@/lib/externalRequests/cloudinary";
import { type NextRequest, NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: NextRequest) {
	const { file, fileType, requestType, fileId } = await req.json();

	try {
		if (requestType === "UPLOAD") {
			const response = await uploadFile(file, fileType);
			return NextResponse.json({
				message: "success",
				data: { url: response.secure_url },
			});
		}

		if (requestType === "DELETE") {
			const response = await deleteFile(fileId, fileType);
			// Return the actual Cloudinary destroy response for correctness
			return NextResponse.json({ message: "success", data: response });
		}
	} catch (error: unknown) {
		// Improved error handling: log and return the actual error details with type narrowing
		if (error instanceof Error) {
			console.error("Cloudinary error:", error);
			return NextResponse.json(
				{
					success: false,
					message: error.message,
					error: {
						name: error.name,
						stack: error.stack,
						...error,
					},
				},
				{ status: 500 },
			);
		}
	}
}
