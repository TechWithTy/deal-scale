export const onRequest: PagesFunction[] = [
	async (context) => {
		const request = context.request;
		const url = new URL(request.url);

		if (url.hostname.startsWith("www.")) {
			const redirectUrl = `https://${url.hostname.replace("www.", "")}${url.pathname}${url.search}`;
			return Response.redirect(redirectUrl, 301);
		}

		if (url.searchParams.toString()) {
			context.cookies.set("utm", url.searchParams.toString(), {
				path: "/",
				maxAge: 60 * 60 * 24 * 30,
			});
		}

		const cache = context.caches.default;
		const cacheKey = new Request(url.toString(), request);
		const cachedResponse = await cache.match(cacheKey);

		if (cachedResponse) {
			return cachedResponse;
		}

		const response = await context.next();
		cache.put(cacheKey, response.clone());
		return response;
	},
];



