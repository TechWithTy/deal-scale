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
  files?: Array<{ name: string; url: string }>;
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
  onPreview,
}: LinkCardProps) {
  const isExternal = /^(https?:)?\/\//i.test(href);
  const common =
    "flex items-center gap-4 p-5 rounded-xl border bg-card text-card-foreground hover:shadow-md transition-shadow duration-200";

  // Determine if details should be expandable (heuristic: more than ~80 chars or contains a newline)
  const needsToggle = Boolean(details && (details.length > 80 || /\n/.test(details)));
  const [expanded, setExpanded] = React.useState(false);
  const [showInlineVideo, setShowInlineVideo] = React.useState(false);

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
      </div>
      {(videoUrl || (files && files.length > 0)) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {videoUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowInlineVideo((v) => !v);
              }}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-muted-foreground text-xs hover:bg-accent"
              aria-pressed={showInlineVideo}
              aria-label={showInlineVideo ? "Hide video preview" : "Show video preview"}
              title={showInlineVideo ? "Hide video" : "Preview video"}
            >
              <span aria-hidden>▶</span>
              <span>Video</span>
            </button>
          )}
          {files?.map((f) => (
            <button
              key={f.url}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(f.url, 'download', 'noopener,noreferrer');
              }}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-muted-foreground text-xs hover:bg-accent"
              aria-label={`Download ${f.name}`}
              title={f.name}
            >
              <span aria-hidden>⬇</span>
              <span className="max-w-[12rem] truncate">{f.name}</span>
            </button>
          ))}
        </div>
      )}
      {showInlineVideo && videoUrl ? (
        <div className="mt-2 w-full">
          <video className="w-full rounded" controls preload="metadata">
            <source src={videoUrl} />
            <track kind="captions" srcLang="en" label="English" default src="data:text/vtt,WEBVTT" />
          </video>
        </div>
      ) : null}
      {isExternal ? (
        <span aria-hidden className="ml-2 text-muted-foreground">
          ↗
        </span>
      ) : null}
    </a>
  );
}
