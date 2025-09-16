"use client";
import * as React from "react";

export type LinkCardHeaderProps = {
  thumbnailUrl?: string;
  imageUrl?: string;
  iconEmoji?: string;
};

export function LinkCardHeader({ thumbnailUrl, imageUrl, iconEmoji }: LinkCardHeaderProps) {
  return (
    <div className="shrink-0">
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt=""
          className="h-8 w-8 rounded-md object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : imageUrl ? (
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
  );
}
