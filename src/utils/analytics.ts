export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export const pageview = (url: string) => {
	if (GTM_ID) {
		window.gtag("config", GTM_ID, {
			page_path: url,
		});
	}
};
