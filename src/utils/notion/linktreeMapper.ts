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
  slug?: string;
  destination?: string;
  title?: string;
  description?: string;
  details?: string;
  iconEmoji?: string;
  imageUrl?: string;
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
};

export function mapNotionPageToLinkTree(page: NotionPage): MappedLinkTree {
  const props = page.properties ?? {};
  const slug = (props.Slug as NotionTitleProperty | undefined)?.title?.[0]
    ?.plain_text;
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

  // Image from Thumbnail/Image URL/Rich text/Files or page cover
  // Prefer Thumbnail over Image when both exist
  const imageProp =
    (props.Thumbnail as
      | NotionUrlProperty
      | NotionRichTextProperty
      | NotionFilesProperty
      | undefined) ??
    (props.Image as
      | NotionUrlProperty
      | NotionRichTextProperty
      | NotionFilesProperty
      | undefined);
  let imageUrl: string | undefined;
  if (imageProp?.type === "url") imageUrl = imageProp.url ?? undefined;
  if (!imageUrl && imageProp?.type === "rich_text")
    imageUrl = imageProp.rich_text?.[0]?.plain_text ?? undefined;
  if (
    !imageUrl &&
    imageProp?.type === "files" &&
    Array.isArray(imageProp.files)
  ) {
    const first = imageProp.files.find(
      (f) =>
        (f as NotionFilesFile).file?.url ||
        (f as NotionFilesExternal).external?.url,
    );
    const fFile = first as NotionFilesFile | NotionFilesExternal | undefined;
    imageUrl =
      (fFile && "file" in fFile
        ? fFile.file?.url
        : fFile && "external" in fFile
          ? fFile.external?.url
          : undefined) ?? undefined;
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
    if (maybe && (maybe as any).type === "files") collectFrom(maybe);
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
    const firstVideo =
      files.find((f) => f.kind === "video") ||
      files.find((f) => (f.ext ?? "").match(/^(mp4|webm|ogg|mov|m4v)$/i));
    if (firstVideo) videoUrl = firstVideo.url;
  }

  return {
    slug,
    destination,
    title,
    description,
    details,
    iconEmoji,
    imageUrl,
    category,
    pinned,
    videoUrl,
    files,
    linkTreeEnabled,
  };
}
