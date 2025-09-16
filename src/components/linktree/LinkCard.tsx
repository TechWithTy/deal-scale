"use client";
import * as React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { LinkCardHeader } from "./card/LinkCardHeader";
import { LinkCardBody } from "./card/LinkCardBody";
import { MediaPreview } from "./card/MediaPreview";
import { FileChips } from "./card/FileChips";

export type LinkCardProps = {
	title: string;
	href: string;
	description?: string;
	iconEmoji?: string;
	imageUrl?: string;
	thumbnailUrl?: string;
	videoUrl?: string;
	details?: string;
	files?: Array<{
		name: string;
		url: string;
		kind?: "image" | "video" | "other";
		ext?: string;
	}>;
	pageId?: string;
	slug?: string;
	highlighted?: boolean;
	showArrow?: boolean;
	openInNewTab?: boolean;
};

export function LinkCard({
  title,
  href,
  description,
  iconEmoji,
  imageUrl,
  thumbnailUrl,
  videoUrl,
  details,
  files,
  pageId,
  slug,
  highlighted,
  showArrow,
  openInNewTab,
}: LinkCardProps) {
  const isExternalHref = /^(https?:)?\/\//i.test(href);
  const target = isExternalHref || Boolean(openInNewTab) ? "_blank" : undefined;
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  const common =
    "relative flex items-center gap-4 p-5 rounded-xl border bg-card text-card-foreground hover:shadow-md transition-shadow duration-200";

  return (
    <a href={href} target={target} rel={rel} className={common}>
      {highlighted ? (
        <BorderBeam className="pointer-events-none" size={64} />
      ) : null}
      <LinkCardHeader thumbnailUrl={thumbnailUrl} imageUrl={imageUrl} iconEmoji={iconEmoji} />
      <div className="min-w-0 flex-1">
        <LinkCardBody title={title} description={description} details={details} />
        <MediaPreview imageUrl={imageUrl} thumbnailUrl={thumbnailUrl} videoUrl={videoUrl} files={files} />
        <FileChips files={files} pageId={pageId} slug={slug} imageUrl={imageUrl} videoUrl={videoUrl} />
      </div>

      {showArrow ? (
        <span aria-hidden className="ml-2 text-muted-foreground">
          ↗
        </span>
      ) : null}
    </a>
  );
}
