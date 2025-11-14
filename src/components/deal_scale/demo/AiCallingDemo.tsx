"use client";

import Header from "@/components/common/Header";
import SessionMonitor from "@/components/deal_scale/talkingCards/SessionMonitor";
import demoTranscript from "@/data/transcripts";

// This component is extracted from HeroSessionMonitor to be a standalone demo.

const AiCallingDemo = () => {
	return (
		<>
			<Header
				size="sm"
				title="AI Calling Demo"
				subtitle="See Your Ai Agent Prequalify Off Market Leads"
			/>
			<SessionMonitor transcript={demoTranscript} />
		</>
	);
};

export default AiCallingDemo;
