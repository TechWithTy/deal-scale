"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import SessionMonitor from "@/components/deal_scale/talkingCards/SessionMonitor";
import { AnimatedList } from "@/components/ui/animatedList";
import { Iphone } from "@/components/ui/iphone";
import { LayoutGrid } from "@/components/ui/layout-grid";
import { SparklesText } from "@/components/ui/sparkles-text";
import {
	AI_OUTREACH_STUDIO_ANCHOR,
	AI_OUTREACH_STUDIO_DESCRIPTION,
	AI_OUTREACH_STUDIO_FEATURES,
	AI_OUTREACH_STUDIO_HEADING,
	AI_OUTREACH_STUDIO_TAGLINE,
} from "@/data/home/aiOutreachStudio";
import demoTranscript from "@/data/transcripts";
import { cn } from "@/lib/utils";

type PreviewType = "call" | "text";

const CALL_DEMO_PLAYLIST_SRC =
	"https://www.youtube.com/embed/videoseries?list=PL2qdNLbKGbJB3_UFHA0Xc3-5tk2d7oUEt&index=0&controls=1&autoplay=0&mute=1&rel=0&playsinline=1&modestbranding=1";

const TEXT_DEMO_MESSAGES = [
	{
		sender: "AI",
		text: "Hey there 👋 this is Ava with Metro Realty. Just wanted to check in, are you still open to selling your home on 2143 W Elm St this month? If you’d like to talk to a teammate, I can loop in Jordan here: https://deal.scale/agents/jordan.",
	},
	{
		sender: "Lead",
		text: "Hey, it’s Elyas. Depends what kind of offer I’d get.",
	},
	{
		sender: "AI",
		text: "Totally understandable. Looking at recent sales nearby, homes like yours are closing around $420K to $435K. Would that range work for you?",
	},
	{
		sender: "Lead",
		text: "That’s close, Aly. If we can move fast I’m listening.",
	},
	{
		sender: "AI",
		text: "Perfect, I’ll have Jordan give you a quick call with a verified cash estimate today. Does 3 PM work?",
	},
	{
		sender: "Lead",
		text: "Yeah, that’s fine. Loop me in if Elyas needs anything else.",
	},
	{
		sender: "AI",
		text: "✅ Great! You’re confirmed for 3 PM. Jordan will reach out then. Thanks again!",
	},
] as const;
const TEXT_DEMO_MESSAGES_COUNT = TEXT_DEMO_MESSAGES.length;

function useInterval(callback: () => void, delay: number | null): void {
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null) {
			return;
		}
		const id = window.setInterval(() => {
			savedCallback.current();
		}, delay);
		return () => {
			window.clearInterval(id);
		};
	}, [delay]);
}

export const CallDemoShowcase = () => {
	const [callDemoKey, setCallDemoKey] = useState(() => Date.now());
	const [callDemoMode, setCallDemoMode] = useState<"video" | "live">("video");
	const [activePreview, setActivePreview] = useState<PreviewType>("text");
	const [activeTextIndex, setActiveTextIndex] = useState(0);

	const advanceTextMessage = useCallback(() => {
		setActiveTextIndex((prev) => (prev + 1) % TEXT_DEMO_MESSAGES_COUNT);
	}, []);

	const handleRestartCallDemo = useCallback(() => {
		setActivePreview("call");
		setCallDemoKey(Date.now());
		setCallDemoMode("live");
	}, []);

	const handleSwitchPreview = useCallback((type: PreviewType) => {
		setActivePreview(type);
		if (type === "text") {
			setCallDemoMode("video");
		}
	}, []);

	useEffect(() => {
		if (activePreview !== "text") {
			setActiveTextIndex(0);
		}
	}, [activePreview]);

	useInterval(advanceTextMessage, activePreview === "text" ? 3200 : null);

	const handleCallDemoComplete = useCallback(() => {
		setCallDemoMode("video");
	}, []);

	const renderPreview = useCallback(() => {
		if (activePreview === "text") {
			return (
				<div className="flex w-full items-center justify-center text-slate-900 dark:text-white">
					<Iphone
						aria-label="Text demo preview"
						className="w-full max-w-[28rem] drop-shadow-[0_30px_90px_rgba(15,23,42,0.45)] dark:drop-shadow-[0_30px_90px_rgba(15,23,42,0.65)]"
						colorScheme="dark"
					>
						<>
							<div className="pointer-events-none absolute inset-x-8 top-6 flex justify-center">
								<div
									className={cn(
										"rounded-full px-3 py-1",
										"font-semibold text-[10px] text-white uppercase tracking-[0.3em]",
										"bg-slate-900/70 backdrop-blur",
									)}
								>
									Text Demo
								</div>
							</div>
							<div className="flex h-full flex-col justify-end overflow-hidden rounded-[28px] bg-gradient-to-b from-slate-100/90 to-white/95 p-6 shadow-inner backdrop-blur-sm dark:bg-slate-950/85 dark:from-slate-950/85 dark:to-black/90 dark:shadow-none">
								<AnimatedList
									delay={220}
									className="flex w-full flex-col gap-3"
								>
									{TEXT_DEMO_MESSAGES.map((message, index) => (
										<div
											key={`${message.sender}-${index}`}
											className={cn(
												"flex w-full",
												message.sender === "AI"
													? "justify-start"
													: "justify-end",
											)}
										>
											<div
												className={cn(
													"max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-snug shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition-all duration-500",
													message.sender === "AI"
														? "bg-sky-100 text-slate-900 dark:bg-sky-900/70 dark:text-sky-100"
														: "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-200",
													activeTextIndex === index && "ring-2",
													activeTextIndex === index && "ring-sky-300/70",
													activeTextIndex === index && "scale-[1.02]",
													activeTextIndex === index &&
														"shadow-[0_12px_24px_rgba(56,189,248,0.25)]",
												)}
											>
												<p className="whitespace-pre-line">{message.text}</p>
											</div>
										</div>
									))}
								</AnimatedList>
								<div className="mt-3 text-center font-semibold text-[10px] text-slate-500 uppercase tracking-[0.3em] dark:text-slate-300">
									<span>DealScale AI • Live Seller Outreach</span>
								</div>
								<div className="mt-1 flex justify-center">
									<SparklesText
										className="font-semibold text-[10px] text-sky-500 uppercase tracking-[0.35em] dark:text-sky-200"
										sparklesCount={8}
										colors={{ first: "#38bdf8", second: "#f97316" }}
									>
										iMessage Support
									</SparklesText>
								</div>
							</div>
						</>
					</Iphone>
				</div>
			);
		}

		if (callDemoMode === "video") {
			return (
				<div className="flex w-full items-center justify-center text-slate-900 dark:text-white">
					<Iphone
						aria-label="Call demo preview"
						className="w-full max-w-[28rem] drop-shadow-[0_35px_100px_rgba(15,23,42,0.45)] dark:drop-shadow-[0_35px_100px_rgba(15,23,42,0.65)]"
						colorScheme="dark"
					>
						<>
							<iframe
								title="Call demo playlist preview"
								className="size-full"
								src={CALL_DEMO_PLAYLIST_SRC}
								loading="lazy"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
								frameBorder="0"
								aria-label="Call demo video playlist"
							/>
							<div className="pointer-events-none absolute inset-x-8 top-6 flex justify-center">
								<div
									className={cn(
										"rounded-full px-3 py-1",
										"font-semibold text-[10px] text-white uppercase tracking-[0.3em]",
										"bg-slate-950/55 backdrop-blur",
									)}
								>
									Live Preview
								</div>
							</div>
						</>
					</Iphone>
				</div>
			);
		}

		return (
			<div className="flex w-full items-center justify-center text-slate-900 dark:text-white">
				<Iphone
					aria-label="Call demo preview"
					className="w-full max-w-[28rem] drop-shadow-[0_35px_100px_rgba(15,23,42,0.45)] dark:drop-shadow-[0_35px_100px_rgba(15,23,42,0.65)]"
					colorScheme="dark"
				>
					<>
						<div className="pointer-events-none absolute inset-x-8 top-6 flex justify-center">
							<div
								className={cn(
									"rounded-full px-3 py-1",
									"font-semibold text-[10px] text-white uppercase tracking-[0.3em]",
									"bg-slate-950/65 backdrop-blur",
								)}
							>
								Live Call Demo
							</div>
						</div>
						<div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-900/50 bg-slate-950/85 p-3 text-white shadow-[0_30px_90px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-slate-950/90">
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40 dark:from-white/10 dark:via-transparent dark:to-black/60" />
							<div className="relative flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-black/35 p-2 shadow-inner dark:bg-black/25">
								<SessionMonitor
									key={callDemoKey}
									transcript={demoTranscript}
									autoStart
									showCompletionModal={false}
									onCallEnd={handleCallDemoComplete}
								/>
							</div>
						</div>
					</>
				</Iphone>
			</div>
		);
	}, [
		activePreview,
		activeTextIndex,
		callDemoKey,
		callDemoMode,
		handleCallDemoComplete,
	]);

	const cards = useMemo(
		() => [
			{
				id: 1,
				className: "relative col-span-1 flex flex-col p-6 md:col-span-2",
				contentClassName: "flex h-full flex-col gap-6",
				content: (
					<div className="relative z-20 flex h-full flex-col gap-8">
						<div className="flex flex-col gap-3 text-balance md:items-center md:text-center">
							<p className="font-medium text-slate-500 text-sm uppercase tracking-[0.3em] dark:text-white/60">
								{AI_OUTREACH_STUDIO_HEADING}
							</p>
							<h2 className="font-semibold text-3xl text-slate-900 md:text-4xl lg:text-5xl dark:text-white">
								{AI_OUTREACH_STUDIO_TAGLINE}
							</h2>
							<p className="max-w-sm text-base text-slate-600 md:mx-auto md:max-w-2xl md:text-lg dark:text-white/70">
								{AI_OUTREACH_STUDIO_DESCRIPTION}
							</p>
						</div>
						<div className="flex flex-col gap-6">
							<div className="grid gap-4 text-slate-600 text-sm sm:grid-cols-3 dark:text-white/70">
								{AI_OUTREACH_STUDIO_FEATURES.map((feature) => (
									<div
										key={feature.title}
										className="rounded-xl border border-slate-200/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
									>
										<h3 className="font-semibold text-slate-900 text-sm uppercase tracking-[0.18em] dark:text-white">
											{feature.title}
										</h3>
										<p className="mt-2 text-slate-600 text-xs leading-relaxed dark:text-white/70">
											{feature.description}
										</p>
									</div>
								))}
							</div>
							<div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-5 text-slate-900 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white">
								<p className="text-slate-500 text-xs uppercase tracking-[0.25em] dark:text-white/60">
									Session Monitor
								</p>
								<h3 className="mt-2 font-semibold text-slate-900 text-xl dark:text-white">
									Automate your follow-ups, not your relationships.
								</h3>
								<p className="mt-3 text-slate-600 text-sm dark:text-white/70">
									Build call and SMS workflows in seconds. Customize tone,
									timing, and goals, then let DealScale handle the outreach and
									sync every interaction directly to your CRM.
								</p>
								<div className="mt-4 flex flex-col items-start gap-4 rounded-xl bg-slate-900/5 p-4 text-slate-700 text-sm dark:bg-black/30 dark:text-white/70 sm:flex-row sm:items-center">
									<Image
										src="/avatars/Customer.jpg"
										alt="Customer avatar"
										width={40}
										height={40}
										className="size-10 rounded-full border border-slate-200/80 object-cover dark:border-white/20"
									/>
									<div className="flex flex-col gap-2 text-left">
										<p className="text-slate-900 text-sm leading-relaxed dark:text-white">
											💬 “Hey Sarah, it’s Ava from Metro Home Team. Still open to
											an offer on 2143 W Elm St this month?”
										</p>
										<p className="text-slate-500 text-[11px] uppercase tracking-[0.18em] dark:text-white/50 sm:text-xs">
											🧠 Auto-response ready, synced with your CRM.
										</p>
									</div>
								</div>
								<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
									<button
										type="button"
										onClick={handleRestartCallDemo}
										className="inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-2 font-medium text-slate-900 text-sm transition hover:bg-white"
										aria-pressed={activePreview === "call"}
									>
										Start a Call Demo
									</button>
									<button
										type="button"
										onClick={() => handleSwitchPreview("text")}
										className={cn(
											"inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-transparent px-5 py-2 font-medium text-slate-900 text-sm transition hover:border-slate-900/40 hover:bg-slate-900/5 dark:border-white/40 dark:text-white dark:hover:border-white dark:hover:bg-white/10",
											activePreview === "text" &&
												"border-slate-900 bg-slate-900/10 text-slate-900 dark:border-white dark:bg-white/20 dark:text-white",
										)}
										aria-pressed={activePreview === "text"}
									>
										Try a Text Demo
									</button>
								</div>
							</div>
						</div>
					</div>
				),
			},
			{
				id: 2,
				className: "col-span-1 flex items-center justify-center",
				contentClassName:
					"flex h-full w-full items-center justify-center bg-transparent",
				content: renderPreview(),
			},
		],
		[activePreview, handleRestartCallDemo, handleSwitchPreview, renderPreview],
	);

	return (
		<>
			<section
				id={AI_OUTREACH_STUDIO_ANCHOR}
				className="relative isolate overflow-hidden py-24"
			>
				<div className="-z-10 pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_55%)]" />
				<div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 text-center sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl space-y-4">
						<p className="font-semibold text-sky-500 text-sm uppercase tracking-[0.3em]">
							AI Outreach Studio
						</p>
						<h2 className="font-semibold text-4xl text-slate-900 tracking-tight sm:text-5xl dark:text-white">
							Generate calls & texts with AI
						</h2>
						<p className="text-base text-slate-600 sm:text-lg dark:text-white/70">
							Launch live call and text demos powered by DealScale’s outreach
							engine. Keep messaging aligned with lead intent, then hand off to
							your team with CRM-ready notes.
						</p>
						<ul className="grid gap-3 text-slate-600 text-sm sm:grid-cols-3 sm:text-base dark:text-white/70">
							<li className="rounded-xl border border-slate-200/40 bg-white/40 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
								Generate personalized follow-ups from prompts or CRM data.
							</li>
							<li className="rounded-xl border border-slate-200/40 bg-white/40 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
								Switch tones, timing, and channels without losing context.
							</li>
							<li className="rounded-xl border border-slate-200/40 bg-white/40 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
								Monitor conversations live with AI-assisted insights.
							</li>
						</ul>
					</div>
					<LayoutGrid
						cards={cards}
						interactive={false}
						showThumbnails={false}
						baseCardClassName="rounded-none bg-transparent"
					/>
				</div>
			</section>
		</>
	);
};

CallDemoShowcase.displayName = "CallDemoShowcase";
