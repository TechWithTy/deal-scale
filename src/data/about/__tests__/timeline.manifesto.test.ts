import { timeline } from "../timeline";
import { timelineSummary } from "../timelineSummary";

describe("DealScale manifesto timeline", () => {
	const expectedSections = [
		"1️⃣ Origin Story",
		"2️⃣ Core Belief",
		"3️⃣ The Blue Ocean Shift",
		"4️⃣ Our Category",
		'5️⃣ The Movement - "AI Investing League"',
		"6️⃣ Emotional North Star",
		"7️⃣ Value Promise",
		'8️⃣ Self-Hosted Future - "Own Your AI"',
		"9️⃣ Signature Taglines",
		"🔟 Closing Line",
	];

	it("lists the manifesto sections in order", () => {
		const titles = timeline.map((entry) => entry.title);
		expect(titles).toEqual(expectedSections);
	});

	it("keeps timeline summary aligned with full timeline order", () => {
		const summaryTitles = timelineSummary.map((entry) => entry.title);
		expect(summaryTitles).toEqual(expectedSections);
	});

	it("includes concise subtitles for manifesto storytelling beats", () => {
		const subtitles = timeline.map((entry) => entry.subtitle);
		expect(subtitles).toEqual([
			"Automation-first freedom for real estate pros",
			"Wealth is a system, automation is the equalizer",
			"Reframing CRMs into an earning engine",
			"Positioned as the AI Wealth Engine",
			"Turning mastery into a competitive league",
			"Status, freedom, and momentum over features",
			"Pillars that translate into tangible outcomes",
			"Enterprise ownership with aligned incentives",
			"Mantras that sell lifestyle and leverage",
			"The manifesto’s leverage promise in one line",
		]);
	});

	it("provides rich narrative content for each section", () => {
		expect(
			timeline.every(
				(entry) => entry.content !== null && entry.content !== undefined,
			),
		).toBe(true);
		expect(
			timelineSummary.every(
				(entry) => entry.summary.length > 0 && entry.subtitle.length > 0,
			),
		).toBe(true);
	});
});
