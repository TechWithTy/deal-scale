"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useCallback } from "react";

import { useNavigationLoaderStore } from "@/stores/navigation-loader";

export function useNavigationRouter() {
	const router = useNextRouter();
	const startNavigation = useNavigationLoaderStore(
		(state) => state.startNavigation,
	);
	const finishNavigation = useNavigationLoaderStore(
		(state) => state.finishNavigation,
	);

	const push = useCallback(
		(
			href: Parameters<typeof router.push>[0],
			options?: Parameters<typeof router.push>[1],
		) => {
			const navigationId = startNavigation();
			try {
				const result = router.push(href, options);

				if (result && typeof (result as Promise<unknown>).catch === "function") {
					(result as Promise<unknown>).catch(() => {
						finishNavigation(navigationId);
					});
				}
				return result;
			} catch (error) {
				finishNavigation(navigationId);
				throw error;
			}
		},
		[finishNavigation, router, startNavigation],
	);

	const replace = useCallback(
		(
			href: Parameters<typeof router.replace>[0],
			options?: Parameters<typeof router.replace>[1],
		) => {
			const navigationId = startNavigation();
			try {
				const result = router.replace(href, options);
				if (result && typeof (result as Promise<unknown>).catch === "function") {
					(result as Promise<unknown>).catch(() => {
						finishNavigation(navigationId);
					});
				}
				return result;
			} catch (error) {
				finishNavigation(navigationId);
				throw error;
			}
		},
		[finishNavigation, router, startNavigation],
	);

	const back = useCallback(() => {
		const navigationId = startNavigation();
		try {
			const result = router.back();
			if (result && typeof (result as Promise<unknown>).catch === "function") {
				(result as Promise<unknown>).catch(() => {
					finishNavigation(navigationId);
				});
			}
			return result;
		} catch (error) {
			finishNavigation(navigationId);
			throw error;
		}
	}, [finishNavigation, router, startNavigation]);

	const forward = useCallback(() => {
		const navigationId = startNavigation();
		try {
			const result = router.forward();
			if (result && typeof (result as Promise<unknown>).catch === "function") {
				(result as Promise<unknown>).catch(() => {
					finishNavigation(navigationId);
				});
			}
			return result;
		} catch (error) {
			finishNavigation(navigationId);
			throw error;
		}
	}, [finishNavigation, router, startNavigation]);

	const refresh = useCallback(() => {
		const navigationId = startNavigation();
		try {
			const result = router.refresh();
			if (result && typeof (result as Promise<unknown>).catch === "function") {
				(result as Promise<unknown>).catch(() => {
					finishNavigation(navigationId);
				});
			}
			return result;
		} catch (error) {
			finishNavigation(navigationId);
			throw error;
		}
	}, [finishNavigation, router, startNavigation]);

	return {
		...router,
		push,
		replace,
		back,
		forward,
		refresh,
	};
}

