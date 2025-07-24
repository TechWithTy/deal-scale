export function generateSalesConversation(abTestCopy: {
	target_audience?: string;
	pain_point: string; // Crucial for a strong opening
	solution: string; // The core of your value proposition
	tagline?: string;
	subtitle?: string;
	whatsInItForMe?: string; // Should directly tie to solving the pain_point
	highlights?: string[];
	cta?: string;
	additionalInfo?: string;
}): string {
	if (!abTestCopy || !abTestCopy.pain_point || !abTestCopy.solution) {
		return "Sales copy is missing essential information (pain point or solution).";
	}

	let conversation = "";

	// 1. Personalized & Empathetic Opening - Hook with the Pain Point
	if (abTestCopy.target_audience) {
		conversation += `I understand that for ${abTestCopy.target_audience} like you, dealing with ${abTestCopy.pain_point} can be a real challenge, right?\n\n`;
	} else {
		conversation += `Are you finding that ${abTestCopy.pain_point} is causing some headaches?\n\n`;
	}

	// 2. Introduce the Solution as the Hero - Connect with Tagline/Subtitle if available
	conversation += `Well, I'm excited to share how our ${abTestCopy.solution} is specifically designed to address that head-on. `;
	if (abTestCopy.tagline) {
		conversation += `${abTestCopy.tagline}`;
		if (abTestCopy.subtitle) {
			conversation += ` In fact, ${abTestCopy.subtitle.toLowerCase()}\n\n`;
		} else {
			conversation += ".\n\n";
		}
	} else if (abTestCopy.subtitle) {
		conversation += `${abTestCopy.subtitle}\n\n`;
	} else {
		conversation += "\n\n";
	}

	// 3. Clearly Articulate "What's In It For Me?" - The Transformation
	if (abTestCopy.whatsInItForMe) {
		conversation += `So, what does this actually mean for you? Imagine ${abTestCopy.whatsInItForMe.toLowerCase().startsWith("imagine ") ? abTestCopy.whatsInItForMe.substring(8) : abTestCopy.whatsInItForMe}\n\n`;
	} else {
		// If no WIIFM, use the solution to imply the benefit related to the pain point
		conversation += `Think about how much easier things could be once ${abTestCopy.pain_point} is no longer a concern, thanks to ${abTestCopy.solution}.\n\n`;
	}

	// 4. Spotlight Key Benefits/Highlights - Concrete Proof Points
	if (abTestCopy.highlights && abTestCopy.highlights.length > 0) {
		conversation += `Here are a few ways we make that happen:\n – No More 🚫 ${abTestCopy.pain_point}`;
		for (const highlight of abTestCopy.highlights) {
			conversation += `\n*   ${highlight}`;
		}
		if (abTestCopy.solution) {
			conversation += `\nThanks to ${abTestCopy.solution}.`;
		}
		conversation += "\n\n";
	}

	// 5. Strong, Clear Call to Action (CTA) - Guide the Next Step
	if (abTestCopy.cta) {
		conversation += `Does this sound like it could make a difference for you? If so, ${abTestCopy.cta}.\n\n`;
	} else {
		conversation += `I'd be happy to discuss how this could specifically benefit your situation. Are you open to exploring this further?\n\n`; // Generic but actionable CTA
	}

	// 6. Offer Additional Value/Reassurance
	if (abTestCopy.additionalInfo) {
		const info = abTestCopy.additionalInfo.trim();
		conversation += `And just so you know, ${info.toLowerCase().startsWith("it also") || info.toLowerCase().startsWith("it is") ? "" : "it also "}${info}.`;
	}

	return conversation.trim();
}
