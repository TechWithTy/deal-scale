"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { create } from "zustand";
import type { StoreApi, UseBoundStore } from "zustand";
import { shallow } from "zustand/shallow";

import { dataManifest } from "@/data/__generated__/manifest";
import type {
	DataManifestEntry,
	DataModuleKey,
	DataModuleModule,
} from "@/data/__generated__/manifest";

import { createSelectionCache } from "./selectionCache";

export type DataModuleStatus = "idle" | "loading" | "ready" | "error";

const manifestEntriesByKey: {
	readonly [K in DataModuleKey]: DataManifestEntry<K>;
} = dataManifest;

function getManifestEntry<K extends DataModuleKey>(
	key: K,
): DataManifestEntry<K> {
	console.log(`[getManifestEntry] Looking up key: "${key}"`);
	const entry = manifestEntriesByKey[key];

	if (!entry) {
		console.error(
			`[getManifestEntry] ERROR: Unknown data module key: "${key}"`,
		);
		throw new Error(`Unknown data module key: ${key}`);
	}

	console.log(`[getManifestEntry] Found entry for key: "${key}"`);
	return entry;
}

function loadModule<K extends DataModuleKey>(
	key: K,
): Promise<DataModuleModule<K>> {
	console.log(`[loadModule] Loading module for key: "${key}"`);
	const entry = getManifestEntry(key);
	const loader = entry.loader as () => Promise<DataModuleModule<K>>;

	console.log(`[loadModule] Calling loader for key: "${key}"`);
	return loader()
		.then((module) => {
			console.log(`[loadModule] Module loaded successfully for key: "${key}"`);
			return module;
		})
		.catch((error) => {
			console.error(
				`[loadModule] ERROR loading module for key: "${key}":`,
				error,
			);
			throw error;
		});
}

export interface DataModuleState<K extends DataModuleKey> {
	readonly key: K;
	readonly status: DataModuleStatus;
	readonly data?: DataModuleModule<K>;
	readonly error?: unknown;
	load: () => Promise<void>;
	reload: () => Promise<void>;
	reset: () => void;
}

const storeCache = new Map<
	DataModuleKey,
	UseBoundStore<StoreApi<DataModuleState<DataModuleKey>>>
>();

const identity = <T>(value: T) => value;

function defaultEquality<T>(a: T, b: T): boolean {
	if (Object.is(a, b)) {
		return true;
	}

	if (
		typeof a === "object" &&
		a !== null &&
		typeof b === "object" &&
		b !== null
	) {
		const valueA = a as Record<string, unknown>;
		const valueB = b as Record<string, unknown>;
		const keysA = Object.keys(valueA);
		const keysB = Object.keys(valueB);

		if (keysA.length !== keysB.length) {
			return false;
		}

		for (const key of keysA) {
			if (!Object.prototype.hasOwnProperty.call(valueB, key)) {
				return false;
			}

			const nestedA = valueA[key];
			const nestedB = valueB[key];

			if (Object.is(nestedA, nestedB)) {
				continue;
			}

			if (
				typeof nestedA === "object" &&
				nestedA !== null &&
				typeof nestedB === "object" &&
				nestedB !== null &&
				shallow(
					nestedA as Record<string, unknown>,
					nestedB as Record<string, unknown>,
				)
			) {
				continue;
			}

			return false;
		}

		return true;
	}

	return false;
}

export function createDataModuleStore<K extends DataModuleKey>(
	key: K,
): UseBoundStore<StoreApi<DataModuleState<K>>> & {
	getInitialState: () => DataModuleState<K>;
} {
	console.log(`[createDataModuleStore] Called for key: "${key}"`);
	const cached = storeCache.get(key);
	if (cached) {
		console.log(
			`[createDataModuleStore] Returning cached store for key: "${key}"`,
		);
		return cached as UseBoundStore<StoreApi<DataModuleState<K>>> & {
			getInitialState: () => DataModuleState<K>;
		};
	}

	console.log(`[createDataModuleStore] Creating new store for key: "${key}"`);
	console.log(
		`[createDataModuleStore] Getting manifest entry for key: "${key}"`,
	);
	getManifestEntry(key);
	console.log(`[createDataModuleStore] Manifest entry found for key: "${key}"`);

	let currentLoad: Promise<void> | undefined;

	const initialState: DataModuleState<K> = {
		key,
		status: "idle",
		data: undefined,
		error: undefined,
	} as DataModuleState<K>;

	console.log(
		`[createDataModuleStore] Creating Zustand store instance for key: "${key}"`,
	);
	const store = create<DataModuleState<K>>((set, get) => ({
		...initialState,
		async load() {
			console.log(`[createDataModuleStore:${key}] load() called`);
			if (currentLoad) {
				console.log(
					`[createDataModuleStore:${key}] Load already in progress, returning existing promise`,
				);
				return currentLoad;
			}

			console.log(
				`[createDataModuleStore:${key}] Starting load, setting status to "loading"`,
			);
			set({ status: "loading", data: undefined, error: undefined });

			console.log(`[createDataModuleStore:${key}] Calling loadModule`);
			currentLoad = loadModule(key)
				.then((module) => {
					console.log(
						`[createDataModuleStore:${key}] Module loaded successfully`,
					);
					console.log(
						`[createDataModuleStore:${key}] Module keys:`,
						Object.keys(module),
					);
					if ("caseStudies" in module) {
						const caseStudies = (module as { caseStudies?: unknown })
							.caseStudies;
						console.log(
							`[createDataModuleStore:${key}] caseStudies count:`,
							Array.isArray(caseStudies) ? caseStudies.length : "NOT ARRAY",
						);
					} else {
						console.log(
							`[createDataModuleStore:${key}] caseStudies NOT FOUND in module`,
						);
					}
					set((state) => {
						const nextState: DataModuleState<K> = {
							...state,
							status: "ready",
							data: module,
							error: undefined,
						};

						return nextState;
					});
					console.log(
						`[createDataModuleStore:${key}] Store state updated to "ready"`,
					);
				})
				.catch((error: unknown) => {
					console.error(`[createDataModuleStore:${key}] Load failed:`, error);
					set({
						status: "error",
						data: undefined,
						error,
					});
					throw error;
				})
				.finally(() => {
					console.log(
						`[createDataModuleStore:${key}] Load promise completed, clearing currentLoad`,
					);
					currentLoad = undefined;
				});

			return currentLoad;
		},
		async reload() {
			console.log(`[createDataModuleStore:${key}] reload() called`);
			set({ status: "idle", data: undefined, error: undefined });
			return get().load();
		},
		reset() {
			console.log(`[createDataModuleStore:${key}] reset() called`);
			currentLoad = undefined;
			set({ status: "idle", data: undefined, error: undefined });
		},
	}));

	// Add getInitialState method to store for SSR
	console.log(
		`[createDataModuleStore] Adding getInitialState method to store for key: "${key}"`,
	);
	(
		store as unknown as { getInitialState: () => DataModuleState<K> }
	).getInitialState = () => {
		console.log(
			`[createDataModuleStore:${key}] getInitialState() called, returning initial state`,
		);
		return initialState;
	};

	console.log(`[createDataModuleStore] Caching store for key: "${key}"`);
	storeCache.set(
		key,
		store as UseBoundStore<StoreApi<DataModuleState<DataModuleKey>>> & {
			getInitialState: () => DataModuleState<K>;
		},
	);

	console.log(
		`[createDataModuleStore] Successfully created and cached store for key: "${key}"`,
	);
	return store as UseBoundStore<StoreApi<DataModuleState<K>>> & {
		getInitialState: () => DataModuleState<K>;
	};
}

export type DataModuleStore<K extends DataModuleKey> = UseBoundStore<
	StoreApi<DataModuleState<K>>
>;

export function useDataModule<K extends DataModuleKey, S = DataModuleState<K>>(
	key: K,
	selector?: (state: DataModuleState<K>) => S,
	equality?: (a: S, b: S) => boolean,
): S {
	// CRITICAL: Wrap store creation in try-catch to prevent errors from stopping hook execution
	// During SSR, if store creation fails, React's error recovery might skip subsequent hooks
	// This ensures all hooks execute even if store creation fails
	console.log(`[useDataModule] Hook starting for key: "${key}"`);
	let store: UseBoundStore<StoreApi<DataModuleState<K>>> & {
		getInitialState: () => DataModuleState<K>;
	};
	try {
		console.log(`[useDataModule] Creating store for key: "${key}"`);
		store = createDataModuleStore(key);
		console.log(`[useDataModule] Store created successfully for key: "${key}"`);
	} catch (error) {
		// Create fallback store to ensure hooks continue executing
		// This prevents "Rendered more hooks" error during SSR error recovery
		console.error(
			`[useDataModule] ERROR creating store for key "${key}":`,
			error,
		);
		// Create minimal fallback store with same shape as normal store
		const fallbackInitialState: DataModuleState<K> = {
			key,
			status: "error" as const,
			data: undefined,
			error,
			async load() {
				// No-op for fallback store
			},
			async reload() {
				// No-op for fallback store
			},
			reset() {
				// No-op for fallback store
			},
		} as DataModuleState<K>;
		store = create<DataModuleState<K>>(
			() => fallbackInitialState,
		) as UseBoundStore<StoreApi<DataModuleState<K>>> & {
			getInitialState: () => DataModuleState<K>;
		};
		// Add getInitialState method for consistency
		(
			store as unknown as {
				getInitialState: () => DataModuleState<K>;
			}
		).getInitialState = () => fallbackInitialState;
	}
	console.log(`[useDataModule] Setting up selector and refs for key: "${key}"`);
	const derivedSelector =
		selector ?? (identity as (state: DataModuleState<K>) => S);
	const equalityFn = equality ?? (defaultEquality as (a: S, b: S) => boolean);
	console.log(`[useDataModule] Creating useRef hooks for key: "${key}"`);
	const selectorRef = useRef(derivedSelector);
	const equalityRef = useRef(equalityFn);
	const keyRef = useRef(key); // Store key for logging in callbacks
	keyRef.current = key; // Update on each render

	// Initialize selection cache once per hook instance
	console.log(`[useDataModule] Initializing selection cache for key: "${key}"`);
	// This persists across re-renders but not across SSR/client boundaries
	// The cache ensures that repeated calls with equal values return the same reference
	const selectionCacheRef = useRef<ReturnType<
		typeof createSelectionCache<S>
	> | null>(null);
	if (!selectionCacheRef.current) {
		selectionCacheRef.current = createSelectionCache<S>();
	}

	// Update refs to latest values (allows selector/equality to change without breaking memoization)
	selectorRef.current = derivedSelector;
	equalityRef.current = equalityFn;

	console.log(
		`[useDataModule] Updated selector/equality refs for key: "${key}"`,
	);

	// Stable selector that caches results by equality
	// This ensures that repeated calls with equal state return the same cached reference
	console.log(
		`[useDataModule] Creating useCallback(stableSelector) for key: "${key}"`,
	);
	const stableSelector = useCallback(
		(state: DataModuleState<K>) => {
			const rawSelection = selectorRef.current(state);
			// Cache the selection result - if the same value (by equality) is returned,
			// we'll reuse the same reference, preventing React from detecting "changes"
			const cache = selectionCacheRef.current;
			if (!cache) {
				console.error(
					`[useDataModule] Selection cache not initialized for key: "${keyRef.current}"`,
				);
				throw new Error("Selection cache not initialized");
			}
			const cachedSelection = cache.read(rawSelection, equalityRef.current);
			console.log(
				`[useDataModule] stableSelector executed for key: "${keyRef.current}"`,
				{
					hadCacheHit: rawSelection === cachedSelection,
				},
			);
			return cachedSelection;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps -- selector, equality, and key accessed via refs
		[], // Empty deps - selector, equality, and key accessed via refs
	);

	// Stable equality function that delegates to the current equality function
	console.log(
		`[useDataModule] Creating useCallback(stableEquality) for key: "${key}"`,
	);
	const stableEquality = useCallback(
		(a: S, b: S) => equalityRef.current(a, b),
		[], // Empty deps - equality is accessed via ref
	);

	// Create a stable getServerSnapshot that caches its result
	// This is critical for SSR - React requires getServerSnapshot to return
	// the same reference on repeated calls to avoid infinite loops
	console.log(
		`[useDataModule] Creating useRef(serverSnapshotCacheRef) for key: "${key}"`,
	);
	const serverSnapshotCacheRef = useRef<{
		snapshot: S;
		state: DataModuleState<K>;
	} | null>(null);

	console.log(
		`[useDataModule] Creating useCallback(getServerSnapshot) for key: "${key}"`,
	);
	const getServerSnapshot = useCallback(() => {
		console.log(`[useDataModule] getServerSnapshot called for key: "${key}"`);
		const initialState = store.getInitialState();
		const cache = serverSnapshotCacheRef.current;

		// If we have a cached snapshot and the state reference matches, return cached
		if (cache && cache.state === initialState) {
			console.log(
				`[useDataModule] getServerSnapshot CACHE HIT for key: "${key}"`,
			);
			return cache.snapshot;
		}

		// Otherwise, compute and cache new snapshot
		console.log(
			`[useDataModule] getServerSnapshot CACHE MISS - computing new snapshot for key: "${key}"`,
		);
		const snapshot = stableSelector(initialState);
		serverSnapshotCacheRef.current = {
			snapshot,
			state: initialState,
		};
		console.log(
			`[useDataModule] getServerSnapshot cached new snapshot for key: "${key}"`,
		);
		return snapshot;
	}, [store, stableSelector, key]);

	console.log(
		`[useDataModule] Calling useSyncExternalStoreWithSelector for key: "${key}"`,
	);
	const selection = useSyncExternalStoreWithSelector(
		store.subscribe,
		store.getState,
		getServerSnapshot,
		stableSelector,
		stableEquality,
	);

	console.log(`[useDataModule] Creating useEffect for key: "${key}"`);
	useEffect(() => {
		// Force log to both console and ensure it runs
		if (typeof window !== "undefined") {
			console.log(
				`[useDataModule] useEffect executed (CLIENT) for key: "${key}"`,
			);
		}
		const currentStatus = store.getState().status;
		console.log(
			`[useDataModule] useEffect executed for key: "${key}", status: ${currentStatus}`,
		);
		if (currentStatus === "idle") {
			console.log(`[useDataModule] Triggering load for key: "${key}"`);
			const loadPromise = store.getState().load();
			if (loadPromise) {
				void loadPromise.catch((error) => {
					console.error(`[useDataModule] Load error for key "${key}":`, error);
					console.error(
						`[useDataModule] Load error stack:`,
						error instanceof Error ? error.stack : String(error),
					);
				});
			} else {
				console.warn(
					`[useDataModule] load() returned undefined for key: "${key}"`,
				);
			}
		} else {
			console.log(
				`[useDataModule] Skipping load for key: "${key}", status is: ${currentStatus}`,
			);
		}
	}, [store, key]);

	const selectionStatus =
		selection &&
		typeof (selection as { status?: unknown }).status !== "undefined"
			? (selection as { status?: unknown }).status
			: undefined;
	console.log(`[useDataModule] COMPLETE for key: "${key}"`, {
		status: selectionStatus,
	});
	return selection;
}

/**
 * @internal - Exposed for tests to clear memoized stores.
 */
export function clearDataModuleStores(): void {
	for (const store of storeCache.values()) {
		if (typeof (store as { destroy?: () => void }).destroy === "function") {
			(store as { destroy?: () => void }).destroy?.();
		}
	}
	storeCache.clear();
}
