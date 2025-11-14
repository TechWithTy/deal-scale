"use client";

import BentoPage from "@/components/bento/page";
import type { BentoFeature } from "@/types/bento/features";
import React from "react";

interface BentoSectionProps {
	title: string;
	subtitle: string;
	features: BentoFeature[];
}

const BentoSection = ({ title, subtitle, features }: BentoSectionProps) => {
	return <BentoPage title={title} subtitle={subtitle} features={features} />;
};

export default BentoSection;
