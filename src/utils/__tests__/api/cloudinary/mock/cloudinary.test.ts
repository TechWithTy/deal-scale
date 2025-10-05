import {
	deleteFile,
	deleteImage,
	uploadFile,
	uploadImage,
} from "@/lib/externalRequests/cloudinary";
jest.mock("cloudinary", () => {
        const uploader = {
                upload: jest.fn(),
                destroy: jest.fn(),
        };
        return {
                v2: {
                        uploader,
                        config: jest.fn(),
                },
        };
});

import { v2 as cloudinary } from "cloudinary";

/**
 * Tests for Cloudinary upload and delete functions.
 * All network calls are mocked. No real files are uploaded or deleted.
 */
describe("Cloudinary integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("uploads a file", async () => {
                (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
                        public_id: "mock_id",
                });
		const res = await uploadFile("mock_file");
		expect(res).toHaveProperty("public_id", "mock_id");
	});

	it("deletes a file", async () => {
                (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
                        result: "ok",
                });
		const res = await deleteFile("mock_id");
		expect(res).toHaveProperty("result", "ok");
	});

	it("uploads an image", async () => {
                (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
                        public_id: "img_id",
                });
		const res = await uploadImage("img_file");
		expect(res).toHaveProperty("public_id", "img_id");
	});

	it("deletes an image", async () => {
                (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
                        result: "ok",
                });
		const res = await deleteImage("img_id");
		expect(res).toHaveProperty("result", "ok");
	});
});
