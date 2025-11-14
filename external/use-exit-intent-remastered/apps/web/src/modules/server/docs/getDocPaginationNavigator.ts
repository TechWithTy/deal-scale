import { getDocLinks } from "./getDocLinks";

import type { Link, PaginatedLink, Pagination } from "shared/types";

const EMPTY_LINK: Link = {
	title: "",
	url: "",
	order: 0,
};

function unslugifySectionPathNames(sectionPathNames: string[]) {
	return sectionPathNames.map((pathName) => pathName.replace("-", " "));
}

function buildPaginatedLink(doc: Link | null): PaginatedLink {
	const baseLink = doc ?? EMPTY_LINK;
	const sectionsRaw =
		baseLink.url.length > 0 ? baseLink.url.split("/").slice(0, -1) : [];

	return {
		...baseLink,
		sections: {
			raw: sectionsRaw,
			sanitized: unslugifySectionPathNames(sectionsRaw),
		},
	};
}

export async function getDocPaginationNavigator(
	currentDoc: string,
): Promise<Pagination> {
	const docLinks = await getDocLinks();
	const links = Object.values(docLinks).flat();

	const index = links.findIndex((path) => path.url === currentDoc);

	const previousDoc = index > 0 ? links[index - 1] : null;
	const nextDoc =
		index >= 0 && index < links.length - 1 ? links[index + 1] : null;

	return {
		next: buildPaginatedLink(nextDoc),
		previous: buildPaginatedLink(previousDoc),
		hasNext: nextDoc !== null,
		hasPrevious: previousDoc !== null,
	};
}
