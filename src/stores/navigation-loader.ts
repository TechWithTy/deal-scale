"use client";

import { create } from "zustand";

type StartNavigationOptions = {
	timeoutMs?: number;
};

type NavigationLoaderState = {
	isNavigating: boolean;
	pendingIds: number[];
	startNavigation: (options?: StartNavigationOptions) => number;
	finishNavigation: (id?: number) => void;
	reset: () => void;
};

const DEFAULT_TIMEOUT_MS = 12000;

const createBaseState = () => ({
	isNavigating: false,
	pendingIds: [] as number[],
});

const navigationTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
let navigationIdCounter = 0;

export const useNavigationLoaderStore = create<NavigationLoaderState>()(
	(set, get) => ({
		...createBaseState(),
		startNavigation: ({ timeoutMs }: StartNavigationOptions = {}) => {
			const id = ++navigationIdCounter;
			const timeout = timeoutMs ?? DEFAULT_TIMEOUT_MS;

			if (timeout > 0) {
				const timer = setTimeout(() => {
					navigationTimeouts.delete(id);
					set((state) => {
						const pendingIds = state.pendingIds.filter(
							(pendingId) => pendingId !== id,
						);
						return {
							pendingIds,
							isNavigating: pendingIds.length > 0,
						};
					});
				}, timeout);

				navigationTimeouts.set(id, timer);
			}

			set((state) => ({
				pendingIds: [...state.pendingIds, id],
				isNavigating: true,
			}));

			return id;
		},
		finishNavigation: (id?: number) => {
			if (typeof id === "number") {
				const timer = navigationTimeouts.get(id);
				if (timer) {
					clearTimeout(timer);
					navigationTimeouts.delete(id);
				}

				const { pendingIds } = get();
				if (!pendingIds.includes(id)) return;

				set((state) => {
					const nextPending = state.pendingIds.filter(
						(pendingId) => pendingId !== id,
					);
					return {
						pendingIds: nextPending,
						isNavigating: nextPending.length > 0,
					};
				});
				return;
			}

			navigationTimeouts.forEach((timer) => clearTimeout(timer));
			navigationTimeouts.clear();
			set(() => createBaseState());
		},
		reset: () => {
			navigationTimeouts.forEach((timer) => clearTimeout(timer));
			navigationTimeouts.clear();
			set(() => createBaseState());
		},
	}),
);

export function resetNavigationLoaderStore() {
	useNavigationLoaderStore.getState().reset();
	navigationIdCounter = 0;
}
