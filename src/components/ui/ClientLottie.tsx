"use client";

import type { LottieComponentProps } from "lottie-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ClientLottie(props: LottieComponentProps) {
	return <Lottie {...props} />;
}
