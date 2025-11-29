import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ContactData {
	email?: string;
	name?: string;
	phone?: string;
	address?: string;
	[key: string]: string | undefined;
}

export interface ParseResult {
	contacts: ContactData[];
	errors: string[];
}

/**
 * Parse CSV file and extract contact data
 */
export async function parseCSV(file: File): Promise<ParseResult> {
	return new Promise((resolve) => {
		const contacts: ContactData[] = [];
		const errors: string[] = [];

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				if (results.errors.length > 0) {
					errors.push(
						...results.errors.map((err) => err.message || "Parse error"),
					);
				}

				for (const row of results.data) {
					const contact = normalizeContactData(row as Record<string, string>);
					// Accept any row that has at least one field with data
					const hasData = Object.values(contact).some(
						(value) => value && value.toString().trim().length > 0,
					);
					if (hasData) {
						contacts.push(contact);
					} else {
						errors.push(`Row with no data: ${JSON.stringify(row)}`);
					}
				}

				resolve({ contacts, errors });
			},
			error: (error) => {
				errors.push(error.message || "Failed to parse CSV file");
				resolve({ contacts, errors });
			},
		});
	});
}

/**
 * Parse Excel file (.xlsx or .xls) and extract contact data
 */
export async function parseExcel(file: File): Promise<ParseResult> {
	return new Promise((resolve) => {
		const contacts: ContactData[] = [];
		const errors: string[] = [];

		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });

				// Get the first sheet
				const firstSheetName = workbook.SheetNames[0];
				if (!firstSheetName) {
					errors.push("Excel file has no sheets");
					resolve({ contacts, errors });
					return;
				}

				const worksheet = workbook.Sheets[firstSheetName];
				const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
					string,
					string
				>[];

				for (const row of jsonData) {
					const contact = normalizeContactData(row);
					// Accept any row that has at least one field with data
					const hasData = Object.values(contact).some(
						(value) => value && value.toString().trim().length > 0,
					);
					if (hasData) {
						contacts.push(contact);
					} else {
						errors.push(`Row with no data: ${JSON.stringify(row)}`);
					}
				}

				resolve({ contacts, errors });
			} catch (error) {
				errors.push(
					error instanceof Error ? error.message : "Failed to parse Excel file",
				);
				resolve({ contacts, errors });
			}
		};

		reader.onerror = () => {
			errors.push("Failed to read Excel file");
			resolve({ contacts, errors });
		};

		reader.readAsArrayBuffer(file);
	});
}

/**
 * Parse file based on its type (CSV or Excel)
 */
export async function parseContactFile(file: File): Promise<ParseResult> {
	const fileName = file.name.toLowerCase();
	const fileExtension = fileName.split(".").pop();

	if (fileExtension === "csv") {
		return parseCSV(file);
	}

	if (fileExtension === "xlsx" || fileExtension === "xls") {
		return parseExcel(file);
	}

	return {
		contacts: [],
		errors: [
			`Unsupported file type: ${fileExtension}. Please use CSV or Excel files.`,
		],
	};
}

/**
 * Normalize contact data from various column name formats
 */
function normalizeContactData(row: Record<string, string>): ContactData {
	const normalized: ContactData = {};

	// Normalize email
	const emailKeys = ["email", "e-mail", "email address", "e_mail", "mail"];
	for (const key of emailKeys) {
		const value = findCaseInsensitiveKey(row, key);
		if (value && isValidEmail(value)) {
			normalized.email = value.trim().toLowerCase();
			break;
		}
	}

	// Normalize name
	const nameKeys = [
		"name",
		"full name",
		"fullname",
		"contact name",
		"first name",
		"last name",
	];
	for (const key of nameKeys) {
		const value = findCaseInsensitiveKey(row, key);
		if (value) {
			normalized.name = value.trim();
			break;
		}
	}

	// Normalize phone
	const phoneKeys = [
		"phone",
		"telephone",
		"phone number",
		"mobile",
		"cell",
		"contact",
	];
	for (const key of phoneKeys) {
		const value = findCaseInsensitiveKey(row, key);
		if (value) {
			normalized.phone = normalizePhoneNumber(value);
			break;
		}
	}

	// Normalize address
	const addressKeys = ["address", "street", "street address"];
	for (const key of addressKeys) {
		const value = findCaseInsensitiveKey(row, key);
		if (value) {
			normalized.address = value.trim();
			break;
		}
	}

	// Include all other fields
	for (const [key, value] of Object.entries(row)) {
		if (
			!emailKeys.includes(key.toLowerCase()) &&
			!nameKeys.includes(key.toLowerCase()) &&
			!phoneKeys.includes(key.toLowerCase()) &&
			!addressKeys.includes(key.toLowerCase())
		) {
			normalized[key] = value?.toString().trim();
		}
	}

	return normalized;
}

/**
 * Find key in object case-insensitively
 */
function findCaseInsensitiveKey(
	obj: Record<string, string>,
	targetKey: string,
): string | undefined {
	const lowerTarget = targetKey.toLowerCase();
	for (const [key, value] of Object.entries(obj)) {
		if (key.toLowerCase() === lowerTarget) {
			return value;
		}
	}
	return undefined;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Normalize phone number (remove non-digit characters except +)
 */
function normalizePhoneNumber(phone: string): string {
	return phone.replace(/[^\d+]/g, "");
}
