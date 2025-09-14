"use client";
import * as React from "react";

export type LinkCardProps = {
  title: string;
  href: string;
  description?: string;
  iconEmoji?: string;
};

export function LinkCard({ title, href, description, iconEmoji }: LinkCardProps) {
  const isExternal = /^(https?:)?\/\//i.test(href);
  const common = "flex items-center gap-3 p-4 rounded-xl border bg-card text-card-foreground hover:shadow-md transition-shadow duration-200";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={common}
    >
      <div className="text-2xl">{iconEmoji ?? "🚀"}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{title}</div>
        {description ? (
          <div className="text-sm text-muted-foreground truncate">{description}</div>
        ) : null}
      </div>
      <span aria-hidden className="ml-2 text-muted-foreground">↗</span>
    </a>
  );
}
