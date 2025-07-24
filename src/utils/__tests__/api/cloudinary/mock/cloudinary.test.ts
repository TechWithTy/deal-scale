import {
	deleteFile,
	deleteImage,
	uploadFile,
	uploadImage,
} from "@/lib/externalRequests/cloudinary";
import cloudinary from "cloudinary";

jest.mock("cloudinary", () => ({
	v2: {
		uploader: {
			upload: jest.fn(),
			destroy: jest.fn(),
		},
		config: jest.fn(),
	},
}));

/**
 * Tests for Cloudinary upload and delete functions.
 * All network calls are mocked. No real files are uploaded or deleted.
 */
describe("Cloudinary integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("uploads a file", async () => {
		(cloudinary.v2.uploader.upload as jest.Mock).mockResolvedValue({
			public_id: "mock_id",
		});
		const res = await uploadFile("mock_file");
		expect(res).toHaveProperty("public_id", "mock_id");
	});

	it("deletes a file", async () => {
		(cloudinary.v2.uploader.destroy as jest.Mock).mockResolvedValue({
			result: "ok",
		});
		const res = await deleteFile("mock_id");
		expect(res).toHaveProperty("result", "ok");
	});

	it("uploads an image", async () => {
		(cloudinary.v2.uploader.upload as jest.Mock).mockResolvedValue({
			public_id: "img_id",
		});
		const res = await uploadImage("img_file");
		expect(res).toHaveProperty("public_id", "img_id");
	});

	it("deletes an image", async () => {
		(cloudinary.v2.uploader.destroy as jest.Mock).mockResolvedValue({
			result: "ok",
		});
		const res = await deleteImage("img_id");
		expect(res).toHaveProperty("result", "ok");
	});
});
