"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const PixelatedVoiceCloneCard = dynamic(
	() =>
		import("@/components/ui/pixelated-voice-clone-card").then((module) => ({
			default: module.PixelatedVoiceCloneCard,
		})),
	{
		ssr: false,
		loading: () => (
			<div className="mt-16 flex w-full justify-center">
				<div className="h-[28rem] w-full max-w-5xl animate-pulse rounded-3xl bg-slate-900/10" />
			</div>
		),
	},
);

export default function PixelatedVoiceCloneCardDebugPage() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
			<header className="space-y-4">
				<p className="font-semibold text-slate-500 text-xs uppercase tracking-[0.42em] dark:text-slate-300">
					Debug / Components
				</p>
				<h1 className="font-bold text-3xl text-slate-900 tracking-tight sm:text-4xl dark:text-white">
					Pixelated Voice Clone Card Debugger
				</h1>
				<p className="max-w-3xl text-slate-600 text-sm leading-relaxed dark:text-slate-300">
					This standalone view renders the{" "}
					<code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-900">
						PixelatedVoiceCloneCard
					</code>{" "}
					without the hero headline carousel, so we can inspect flicker,
					re-render logs, and performance hotspots in isolation. Open the
					browser console to observe instrumentation output.
				</p>
			</header>
			<section className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/60">
				<h2 className="font-semibold text-lg text-slate-800 dark:text-white">
					Live Component
				</h2>
				<p className="mt-2 text-slate-600 text-sm dark:text-slate-300">
					Interact with the card below to reproduce flicker. Pay attention to
					console logs for render counts, prop diffs, and audio state
					transitions.
				</p>
				<Suspense>
					<PixelatedVoiceCloneCard className="mt-12" />
				</Suspense>
			</section>
			<section className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/60">
				<h2 className="font-semibold text-lg text-slate-800 dark:text-white">
					Observability Checklist
				</h2>
				<ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600 text-sm dark:text-slate-300">
					<li>
						Confirm render counters only increment when expected (audio
						playback, interaction toggles, custom image uploads).
					</li>
					<li>
						Hover the text reveal card in the main site versus this page to
						compare render behavior.
					</li>
					<li>
						Capture performance profiles (Performance tab) with this isolated
						route to benchmark baseline frame times.
					</li>
					<li>
						Document findings in{" "}
						<code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-900">
							_debug/perf-pixelated-voice-card.md
						</code>
						.
					</li>
				</ul>
			</section>
		</main>
	);
}



