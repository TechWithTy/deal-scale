import type {
  NotionCheckboxProperty,
  NotionFilesExternal,
  NotionFilesFile,
  NotionFilesProperty,
  NotionPage,
  NotionRichTextProperty,
  NotionSelectProperty,
  NotionTitleProperty,
  NotionUrlProperty,
} from "./notionTypes";
import { inferKind } from "./notionTypes";

export type MappedLinkTree = {
  pageId?: string;
  slug?: string;
  destination?: string;
  title?: string;
  description?: string;
  details?: string;
  iconEmoji?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  pinned?: boolean;
  videoUrl?: string;
  files?: Array<{
    name: string;
    url: string;
    kind?: "image" | "video" | "other";
    ext?: string;
    expiry?: string;
  }>;
  linkTreeEnabled?: boolean;
  highlighted?: boolean;
};

export function mapNotionPageToLinkTree(page: NotionPage): MappedLinkTree {
  const props = page.properties ?? {};
  const rawSlug = (props.Slug as NotionRichTextProperty | undefined)?.rich_text?.[0]?.plain_text;
  const slug = rawSlug?.startsWith('/') ? rawSlug.substring(1) : rawSlug;
  let destination = (props.Destination as NotionRichTextProperty | undefined)
    ?.rich_text?.[0]?.plain_text;
  const titleRich = (props.Title as NotionRichTextProperty | undefined)
    ?.rich_text?.[0]?.plain_text as string | undefined;
  const titleFromTitle =
    titleRich ??
    ((props.Title as NotionTitleProperty | undefined)?.title?.[0]?.plain_text as
      | string
      | undefined);
  const title = titleFromTitle || slug;
  const description = (props.Description as NotionRichTextProperty | undefined)
    ?.rich_text?.[0]?.plain_text as string | undefined;
  const details = (props.Details as NotionRichTextProperty | undefined)
    ?.rich_text?.[0]?.plain_text as string | undefined;
  const iconEmoji = page.icon?.emoji as string | undefined;

  // Thumbnail (for icon only) and Image (for preview)
  let thumbnailUrl: string | undefined;
  const thumbProp = props.Thumbnail as
    | NotionUrlProperty
    | NotionRichTextProperty
    | NotionFilesProperty
    | undefined;
  if (thumbProp?.type === "url") thumbnailUrl = thumbProp.url ?? undefined;
  if (!thumbnailUrl && thumbProp?.type === "rich_text")
    thumbnailUrl = thumbProp.rich_text?.[0]?.plain_text ?? undefined;
  if (!thumbnailUrl && thumbProp?.type === "files" && Array.isArray(thumbProp.files)) {
    const tf = thumbProp.files[0] as NotionFilesFile | NotionFilesExternal | undefined;
    thumbnailUrl = (tf && (tf as NotionFilesFile).file?.url) || (tf && (tf as NotionFilesExternal).external?.url) || undefined;
  }

  // Image for preview – do NOT consider Thumbnail here
  let imageUrl: string | undefined;
  const imgProp = props.Image as
    | NotionUrlProperty
    | NotionRichTextProperty
    | NotionFilesProperty
    | undefined;
  if (imgProp?.type === "url") imageUrl = imgProp.url ?? undefined;
  if (!imageUrl && imgProp?.type === "rich_text")
    imageUrl = imgProp.rich_text?.[0]?.plain_text ?? undefined;
  if (!imageUrl && imgProp?.type === "files" && Array.isArray(imgProp.files)) {
    const first = imgProp.files[0] as NotionFilesFile | NotionFilesExternal | undefined;
    imageUrl = (first && (first as NotionFilesFile).file?.url) || (first && (first as NotionFilesExternal).external?.url) || undefined;
  }
  if (!imageUrl && page.cover?.external?.url)
    imageUrl = page.cover.external.url ?? undefined;

  // Link Tree Enabled can be checkbox or select
  const lte = props["Link Tree Enabled"] as
    | NotionCheckboxProperty
    | NotionSelectProperty
    | undefined;
  let linkTreeEnabled = false;
  if (lte?.type === "checkbox") linkTreeEnabled = Boolean(lte.checkbox);
  else if (lte?.type === "select") {
    const name = (lte.select?.name ?? "").toString().toLowerCase();
    linkTreeEnabled = name === "true" || name === "yes" || name === "enabled";
  }

  // Optional metadata
  const category =
    (props.Category as NotionSelectProperty | undefined)?.select?.name ??
    undefined;
  const pinned = Boolean(
    (props.Pinned as NotionCheckboxProperty | undefined)?.checkbox ||
      ((props.Pinned as NotionSelectProperty | undefined)?.select?.name ?? "")
        .toString()
        .toLowerCase() === "true",
  );
  // Highlighted (Select Yes/No or Checkbox)
  let highlighted = false;
  const hlSel = props.Highlighted as NotionSelectProperty | undefined;
  if (hlSel?.type === "select") {
    const name = (hlSel.select?.name ?? "").toString().toLowerCase();
    highlighted = name === "yes" || name === "true" || name === "enabled";
  }
  const hlCb = props.Highlighted as NotionCheckboxProperty | undefined;
  if (hlCb?.type === "checkbox") highlighted = highlighted || Boolean(hlCb.checkbox);
  let videoUrl =
    (props.Video as NotionUrlProperty | undefined)?.url ?? undefined;

  // Redirect behavior: Select field 'Redirect To Download First File'
  let redirectToFirstFile = false;
  const rtd = props["Redirect To Download First File"] as
    | NotionSelectProperty
    | undefined;
  if (rtd?.type === "select") {
    const name = (rtd.select?.name ?? "").toString().toLowerCase();
    redirectToFirstFile = name === "true" || name === "yes" || name === "enabled";
  }

  // Files list (support Media/Files/Image/File/video as Files & media)
  let files:
    | Array<{
        name: string;
        url: string;
        kind?: "image" | "video" | "other";
        ext?: string;
        expiry?: string;
      }>
    | undefined;
  const filesProp =
    (props.Media as NotionFilesProperty | undefined) ??
    (props.Files as NotionFilesProperty | undefined) ??
    (props.Image as NotionFilesProperty | undefined) ??
    (props.File as NotionFilesProperty | undefined) ??
    (props.file as NotionFilesProperty | undefined);
  const videoFilesProp = props.video as NotionFilesProperty | undefined;
  type FileOut = {
    name: string;
    url: string;
    kind?: "image" | "video" | "other";
    ext?: string;
    expiry?: string;
  };
  const collected: FileOut[] = [];

  const mapNotionFile = (f: NotionFilesFile | NotionFilesExternal) => {
    if ((f as NotionFilesFile).type === "file") {
      const file = f as NotionFilesFile;
      const url = file.file?.url ?? "";
      const meta = inferKind(file.name || url);
      return {
        name: file.name ?? url,
        url,
        kind: meta.kind,
        ext: meta.ext,
        expiry: file.file?.expiry_time,
      };
    }
    if ((f as NotionFilesExternal).type === "external") {
      const extf = f as NotionFilesExternal;
      const url = extf.external?.url ?? "";
      const meta = inferKind(extf.name || url);
      return { name: extf.name ?? url, url, kind: meta.kind, ext: meta.ext };
    }
    return undefined;
  };

  const collectFrom = (prop?: NotionFilesProperty) => {
    if (prop?.type === "files" && Array.isArray(prop.files)) {
      for (const f of prop.files) {
        const mapped = mapNotionFile(f as NotionFilesFile | NotionFilesExternal);
        if (mapped) collected.push(mapped);
      }
    }
  };

  collectFrom(filesProp);
  collectFrom(videoFilesProp);

  // Fallback: scan any property of type 'files' (covers columns named 'File', 'Attachment', etc.)
  for (const val of Object.values(props)) {
    const maybe = val as NotionFilesProperty | undefined;
    if (maybe?.type === "files") collectFrom(maybe);
  }

  if (collected.length) {
    // Dedupe by URL
    const seen = new Set<string>();
    files = collected.filter((f) => {
      if (!f?.url) return false;
      const k = f.url;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  // If redirectToFirstFile is enabled, prefer the dedicated File/Files columns first for override.
  if (redirectToFirstFile) {
    const fileCol = (props.File as NotionFilesProperty | undefined);
    const filesCol = (props.Files as NotionFilesProperty | undefined);
    let firstFileUrl: string | undefined;
    const pickFirstFrom = (prop?: NotionFilesProperty) => {
      if (firstFileUrl) return;
      if (prop?.type === "files" && Array.isArray(prop.files)) {
        const f = prop.files[0] as NotionFilesFile | NotionFilesExternal | undefined;
        if (f && (f as NotionFilesFile).type === "file") firstFileUrl = (f as NotionFilesFile).file?.url ?? firstFileUrl;
        else if (f && (f as NotionFilesExternal).type === "external") firstFileUrl = (f as NotionFilesExternal).external?.url ?? firstFileUrl;
      }
    };
    // Priority: File -> Files -> any collected file fallback
    pickFirstFrom(fileCol);
    pickFirstFrom(filesCol);
    if (!firstFileUrl && files && files.length) firstFileUrl = files[0]?.url;
    if (firstFileUrl) destination = firstFileUrl;
  }

  if (!imageUrl && files && files.length) {
    const firstImage =
      files.find((f) => f.kind === "image") ||
      files.find((f) =>
        (f.ext ?? "").match(/^(jpg|jpeg|png|gif|webp|avif|svg)$/i),
      );
    if (firstImage) imageUrl = firstImage.url;
  }
  if (!videoUrl && files && files.length) {
    // Prefer inline-playable formats first
    const playable = files.find((f) => (f.ext ?? "").match(/^(mp4|webm|ogg|ogv|mov|m4v)$/i));
    if (playable) {
      videoUrl = playable.url;
    } else {
      // Fallback: pick any video, then try Cloudinary fetch transcode if configured
      const anyVideo = files.find((f) => f.kind === "video");
      if (anyVideo?.url) {
        const cloud = process.env.CLOUDINARY_CLOUD_NAME;
        if (cloud) {
          // Build a Cloudinary fetch URL to transcode to MP4 (requires remote fetch enabled)
          const src = anyVideo.url;
          const base = `https://res.cloudinary.com/${cloud}/video/upload/f_mp4,vc_h264,q_auto:good/`;
          const transformed = base + encodeURIComponent(src);
          videoUrl = transformed;
        } else {
          // No Cloudinary; keep the original so file chips still work
          videoUrl = anyVideo.url;
        }
      }
    }
  }

  return {
    pageId: page.id,
    slug,
    destination,
    title,
    description,
    details,
    iconEmoji,
    imageUrl,
    thumbnailUrl,
    category,
    pinned,
    videoUrl,
    files,
    linkTreeEnabled,
    highlighted,
  };
}
