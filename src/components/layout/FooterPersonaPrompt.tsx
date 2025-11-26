"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "@/components/ui/magic/sparkles";
import {
	ALL_PERSONA_KEYS,
	PERSONA_LABELS,
	type PersonaKey,
} from "@/data/personas/catalog";
import { cn } from "@/lib/utils";
import { usePersonaStore } from "@/stores/usePersonaStore";

const personaOptions: PersonaKey[] = ALL_PERSONA_KEYS;

export function FooterPersonaPrompt({ className }: { className?: string }) {
	const [open, setOpen] = useState(false);
	const { persona, setPersona } = usePersonaStore();

	const activePersonaLabel = PERSONA_LABELS[persona] ?? "Select persona";

	// Debug: Log current persona for troubleshooting
	if (typeof window !== "undefined") {
		console.log("[FooterPersonaPrompt] Current persona:", persona, "Label:", activePersonaLabel);
	}

	const handleSelectPersona = (key: PersonaKey) => {
		setPersona(key);
		setOpen(false);
	};

	return (
		<div
			className={cn(
				"flex flex-col items-center gap-2 text-center text-muted-foreground text-xs sm:text-sm",
				className,
			)}
		>
			<p className="flex flex-wrap items-center justify-center gap-2 text-primary text-xs uppercase tracking-wide dark:text-emerald-200">
				Personalized experience for
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"relative flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs uppercase tracking-[0.12em] shadow-sm transition-all hover:border-primary hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-emerald-200/40 dark:bg-emerald-200/10 dark:text-emerald-200",
						"after:-inset-[3px] after:pointer-events-none after:absolute after:rounded-full after:bg-primary/30 after:opacity-0 after:blur-lg after:transition-opacity after:content-[''] hover:after:opacity-40",
						persona === "investor" &&
							"ring-2 ring-primary/50 ring-offset-2 dark:ring-emerald-200/50",
					)}
					onClick={() => setOpen(true)}
				>
					<Sparkles
						className="h-4 w-4 text-primary dark:text-emerald-200"
						aria-hidden="true"
					/>
					<span className="font-bold">{activePersonaLabel}</span>
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
							Select the persona that best matches your role. We&apos;ll
							personalize your experience instantly.
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
										"justify-start rounded-xl border py-4 text-left font-medium text-sm transition",
										isActive
											? "border-2 border-primary bg-primary text-white shadow-lg hover:bg-primary/90 dark:border-emerald-200 dark:bg-emerald-200 dark:text-gray-900 dark:hover:bg-emerald-200/90 [&>span]:!text-white [&>span]:dark:!text-gray-900"
											: "border-primary/20 bg-background/80 text-foreground hover:border-primary hover:bg-primary/10",
									)}
									onClick={() => handleSelectPersona(key)}
								>
									<span className={cn(isActive && "font-semibold")}>{label}</span>
									{isActive && (
										<span className="ml-auto text-xs font-bold opacity-90">
											✓
										</span>
									)}
								</Button>
							);
						})}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
