"use client";
import * as React from "react";
import type { LinkTreeItem } from "@/utils/linktree";
import { withUtm } from "@/utils/linktree";
import { LinkCard } from "./LinkCard";

export type LinkTreeProps = {
  items: LinkTreeItem[];
  title?: string;
  subtitle?: string;
};

export function LinkTree({ items, title = "Link Tree", subtitle }: LinkTreeProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        ) : null}
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-card text-card-foreground p-6 text-center">
          <p className="font-medium">No links yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Links marked as "Link Tree Enabled" will appear here after syncing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <LinkCard
              key={item.slug}
              title={item.title}
              href={withUtm(item.destination, item.slug)}
              description={item.description}
              iconEmoji={item.iconEmoji}
            />
          ))}
        </div>
      )}
    </div>
  );
}
