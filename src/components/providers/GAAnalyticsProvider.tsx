"use client";

import { useEffect, useMemo } from "react";
import Analytics from "analytics";
import googleAnalytics from "@analytics/google-analytics";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    __analytics?: ReturnType<typeof Analytics>;
  }
}

/**
 * Google Analytics 4 provider using `analytics` + `@analytics/google-analytics`.
 *
 * Configure env var in `.env.local`:
 *   NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXX[,G-YYYYYYY]
 *
 * Place <GAAnalyticsProvider /> in `src/app/layout.tsx` once.
 */
export default function GAAnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const analytics = useMemo(() => {
    // Hardcoded GA4 Measurement ID per request
    const rawIds = "G-100HCZG6N5";
    const ids = rawIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("GA4 resolved measurement IDs:", ids);
    }

    if (ids.length === 0) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          "GA4: measurement ID env not set. Set NEXT_PUBLIC_DEAL_SCALE_GOOGLE_ANALYTICS_ID or NEXT_PUBLIC_GA4_MEASUREMENT_ID. Analytics disabled.",
        );
      }
      return null;
    }

    const instance = Analytics({
      app: "deal-scale",
      plugins: [
        googleAnalytics({
          measurementIds: ids,
          // debug: process.env.NODE_ENV !== "production",
          gtagConfig: {
            anonymize_ip: true,
          },
        }),
      ],
    });

    // Optional: expose for debugging
    if (typeof window !== "undefined") {
      window.__analytics = instance;
    }

    return instance;
  }, []);

  // Send initial page view + subsequent route changes
  useEffect(() => {
    if (!analytics) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    analytics.page({
      url,
      path: pathname || "/",
      title: document?.title,
    });
  }, [analytics, pathname, searchParams]);

  return null;
}
