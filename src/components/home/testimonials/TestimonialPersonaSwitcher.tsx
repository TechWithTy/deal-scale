"use client";

import { PERSONA_DISPLAY_ORDER, PERSONA_LABELS } from "@/data/personas/catalog";
import { cn } from "@/lib/utils";
import { usePersonaStore } from "@/stores/usePersonaStore";
import { motion, useReducedMotion } from "framer-motion";

export const PersonaSwitcher = () => {
	const { persona, setPersona } = usePersonaStore();
	const shouldReduceMotion = useReducedMotion();

	return (
		<div className="relative flex w-full max-w-lg items-center justify-center rounded-full border border-black/10 bg-white/80 p-1 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
			{PERSONA_DISPLAY_ORDER.map((option) => {
				const isActive = option === persona;

				return (
					<button
						key={option}
						type="button"
						className={cn(
							"relative z-10 flex flex-1 items-center justify-center rounded-full px-4 py-2 font-medium text-xs uppercase tracking-wide transition-colors sm:text-sm",
							isActive
								? "text-black dark:text-white"
								: "text-black/70 hover:text-black focus-visible:text-black dark:text-white/80 dark:focus-visible:text-white dark:hover:text-white",
						)}
						onClick={() => setPersona(option)}
						aria-pressed={isActive}
					>
						{isActive && (
							<motion.span
								layoutId="persona-active-pill"
								className="absolute inset-0 rounded-full bg-primary/20 shadow-[0_0_25px_rgba(93,132,255,0.3)] dark:bg-gradient-to-r dark:from-primary/40 dark:via-primary/20 dark:to-primary/40 dark:shadow-[0_0_25px_rgba(93,132,255,0.45)]"
								transition={
									shouldReduceMotion
										? { duration: 0 }
										: { type: "spring", stiffness: 250, damping: 25 }
								}
							/>
						)}
						<span className="relative z-10">{PERSONA_LABELS[option]}</span>
					</button>
				);
			})}
		</div>
	);
};

PersonaSwitcher.displayName = "PersonaSwitcher";
