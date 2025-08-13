"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { BeehiivPost } from "@/types/behiiv";

interface RecentPostsSectionProps {
  title: string;
  posts: BeehiivPost[];
}

export function RecentPostsSection({ title, posts }: RecentPostsSectionProps) {
  const recentPosts = Array.isArray(posts) ? posts : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="mb-4 font-semibold text-black text-xl dark:text-white">
        {title}
      </h3>
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <a
            key={post.id}
            href={typeof post.web_url === "string" ? post.web_url : "/"}
            className="group flex items-start space-x-3"
          >
            <Image
              src={
                typeof post.thumbnail_url === "string"
                  ? post.thumbnail_url
                  : "https://place-hold.it/600x600"
              }
              alt={post.title}
              className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
              style={{
                objectFit:
                  typeof post.thumbnail_url === "string" &&
                  post.thumbnail_url.endsWith(".gif")
                    ? "contain"
                    : "cover",
              }}
              width={800}
              height={450}
            />
            <div>
              <h4 className="font-medium text-black text-sm transition-colors group-hover:text-primary dark:text-white">
                {post.title}
              </h4>
              <p className="text-primary text-xs">
                {(() => {
                  const raw = (post as any).published_at ?? (post as any).publish_date;
                  if (typeof raw === "number") return new Date(raw * 1000).toLocaleDateString();
                  if (typeof raw === "string") return new Date(raw).toLocaleDateString();
                  return "—";
                })()}
              </p>
              {Array.isArray(post.content_tags) && post.content_tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {post.content_tags
                    .filter((tag): tag is string => typeof tag === "string")
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-primary/10 px-2 py-0.5 text-primary text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
