export interface SelectionCache<S> {
	read: (selection: S, equality: (a: S, b: S) => boolean) => S;
	reset: () => void;
}

export function createSelectionCache<S>(): SelectionCache<S> {
	let hasCachedValue = false;
	let cachedSelection!: S;

	return {
		read(selection, equality) {
			if (hasCachedValue && equality(cachedSelection, selection)) {
				return cachedSelection;
			}

			cachedSelection = selection;
			hasCachedValue = true;
			return selection;
		},
		reset() {
			hasCachedValue = false;
		},
	};
}
