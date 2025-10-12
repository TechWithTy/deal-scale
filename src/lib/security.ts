import crypto from "node:crypto";

export function encryptOAuthToken(token: string): string {
	const algorithm = "aes-256-cbc";
	const key = getEncryptionKey();
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(token, "utf8", "hex");
	encrypted += cipher.final("hex");

	return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptOAuthToken(encryptedToken: string): string {
	const [ivHex, encrypted] = encryptedToken.split(":");
	const algorithm = "aes-256-cbc";
	const key = getEncryptionKey();
	const iv = Buffer.from(ivHex, "hex");

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encrypted, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
}

function getEncryptionKey(): Buffer {
	const key = process.env.OAUTH_ENCRYPTION_KEY;
	if (!key) {
		throw new Error("OAUTH_ENCRYPTION_KEY environment variable is not set");
	}
	return Buffer.from(key, "hex");
}
