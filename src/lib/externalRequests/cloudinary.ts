import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

export async function uploadFile(
	file: string,
	type: "image" | "video" | "raw" | "auto" = "raw",
) {
	// Add prefix if file is a base64 string and not already prefixed
	let uploadInput = file;
	if (
		typeof file === "string" &&
		/^[A-Za-z0-9+/=]+$/.test(file) &&
		file.length > 100
	) {
		uploadInput = `data:image/png;base64,${file}`;
	}
	const response = await cloudinary.uploader.upload(uploadInput, {
		resource_type: type,
	});
	return response;
}

// include file extension when raw file
export async function deleteFile(
	file_id: string,
	type: "image" | "video" | "raw" | "auto" = "raw",
) {
	const response = await cloudinary.uploader.destroy(file_id, {
		resource_type: type,
	});
	return response;
}

export async function uploadImage(file: string) {
	const response = await cloudinary.uploader.upload(file, {
		resource_type: "image",
	});
	return response;
}

export async function deleteImage(file_id: string) {
	const response = await cloudinary.uploader.destroy(file_id, {
		resource_type: "image",
	});
	return response;
}
