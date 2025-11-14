"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useNavigationLoaderStore } from "@/stores/navigation-loader";

import { Spinner } from "./spinner";

const isClient = typeof window !== "undefined";

function shouldStartNavigationFromEvent(event: MouseEvent): boolean {
	if (!isClient) return false;
	if (event.defaultPrevented) return false;
	if (event.button !== 0) return false;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
		return false;
	}

	const target = event.target as HTMLElement | null;
	const anchor = target?.closest("a");
	if (!anchor) return false;

	if (anchor.hasAttribute("download")) return false;
	if (anchor.getAttribute("target") === "_blank") return false;
	if (anchor.getAttribute("rel")?.includes("external")) return false;

	const href = anchor.getAttribute("href");
	if (!href || href.startsWith("#")) return false;

	const destination = new URL(href, window.location.href);
	if (destination.origin !== window.location.origin) return false;

	const currentUrl = new URL(window.location.href);
	if (
		destination.pathname === currentUrl.pathname &&
		destination.search === currentUrl.search
	) {
		return false;
	}

	return true;
}

export function NavigationLoader() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isNavigating = useNavigationLoaderStore((state) => state.isNavigating);
	const startNavigation = useNavigationLoaderStore(
		(state) => state.startNavigation,
	);
	const finishNavigation = useNavigationLoaderStore(
		(state) => state.finishNavigation,
	);

	const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (!isClient) return;
		setPortalHost(document.body);
	}, []);

	useEffect(() => {
		if (!isClient) return;

		const handleClickCapture = (event: MouseEvent) => {
			if (shouldStartNavigationFromEvent(event)) {
				startNavigation();
			}
		};

		const handlePopstate = () => {
			startNavigation();
		};

		document.addEventListener("click", handleClickCapture, true);
		window.addEventListener("popstate", handlePopstate);

		return () => {
			document.removeEventListener("click", handleClickCapture, true);
			window.removeEventListener("popstate", handlePopstate);
		};
	}, [startNavigation]);

	const locationKey = useMemo(() => {
		const search = searchParams ? `?${searchParams.toString()}` : "";
		return `${pathname ?? ""}${search}`;
	}, [pathname, searchParams]);

	const [lastLocation, setLastLocation] = useState<string | null>(null);

	useEffect(() => {
		if (lastLocation && lastLocation !== locationKey) {
			finishNavigation();
		}
		setLastLocation(locationKey);
	}, [finishNavigation, lastLocation, locationKey]);

	const content = useMemo(() => {
		if (!isNavigating) return null;

		return (
			<div className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center">
				<div className="pointer-events-auto mt-3 flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-lg ring-1 ring-border/40 backdrop-blur">
					<Spinner size="sm" aria-label="Navigating" className="text-primary" />
					<span aria-hidden>Loading experience…</span>
				</div>
			</div>
		);
	}, [isNavigating]);

	if (!portalHost || !content) return null;

	return createPortal(content, portalHost);
}

