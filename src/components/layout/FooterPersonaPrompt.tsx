"use client";

import { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "@/components/ui/magic/sparkles";
import {
	ALL_PERSONA_KEYS,
	PERSONA_LABELS,
	type PersonaKey,
} from "@/data/personas/catalog";
import { usePersonaStore } from "@/stores/usePersonaStore";
import { cn } from "@/lib/utils";

const personaOptions: PersonaKey[] = ALL_PERSONA_KEYS;

export function FooterPersonaPrompt({ className }: { className?: string }) {
	const [open, setOpen] = useState(false);
	const { persona, setPersona } = usePersonaStore();

	const activePersonaLabel = PERSONA_LABELS[persona] ?? "Select persona";

	const handleSelectPersona = (key: PersonaKey) => {
		setPersona(key);
		setOpen(false);
	};

	return (
		<div
			className={cn(
				"flex flex-col items-center gap-2 text-center text-xs text-muted-foreground sm:text-sm md:items-start md:text-left",
				className,
			)}
		>
			<p className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-wide text-primary dark:text-emerald-200 md:justify-start">
				Personalized experience for
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"relative flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary shadow-sm transition-all hover:border-primary hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-emerald-200/40 dark:bg-emerald-200/10 dark:text-emerald-200",
						"after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-full after:bg-primary/30 after:opacity-0 after:blur-lg after:transition-opacity after:content-[''] hover:after:opacity-40",
					)}
					onClick={() => setOpen(true)}
				>
					<Sparkles
						className="h-4 w-4 text-primary dark:text-emerald-200"
						aria-hidden="true"
					/>
					{activePersonaLabel}
					<Sparkles
						className="h-4 w-4 text-primary dark:text-emerald-200"
						aria-hidden="true"
					/>
				</Button>
			</p>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Who are you</DialogTitle>
						<DialogDescription>
							Select the persona that best matches your role. We&apos;ll personalize
							your experience instantly.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-3 sm:grid-cols-2">
						{personaOptions.map((key) => {
							const label = PERSONA_LABELS[key];
							const isActive = key === persona;
							return (
								<Button
									key={key}
									variant={isActive ? "default" : "outline"}
									className={cn(
										"justify-start rounded-xl border border-primary/20 bg-background/80 py-4 text-left text-sm transition hover:border-primary hover:bg-primary/10",
										isActive && "shadow-lg",
									)}
									onClick={() => handleSelectPersona(key)}
								>
									{label}
								</Button>
							);
						})}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

