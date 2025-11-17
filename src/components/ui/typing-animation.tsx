import { type MotionProps, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type TypingPhase = "typing" | "pause" | "deleting";

interface TypingAnimationProps extends MotionProps {
	children?: string;
	words?: string[];
	className?: string;
	duration?: number;
	typeSpeed?: number;
	deleteSpeed?: number;
	delay?: number;
	pauseDelay?: number;
	loop?: boolean;
	as?: React.ElementType;
	startOnView?: boolean;
	showCursor?: boolean;
	blinkCursor?: boolean;
	cursorStyle?: "line" | "block" | "underscore";
}

type TypingState = {
	displayedText: string;
	wordIndex: number;
	charIndex: number;
	phase: TypingPhase;
};

const INITIAL_STATE: TypingState = {
	displayedText: "",
	wordIndex: 0,
	charIndex: 0,
	phase: "typing",
};

export function TypingAnimation({
	children,
	words,
	className,
	duration = 100,
	typeSpeed,
	deleteSpeed,
	delay = 0,
	pauseDelay = 1000,
	loop = false,
	as: Component = "span",
	startOnView = true,
	showCursor = true,
	blinkCursor = true,
	cursorStyle = "line",
	...props
}: TypingAnimationProps) {
	const MotionComponent = motion.create(Component, {
		forwardMotionProps: true,
	});

	const [typingState, setTypingState] = useState<TypingState>(INITIAL_STATE);
	const { displayedText, wordIndex, charIndex, phase } = typingState;

	const elementRef = useRef<HTMLElement | null>(null);
	const [mounted, setMounted] = useState(false);
	const [manuallyInView, setManuallyInView] = useState(false);
	const isInView = useInView(elementRef as React.RefObject<Element>, {
		amount: 0.1, // Lower threshold to detect when element is in view more easily
		once: false, // Check continuously to stop animation when out of view
		margin: "0px", // No margin for detection
	});

	// Ensure component is mounted before checking viewport
	useEffect(() => {
		setMounted(true);
	}, []);

	// Manual fallback check for viewport visibility (in case useInView doesn't detect it)
	useEffect(() => {
		if (!mounted || !startOnView) return;

		const checkInView = () => {
			if (!elementRef.current) return;
			const rect = elementRef.current.getBoundingClientRect();
			const isVisible =
				rect.top < window.innerHeight &&
				rect.bottom > 0 &&
				rect.left < window.innerWidth &&
				rect.right > 0;
			setManuallyInView(isVisible);
		};

		// Check immediately
		checkInView();

		// Also check on scroll and resize as fallback
		window.addEventListener("scroll", checkInView, { passive: true });
		window.addEventListener("resize", checkInView, { passive: true });

		return () => {
			window.removeEventListener("scroll", checkInView);
			window.removeEventListener("resize", checkInView);
		};
	}, [mounted, startOnView]);

	const wordsToAnimate = useMemo(
		() => words || (children ? [children] : []),
		[words, children],
	);

	const graphemeMap = useMemo(
		() => wordsToAnimate.map((word) => Array.from(word)),
		[wordsToAnimate],
	);

	const contentSignature = useMemo(
		() => graphemeMap.map((graphemes) => graphemes.join("")).join("|"),
		[graphemeMap],
	);

	const contentSignatureRef = useRef(contentSignature);
	const wasInViewRef = useRef<boolean | null>(null);
	const shouldAnimateRef = useRef<boolean>(startOnView ? isInView : true);

	// Stop animation when out of view to prevent layout shifts
	// Use useInView result, or fallback to manual check if useInView hasn't detected it yet
	// If not mounted yet or startOnView is false, allow animation
	const isActuallyInView = startOnView
		? mounted
			? isInView || manuallyInView
			: true
		: true;
	const shouldAnimate = isActuallyInView;

	useEffect(() => {
		if (contentSignatureRef.current !== contentSignature) {
			contentSignatureRef.current = contentSignature;
			setTypingState(INITIAL_STATE);
		}
	}, [contentSignature]);

	// Reset animation when coming back into view (if startOnView is enabled)
	useEffect(() => {
		if (startOnView) {
			// Initialize wasInViewRef on first render
			if (wasInViewRef.current === null) {
				wasInViewRef.current = isActuallyInView;
				// If initially in view, ensure animation can start
				if (isActuallyInView) {
					setTypingState(INITIAL_STATE);
				}
			} else if (isActuallyInView && wasInViewRef.current === false) {
				// Just came back into view, reset animation
				setTypingState(INITIAL_STATE);
			}
			wasInViewRef.current = isActuallyInView;
		} else {
			wasInViewRef.current = true; // Always in view if startOnView is false
		}
	}, [isActuallyInView, startOnView]);

	const hasMultipleWords = graphemeMap.length > 1;

	const typingSpeed = typeSpeed || duration;
	const deletingSpeed = deleteSpeed || typingSpeed / 2;

	// Track shouldAnimate changes to ensure animation restarts
	useEffect(() => {
		const prevShouldAnimate = shouldAnimateRef.current;
		shouldAnimateRef.current = shouldAnimate;

		// If animation was stopped and is now enabled, ensure it can restart
		if (!prevShouldAnimate && shouldAnimate && startOnView) {
			// Animation is being re-enabled, state will be reset by the isInView effect above
		}
	}, [shouldAnimate, startOnView]);

	useEffect(() => {
		if (!shouldAnimate || graphemeMap.length === 0) return;

		const currentGraphemes = graphemeMap[wordIndex] ?? [];
		const isComplete =
			!loop &&
			wordIndex === graphemeMap.length - 1 &&
			charIndex >= currentGraphemes.length &&
			phase !== "deleting";

		if (isComplete) {
			return;
		}

		const timeoutDelay =
			delay > 0 && displayedText === ""
				? delay
				: phase === "typing"
					? typingSpeed
					: phase === "deleting"
						? deletingSpeed
						: pauseDelay;

		const timeout = window.setTimeout(() => {
			setTypingState((prev) => {
				const activeGraphemes = graphemeMap[prev.wordIndex] ?? [];

				switch (prev.phase) {
					case "typing": {
						if (prev.charIndex < activeGraphemes.length) {
							const nextCharIndex = prev.charIndex + 1;
							const nextText = activeGraphemes.slice(0, nextCharIndex).join("");

							if (
								nextText === prev.displayedText &&
								nextCharIndex === prev.charIndex
							) {
								return prev;
							}

							return {
								displayedText: nextText,
								charIndex: nextCharIndex,
								wordIndex: prev.wordIndex,
								phase: prev.phase,
							};
						}

						if (hasMultipleWords || loop) {
							const isLastWord = prev.wordIndex === graphemeMap.length - 1;
							if (!isLastWord || loop) {
								return {
									...prev,
									phase: "pause",
								};
							}
						}

						return prev;
					}

					case "pause":
						return {
							...prev,
							phase: "deleting",
						};

					case "deleting": {
						if (prev.charIndex > 0) {
							const nextCharIndex = prev.charIndex - 1;
							const nextText = activeGraphemes.slice(0, nextCharIndex).join("");

							return {
								...prev,
								displayedText: nextText,
								charIndex: nextCharIndex,
							};
						}

						const nextIndex = (prev.wordIndex + 1) % graphemeMap.length;
						return {
							displayedText: "",
							charIndex: 0,
							wordIndex: nextIndex,
							phase: "typing",
						};
					}
				}
			});
		}, timeoutDelay);

		return () => window.clearTimeout(timeout);
	}, [
		shouldAnimate,
		graphemeMap,
		hasMultipleWords,
		loop,
		typingSpeed,
		deletingSpeed,
		pauseDelay,
		delay,
		displayedText,
		wordIndex,
		charIndex,
		phase,
	]);

	const currentWordGraphemes = graphemeMap[wordIndex] ?? [];
	const isComplete =
		!loop &&
		wordIndex === graphemeMap.length - 1 &&
		charIndex >= currentWordGraphemes.length &&
		phase !== "deleting";

	const shouldShowCursor =
		showCursor &&
		!isComplete &&
		(hasMultipleWords || loop || charIndex < currentWordGraphemes.length);

	const getCursorChar = () => {
		switch (cursorStyle) {
			case "block":
				return "▌";
			case "underscore":
				return "_";
			default:
				return "|";
		}
	};

	return (
		<MotionComponent
			ref={elementRef}
			className={cn("leading-[5rem] tracking-[-0.02em]", className)}
			{...props}
		>
			{displayedText}
			{shouldShowCursor && (
				<span
					className={cn("inline-block", blinkCursor && "animate-blink-cursor")}
				>
					{getCursorChar()}
				</span>
			)}
		</MotionComponent>
	);
}
