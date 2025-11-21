import type { HeroVideoConfig } from "../types/video";

const TRANSPARENT_PIXEL =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const VALID_THUMBNAIL_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
const VIDEO_THUMBNAIL_EXTENSIONS = [".mp4", ".webm", ".mov"];

const hasOptimizedThumbnailExtension = (src: string): boolean =>
	VALID_THUMBNAIL_EXTENSIONS.some((extension) => src.endsWith(extension));

export const resolveHeroVideoSrc = (config: HeroVideoConfig): string =>
	config.src;

export const resolveHeroThumbnailSrc = (
	config: HeroVideoConfig,
	defaultPoster?: string,
): string => config.poster ?? defaultPoster ?? TRANSPARENT_PIXEL;

export const isVectorOrAnimatedThumbnail = (src: string): boolean =>
	src.endsWith(".svg") || src.endsWith(".gif");

export const shouldBypassImageOptimization = (src: string): boolean =>
	isVectorOrAnimatedThumbnail(src) ||
	!hasOptimizedThumbnailExtension(src) ||
	VIDEO_THUMBNAIL_EXTENSIONS.some((extension) => src.endsWith(extension));

export const isVideoThumbnail = (src: string): boolean =>
	VIDEO_THUMBNAIL_EXTENSIONS.some((extension) => src.endsWith(extension));
