'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';

import { dataManifest } from '@/data/__generated__/manifest';
import type {
        DataManifestEntry,
        DataModuleKey,
        DataModuleLoader,
        DataModuleModule,
} from '@/data/__generated__/manifest';

type DataModuleStatus = 'idle' | 'loading' | 'ready' | 'error';

const manifestEntriesByKey: {
        readonly [K in DataModuleKey]: DataManifestEntry<K>;
} = dataManifest;

type LoaderResult<K extends DataModuleKey> = Awaited<ReturnType<DataModuleLoader<K>>>;

function getManifestEntry<K extends DataModuleKey>(key: K): DataManifestEntry<K> {
        const entry = manifestEntriesByKey[key];

        if (!entry) {
                throw new Error(`Unknown data module key: ${key}`);
        }

        return entry;
}

function loadModule<K extends DataModuleKey>(key: K): ReturnType<DataModuleLoader<K>> {
        const entry = getManifestEntry(key);
        const loader: DataModuleLoader<K> = entry.loader;

        return loader();
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

const storeCache = new Map<DataModuleKey, UseBoundStore<StoreApi<DataModuleState<DataModuleKey>>>>();

const identity = <T>(value: T) => value;

export function createDataModuleStore<K extends DataModuleKey>(key: K): UseBoundStore<StoreApi<DataModuleState<K>>> {
        const cached = storeCache.get(key);
        if (cached) {
                return cached as UseBoundStore<StoreApi<DataModuleState<K>>>;
        }

        getManifestEntry(key);

        let currentLoad: Promise<void> | undefined;

        const store = create<DataModuleState<K>>((set, get) => ({
                key,
                status: 'idle',
                data: undefined,
                error: undefined,
                async load() {
                        if (currentLoad) {
                                return currentLoad;
                        }

                        set({ status: 'loading', data: undefined, error: undefined });

                        currentLoad = loadModule(key)
                                .then((module: LoaderResult<K>) => {
                                        const resolvedModule: DataModuleModule<K> = module;

                                        set((state) => ({
                                                ...state,
                                                status: 'ready',
                                                data: resolvedModule,
                                                error: undefined,
                                        }));
                                })
                                .catch((error: unknown) => {
                                        set({
                                                status: 'error',
                                                data: undefined,
                                                error,
                                        });
                                        throw error;
                                })
                                .finally(() => {
                                        currentLoad = undefined;
                                });

                        return currentLoad;
                },
                async reload() {
                        set({ status: 'idle', data: undefined, error: undefined });
                        return get().load();
                },
                reset() {
                        currentLoad = undefined;
                        set({ status: 'idle', data: undefined, error: undefined });
                },
        }));

        storeCache.set(key, store as UseBoundStore<StoreApi<DataModuleState<DataModuleKey>>>);

        return store;
}

export type DataModuleStore<K extends DataModuleKey> = UseBoundStore<StoreApi<DataModuleState<K>>>;

export function useDataModule<K extends DataModuleKey, S = DataModuleState<K>>(
        key: K,
        selector?: (state: DataModuleState<K>) => S,
        equality?: (a: S, b: S) => boolean,
): S {
        const store = createDataModuleStore(key);
        const derivedSelector = (selector ?? (identity as (state: DataModuleState<K>) => S));
        const selectedState = store(derivedSelector, equality);

        useEffect(() => {
                if (store.getState().status === 'idle') {
                        void store.getState().load();
                }
        }, [store]);

        return selectedState;
}

/**
 * @internal - Exposed for tests to clear memoized stores.
 */
export function clearDataModuleStores(): void {
        for (const store of storeCache.values()) {
                if (typeof (store as { destroy?: () => void }).destroy === 'function') {
                        (store as { destroy?: () => void }).destroy?.();
                }
        }
        storeCache.clear();
}
