"use client";

import BentoPage from "@/components/bento/page";
import { MainBentoFeatures } from "@/data/bento/main";
import type { BentoFeature } from "@/types/bento/features";

interface ClientBentoProps {
	features?: BentoFeature[];
	title?: string;
	subtitle?: string;
}

export default function ClientBento({
	features = MainBentoFeatures,
	title = "Why Real Estate Leaders Choose Deal Scale",
	subtitle = "We deliver a scalable and automated solution to keep your deal pipeline consistently full.",
}: ClientBentoProps) {
	return <BentoPage features={features} title={title} subtitle={subtitle} />;
}
