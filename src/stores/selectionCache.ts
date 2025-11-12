export interface SelectionCache<S> {
	read: (selection: S, equality: (a: S, b: S) => boolean) => S;
	reset: () => void;
}

export function createSelectionCache<S>(): SelectionCache<S> {
	let hasCachedValue = false;
	let cachedSelection!: S;
	const cacheId = Math.random().toString(36).substring(7); // Unique ID for this cache instance

	console.log(`[SelectionCache] Creating new cache instance: ${cacheId}`);

	return {
		read(selection, equality) {
			if (hasCachedValue && equality(cachedSelection, selection)) {
				console.log(
					`[SelectionCache:${cacheId}] Cache HIT - returning cached selection`,
				);
				return cachedSelection;
			}

			console.log(
				`[SelectionCache:${cacheId}] Cache MISS - caching new selection`,
				{
					hadCachedValue: hasCachedValue,
					isEqual: hasCachedValue
						? equality(cachedSelection, selection)
						: false,
				},
			);

			cachedSelection = selection;
			hasCachedValue = true;
			return selection;
		},
		reset() {
			console.log(`[SelectionCache:${cacheId}] Resetting cache`);
			hasCachedValue = false;
		},
	};
}
