export const TAB_KEYS = ["review", "problem", "solution"] as const;
export type TabKey = (typeof TAB_KEYS)[number];
