export const handleCalButtonClick = (calLink: string) => {
	try {
		// Try to use Cal.com if available
		if (window.Cal) {
			window.Cal("init");
			window.Cal("ui", {
				theme: "dark",
				styles: { branding: { brandColor: "#2563EB" } },
			});
			window.Cal("inline", {
				elementOrSelector: "[data-cal-link]",
				calLink: calLink,
			});
		} else {
			// Fallback to opening in new tab
			window.open(`https://cal.com/${calLink}`, "_blank");
		}
	} catch (error) {
		console.error("Error handling Cal.com button click", error);
		window.open(`https://cal.com/${calLink}`, "_blank");
	}
};
