export const generateSlug = (title: string): string => {
	return encodeURIComponent(title.trim().toLowerCase().replace(/\s+/g, "-"));
};
