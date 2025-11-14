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
	const conversation = generateSalesConversation(abTestCopy);
	return (
		<section className="my-8 rounded-md border border-muted bg-muted/40 p-4">
			<div className="whitespace-pre-line text-base text-black dark:text-white">
				{highlightText(conversation, {
					cta: abTestCopy.cta ? [abTestCopy.cta] : [],
					solution: abTestCopy.solution ? [abTestCopy.solution] : [],
					hope: abTestCopy.hope ? [abTestCopy.hope] : [],
					fear: abTestCopy.fear ? [abTestCopy.fear] : [],
					pain: abTestCopy.pain_point ? [abTestCopy.pain_point] : [],
					keyword: abTestCopy.highlighted_words ?? [],
				})}
			</div>
			{abTestCopy.highlights && abTestCopy.highlights.length > 0 && (
				<HighlightsSection highlights={abTestCopy.highlights} />
			)}
		</section>
	);
};

export default AbTestCopySection;
