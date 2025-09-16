"use client";
import * as React from "react";

export type LinkCardProps = {
  title: string;
  href: string;
  description?: string;
  iconEmoji?: string;
  imageUrl?: string;
  videoUrl?: string;
  details?: string;
  files?: Array<{ name: string; url: string; kind?: "image" | "video" | "other"; ext?: string }>;
  pageId?: string;
  slug?: string;
  externalOverride?: boolean;
  onPreview?: (media: {
    type: "image" | "video";
    url: string;
    title: string;
  }) => void;
};

export function LinkCard({
  title,
  href,
  description,
  iconEmoji,
  imageUrl,
  videoUrl,
  details,
  files,
  pageId,
  slug,
  externalOverride,
  onPreview,
}: LinkCardProps) {
  const computedExternal = /^(https?:)?\/\//i.test(href);
  const isExternal = externalOverride ?? computedExternal;
  const common =
    "flex items-center gap-4 p-5 rounded-xl border bg-card text-card-foreground hover:shadow-md transition-shadow duration-200";

  // Determine if details should be expandable (heuristic: more than ~80 chars or contains a newline)
  const needsToggle = Boolean(details && (details.length > 80 || /\n/.test(details)));
  const [expanded, setExpanded] = React.useState(false);
  const [showInlineVideo, setShowInlineVideo] = React.useState(false);
  const [showInlineImage, setShowInlineImage] = React.useState(false);

  // Determine best preview sources from files
  const firstVideoFromFiles = React.useMemo(() => {
    const vids = files?.filter((f) => f.kind === "video" || /\.(mp4|webm|ogg|mov|m4v)(?:$|\?|#)/i.test(f.url));
    return vids && vids.length ? vids[0] : undefined;
  }, [files]);

  const firstImageFromFiles = React.useMemo(() => {
    const imgs = files?.filter((f) => f.kind === "image" || /\.(jpg|jpeg|png|gif|webp|avif|svg)(?:$|\?|#)/i.test(f.url));
    return imgs && imgs.length ? imgs[0] : undefined;
  }, [files]);

  // Determine if the browser can play a given video URL by simple MIME guess
  const canPlayVideo = React.useCallback((url?: string) => {
    if (!url) return false;
    try {
      const v = document.createElement('video');
      const extMatch = /\.([a-z0-9]+)(?:$|\?|#)/i.exec(url);
      const ext = (extMatch?.[1] || '').toLowerCase();
      const mime = ext === 'mp4' ? 'video/mp4'
        : ext === 'webm' ? 'video/webm'
        : ext === 'ogg' ? 'video/ogg'
        : ext === 'mov' ? 'video/quicktime'
        : ext === 'm4v' ? 'video/x-m4v'
        : '';
      if (!mime) return false;
      return v.canPlayType(mime) !== '';
    } catch {
      return false;
    }
  }, []);

  // Default behavior: show playable video if present; otherwise show image if present
  React.useEffect(() => {
    const videoSrc = firstVideoFromFiles?.url || videoUrl;
    const playable = typeof window !== 'undefined' ? canPlayVideo(videoSrc) : false;
    if (playable) {
      setShowInlineVideo(true);
      setShowInlineImage(false);
    } else if (firstImageFromFiles?.url || imageUrl) {
      setShowInlineVideo(false);
      setShowInlineImage(true);
    } else {
      setShowInlineVideo(false);
      setShowInlineImage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstVideoFromFiles?.url, videoUrl, firstImageFromFiles?.url, imageUrl]);

  // Use title as provided (expecting Notion Title after sync)

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={common}
    >
      <div className="shrink-0">
        {imageUrl ? (
          // Decorative image/icon
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-8 w-8 rounded-md object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="text-2xl" aria-hidden>
            {iconEmoji ?? "🚀"}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {(firstVideoFromFiles?.url || videoUrl || firstImageFromFiles?.url || imageUrl) && (
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {(firstVideoFromFiles?.url || videoUrl) && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInlineVideo((v) => !v);
                }}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-muted-foreground text-[11px] leading-5 hover:bg-accent"
                aria-pressed={showInlineVideo}
                aria-label={showInlineVideo ? "Hide video preview" : "Show video preview"}
                title={showInlineVideo ? "Hide video" : "Preview video"}
              >
                <span aria-hidden>▶</span>
                <span>Video</span>
              </button>
            )}
            {(firstImageFromFiles?.url || imageUrl) && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInlineImage((v) => !v);
                }}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-muted-foreground text-[11px] leading-5 hover:bg-accent"
                aria-pressed={showInlineImage}
                aria-label={showInlineImage ? "Hide image preview" : "Show image preview"}
                title={showInlineImage ? "Hide image" : "Preview image"}
              >
                <span aria-hidden>🖼️</span>
                <span>Image</span>
              </button>
            )}
            {files?.map((f) => (
              <button
                key={f.url}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const to = encodeURIComponent(f.url);
                  const pid = pageId ? `&pageId=${encodeURIComponent(pageId)}` : "";
                  const s = slug ? `&slug=${encodeURIComponent(slug)}` : "";
                  const url = `/api/redirect?isFile=1&to=${to}${pid}${s}`;
                  window.open(url, '_self');
                }}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-muted-foreground text-[11px] leading-5 hover:bg-accent max-w-[8rem]"
                aria-label={`Download ${f.name}`}
                title={f.name}
              >
                <span aria-hidden>⬇</span>
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="truncate font-medium">{title}</div>
        {/* Description row acts as a toggle when details are long */}
        {needsToggle ? (
          <button
            type="button"
            className="truncate text-muted-foreground text-sm underline-offset-2 hover:underline"
            aria-expanded={expanded}
            onClick={(e) => {
              // Prevent navigating the parent anchor
              e.preventDefault();
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? "Hide details" : (description ?? "Show details")}
          </button>
        ) : description ? (
          <div className="truncate text-muted-foreground text-sm">{description}</div>
        ) : null}
        {details && expanded ? (
          <div className="mt-1 whitespace-pre-wrap text-muted-foreground text-xs">{details}</div>
        ) : null}
        {(showInlineVideo || showInlineImage) ? (
          <div className="mt-2 w-full">
            {showInlineVideo && (
              firstVideoFromFiles ? (
                <video className="w-full rounded" controls preload="metadata">
                  <source src={firstVideoFromFiles.url} />
                  <track kind="captions" srcLang="en" label="English" default src="data:text/vtt,WEBVTT" />
                </video>
              ) : videoUrl ? (
                <video className="w-full rounded" controls preload="metadata">
                  <source src={videoUrl} />
                  <track kind="captions" srcLang="en" label="English" default src="data:text/vtt,WEBVTT" />
                </video>
              ) : null
            )}
            {showInlineImage && (
              firstImageFromFiles ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={firstImageFromFiles.url} alt="" className="w-full rounded" />
              ) : imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="w-full rounded" />
              ) : null
            )}
          </div>
        ) : null}
      </div>
      
      {isExternal ? (
        <span aria-hidden className="ml-2 text-muted-foreground">
          ↗
        </span>
      ) : null}
    </a>
  );
}
