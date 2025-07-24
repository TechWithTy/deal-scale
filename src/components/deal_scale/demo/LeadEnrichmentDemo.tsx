"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedList } from "@/components/ui/animatedList";
import { CallCompleteModal } from "@/components/deal_scale/talkingCards/session/CallCompleteModal";
import { exampleResults } from "@/data/skiptTraceExample";
import Header from "@/components/common/Header";

const LeadEnrichmentDemo = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [address, setAddress] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!address.trim()) return;
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setSubmitted(true);
		}, 1200);
	};

	const handleReset = () => {
		setAddress("");
		setSubmitted(false);
		setLoading(false);
	};

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-6 py-8">
			<Header
				size="sm"
				title="Lead Enrichment Demo"
				subtitle="Enrich Off Market Leads In That Area"
			/>
			{!submitted && !loading && (
				<form
					className="flex w-full flex-col items-center justify-center gap-4"
					onSubmit={handleSubmit}
					autoComplete="off"
				>
					<Input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Enter property address (e.g. 123 Main St, Springfield)"
						className="w-full max-w-md text-center"
						required
					/>
					<Button type="submit" className="w-full max-w-md">
						Enrich Lead
					</Button>
				</form>
			)}
			{loading && (
				<div className="flex h-40 w-full animate-pulse flex-col items-center justify-center">
					<span className="mb-2 text-base font-medium text-muted-foreground">
						Analyzing public records…
					</span>
					<div className="h-4 w-2/3 rounded bg-muted" />
				</div>
			)}
			{submitted && !loading && (
				<div className="w-full">
					<div className="max-h-[340px] w-full overflow-y-auto rounded-xl border bg-card p-2 shadow-inner">
						<AnimatedList delay={180}>
							{exampleResults.map((section, i) => (
								<div
									key={section.name}
									className="mb-2 rounded-xl border bg-background p-4 shadow-sm"
								>
									<div className="mb-1 flex items-center gap-2 text-lg font-semibold">
										<span className="text-2xl">{section.icon}</span>
										<span>{section.label}</span>
									</div>
									<ul className="ml-7 mt-1 list-disc text-base text-muted-foreground">
										{section.items.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</div>
							))}
						</AnimatedList>
					</div>
					<div className="mt-4 flex justify-center gap-4">
						<Button variant="outline" onClick={handleReset}>
							New Search
						</Button>
						<Button onClick={() => setIsModalOpen(true)}>Get Free Leads</Button>
					</div>
				</div>
			)}
			<CallCompleteModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default LeadEnrichmentDemo;
