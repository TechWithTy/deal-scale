"use client";

import type {
	ForwardRefComponent,
	HTMLMotionProps,
	TargetAndTransition,
	Transition,
	VariantLabels,
} from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";

type SafeMotionDivProps = {
	children: React.ReactNode;
	initial?: TargetAndTransition | VariantLabels;
	animate?: TargetAndTransition | VariantLabels;
	exit?: TargetAndTransition | VariantLabels;
	transition?: Transition;
};

const SafeMotionDiv: React.FC<SafeMotionDivProps> = ({
	children,
	initial,
	animate,
	exit,
	transition,
}) => {
	const [MotionDiv, setMotionDiv] = useState<ForwardRefComponent<
		HTMLDivElement,
		HTMLMotionProps<"div">
	> | null>(null);

	useEffect(() => {
		import("framer-motion")
			.then((mod) => {
				setMotionDiv(mod.motion.div);
			})
			.catch((error) => {
				console.error("Failed to load Framer Motion:", error);
			});
	}, []);

	if (!MotionDiv) {
		return <div>{children}</div>;
	}

	return (
		<MotionDiv
			initial={initial}
			animate={animate}
			exit={exit}
			transition={transition}
		>
			{children}
		</MotionDiv>
	);
};

export default SafeMotionDiv;
