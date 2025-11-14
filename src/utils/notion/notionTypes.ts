// Original content from scripts/utils/notion.ts

export type NotionFilesExternal = {
	type: "external";
	name: string;
	external: {
		url: string;
	};
};

export type NotionFilesFile = {
	type: "file";
	name: string;
	file: {
		url: string;
		expiry_time: string;
	};
};

export type NotionFilesProperty = {
	type: "files";
	files: Array<NotionFilesExternal | NotionFilesFile>;
};

export type NotionRichTextProperty = {
	type: "rich_text";
	rich_text: Array<{
		type: "text";
		text: {
			content: string;
			link: {
				url: string;
			} | null;
		};
		plain_text: string;
		href: string | null;
	}>;
};

export type NotionTitleProperty = {
	type: "title";
	title: Array<{
		type: "text";
		text: {
			content: string;
			link: {
				url: string;
			} | null;
		};
		plain_text: string;
		href: string | null;
	}>;
};

export type NotionUrlProperty = {
	type: "url";
	url: string | null;
};

export type NotionSelectProperty = {
	type: "select";
	select: {
		id: string;
		name: string;
		color: string;
	} | null;
};

export type NotionCheckboxProperty = {
	type: "checkbox";
	checkbox: boolean;
};

export type NotionPage = {
	id: string;
	properties: Record<string, unknown>;
	icon: {
		emoji: string;
	} | null;
	cover: {
		external: {
			url: string;
		};
	} | null;
};

export type NotionQueryResponse = {
	results: NotionPage[];
};

export function inferKind(name: string): {
	kind: "image" | "video" | "other";
	ext: string;
} {
	const ext = (name.split(".").pop() || "").toLowerCase();
	if (["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(ext)) {
		return { kind: "image", ext };
	}
	if (["mp4", "webm", "ogg", "mov", "m4v", "mkv"].includes(ext)) {
		return { kind: "video", ext };
	}
	return { kind: "other", ext };
}
