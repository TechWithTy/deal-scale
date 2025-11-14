/**
 * Format date string to a human-readable format
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date (e.g., "April 15, 2025")
 */
export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

/**
 * Check if a date is in the future
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns boolean
 */
export const isFutureDate = (dateString: string): boolean => {
	const eventDate = new Date(dateString);
	const today = new Date();
	return eventDate > today;
};
