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
  const [query, setQuery] = React.useState("");
  const [preview, setPreview] = React.useState<null | { type: "image" | "video"; url: string; title: string }>(null);

  const normalized = React.useMemo(() => {
    // sort pinned first, then by title
    const copy = [...items].sort((a, b) => {
      const pa = a.pinned ? 0 : 1;
      const pb = b.pinned ? 0 : 1;
      if (pa !== pb) return pa - pb;
      return a.title.localeCompare(b.title);
    });
    // filter by search
    const q = query.trim().toLowerCase();
    if (!q) return copy;
    return copy.filter((it) =>
      [it.title, it.destination, it.category]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(q))
    );
  }, [items, query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, LinkTreeItem[]>();
    for (const it of normalized) {
      const key = it.category || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return Array.from(map.entries());
  }, [normalized]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
      <header className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        ) : null}
      </header>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search links…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-card text-card-foreground p-6 text-center">
          <p className="font-medium">No links yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Links marked as "Link Tree Enabled" will appear here after syncing.
          </p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-6">
            {grouped.map(([cat, list]) => (
              <section key={cat}>
                <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {cat}
                </h2>
                <div className="space-y-3">
                  {list.map((item) => (
                    <LinkCard
                      key={item.slug}
                      title={item.title}
                      href={withUtm(item.destination, item.slug)}
                      description={item.description}
                      details={item.details}
                      iconEmoji={item.iconEmoji}
                      imageUrl={item.imageUrl}
                      videoUrl={item.videoUrl}
                      files={item.files}
                      onPreview={(media) => setPreview(media)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox preview */}
      {preview ? (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-lg font-semibold truncate pr-4">{preview.title}</h3>
              <button
                className="text-white/80 hover:text-white text-sm border border-white/30 rounded px-2 py-1"
                onClick={() => setPreview(null)}
              >
                Close
              </button>
            </div>
            <div className="bg-black rounded-lg overflow-hidden">
              {preview.type === "video" ? (
                <video src={preview.url} controls className="w-full h-auto" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.url} alt="" className="w-full h-auto" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
