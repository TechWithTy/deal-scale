import type { ABTestCopy } from "@/types/testing";
import React from "react";
import { v4 as uuid } from "uuid";
import { cn } from "../../../../lib/utils";
import { generateSalesConversation } from "../utils/buidSalesConversation";
import { highlightText } from "../utils/highlightText";
import HighlightsSection from "./HighlightsSection";

interface AbTestCopySectionProps {
	abTestCopy?: ABTestCopy;
}

const AbTestCopySection = ({ abTestCopy }: AbTestCopySectionProps) => {
	if (!abTestCopy) return null;
	// Primary highlights: CTA, solution, highlighted_words
	const primaryHighlights = Array.from(
		new Set(
			[
				abTestCopy.cta,
				abTestCopy.solution,
				...(abTestCopy.highlighted_words ?? []),
			].filter(Boolean),
		),
	);
	// Secondary highlights: pain_point
	const secondaryHighlights = abTestCopy.pain_point
		? [abTestCopy.pain_point]
		: [];

	const conversation = generateSalesConversation(abTestCopy);
	return (
		<section className="my-8 rounded-md border border-muted bg-muted/40 p-4">
			<div className="whitespace-pre-line text-base text-black dark:text-white">
				{highlightText(conversation, primaryHighlights, secondaryHighlights)}
			</div>
			{abTestCopy.highlights && abTestCopy.highlights.length > 0 && (
				<HighlightsSection highlights={abTestCopy.highlights} />
			)}
		</section>
	);
};

export default AbTestCopySection;
