import type React from "react";
import { v4 as uuidv4 } from "uuid";

export function highlightKeyPhrases(text = ""): React.ReactNode {
	if (!text) return text;

	const highlightPatterns = [
		"innovative",
		"cutting-edge",
		"transformative",
		"scalable",
		"custom",
		"enterprise-grade",
	];

	return text.split(/(\s+)/).map((part, i) => {
		const shouldHighlight = highlightPatterns.some((pattern) =>
			part.toLowerCase().includes(pattern.toLowerCase()),
		);
		return shouldHighlight ? (
			<span key={uuidv4()} className="font-medium text-primary">
				{part}
			</span>
		) : (
			part
		);
	});
}
