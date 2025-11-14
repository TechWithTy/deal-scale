import { useRef, useEffect, type RefObject, useCallback } from "react";

import { createDebounce } from "shared/utils";

const defaultOptions = {
	offset: 0,
	timeout: 500,
};

export type IntersectionChecker = {
	element: HTMLElement;
	offset: number;

	position: {
		x: number;
		y: number;
	};
};

export type UseIntersectionOptions = typeof defaultOptions;
export type Callback<T extends HTMLElement> = (props: CallbackProps<T>) => void;

type CallbackProps<T extends HTMLElement> = {
	position: IntersectionChecker["position"];
	element: T | null;
};

type InternalCallback<T extends HTMLElement> = {
	id: string;
	callback: Callback<T>;
};

function checkIntersection({ element, offset, position }: IntersectionChecker) {
	const { top, height } = element.getBoundingClientRect();
	const elementY = Math.abs(top + position.y - offset);
	const bottom = elementY + height - offset;

	if (elementY < offset && position.y <= elementY && position.y <= bottom) {
		return true;
	}

	return position.y > elementY && position.y < bottom;
}

export function useElementIntersection<T extends HTMLElement = HTMLElement>(
	options: UseIntersectionOptions = defaultOptions,
) {
	const ref = useRef<T | null>(null);
	const lastIntersection = useRef<boolean>(false);
	const position = useRef({ x: 0, y: 0 }).current;
	const callbacksRef = useRef<InternalCallback<T>[]>([]);

	useEffect(() => {
		const { execute, abort } = createDebounce(() => {
			handleScroll();
		}, options.timeout || defaultOptions.timeout);

		function handleScroll() {
			const callbacks = callbacksRef.current;
			const element = ref.current;

			if (!element) {
				return;
			}
			const documentElement = document.documentElement;
			position;

			const left =
				(window.pageXOffset || documentElement.scrollLeft) -
				(documentElement.clientLeft || 0);

			const top =
				(window.pageYOffset || documentElement.scrollTop) -
				(documentElement.clientTop || 0);

			const homeCallbacks = callbacks.find(
				(callback) => callback.id === "home",
			);

			if (homeCallbacks && top === 0) {
				homeCallbacks.callback({ position, element });
				return;
			}

			const isIntersecting = checkIntersection({
				element: element as unknown as HTMLElement,
				offset: options.offset,

				position: {
					x: left,
					y: top,
				},
			});

			const isIntersectionChanged = lastIntersection.current !== isIntersecting;

			if (!isIntersectionChanged) return;

			if (isIntersectionChanged) {
				lastIntersection.current = isIntersecting;
			}

			if (!isIntersecting) return;

			for (const { callback } of callbacks) {
				callback({ element, position });
			}
		}

		const handleScrollDebounced = () => {
			execute();
		};

		window.addEventListener("scroll", handleScrollDebounced);

		return () => {
			abort();
			window.removeEventListener("scroll", handleScrollDebounced);
		};
	});

	const onIntersect = useCallback((id: string, callback: Callback<T>) => {
		const callbacks = callbacksRef.current;
		const existingIndex = callbacks.findIndex(
			(prevCallback) => prevCallback.id === id,
		);

		if (existingIndex >= 0) {
			callbacks[existingIndex] = { id, callback };
			return;
		}

		callbacks.push({ id, callback });
	}, []);

	return {
		ref,
		onIntersect,
	};
}
