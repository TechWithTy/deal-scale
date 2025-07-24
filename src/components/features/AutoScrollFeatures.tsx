import { useEffect, useRef } from "react";

interface AutoScrollFeaturesProps {
	scrollRef: React.RefObject<HTMLDivElement>;
	pausedRef: React.RefObject<boolean>;
}

const AutoScrollFeatures = ({
	scrollRef,
	pausedRef,
}: AutoScrollFeaturesProps) => {
	const timerRef = useRef<number | null>(null);

	// Auto-scrolling effect
	useEffect(() => {
		const startAutoScroll = () => {
			if (!scrollRef.current || pausedRef.current) return;

			timerRef.current = window.setInterval(() => {
				if (scrollRef.current && !pausedRef.current) {
					const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

					// If we're at the end, go back to start
					if (scrollLeft + clientWidth >= scrollWidth - 10) {
						scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
					} else {
						// Otherwise, scroll a bit more
						scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
					}
				}
			}, 5000);
		};

		startAutoScroll();

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [scrollRef, pausedRef]);

	return null; // This is a behavior-only component, it doesn't render anything
};

export default AutoScrollFeatures;
