import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const uploadMock = vi.fn();
const destroyMock = vi.fn();
const configMock = vi.fn();

vi.mock("cloudinary", () => ({
	v2: {
		uploader: {
			upload: uploadMock,
			destroy: destroyMock,
		},
		config: configMock,
	},
}));

let uploadFile: typeof import("@/lib/externalRequests/cloudinary").uploadFile;
let deleteFile: typeof import("@/lib/externalRequests/cloudinary").deleteFile;
let uploadImage: typeof import("@/lib/externalRequests/cloudinary").uploadImage;
let deleteImage: typeof import("@/lib/externalRequests/cloudinary").deleteImage;

beforeAll(async () => {
	({ uploadFile, deleteFile, uploadImage, deleteImage } = await import(
		"@/lib/externalRequests/cloudinary",
	));
});

describe("Cloudinary integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("uploads a file", async () => {
		uploadMock.mockResolvedValue({
			public_id: "mock_id",
		});
		const res = await uploadFile("mock_file");
		expect(res).toHaveProperty("public_id", "mock_id");
		expect(uploadMock).toHaveBeenCalledWith("mock_file", {
			resource_type: "raw",
		});
	});

	it("deletes a file", async () => {
		destroyMock.mockResolvedValue({
			result: "ok",
		});
		const res = await deleteFile("mock_id");
		expect(res).toHaveProperty("result", "ok");
		expect(destroyMock).toHaveBeenCalledWith("mock_id", {
			resource_type: "raw",
		});
	});

	it("uploads an image", async () => {
		uploadMock.mockResolvedValue({
			public_id: "img_id",
		});
		const res = await uploadImage("img_file");
		expect(res).toHaveProperty("public_id", "img_id");
		expect(uploadMock).toHaveBeenCalledWith("img_file", {
			resource_type: "image",
		});
	});

	it("deletes an image", async () => {
		destroyMock.mockResolvedValue({
			result: "ok",
		});
		const res = await deleteImage("img_id");
		expect(res).toHaveProperty("result", "ok");
		expect(destroyMock).toHaveBeenCalledWith("img_id", {
			resource_type: "image",
		});
	});
});
