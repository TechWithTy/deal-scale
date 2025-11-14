"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
	PERSONA_DISPLAY_ORDER,
	PERSONA_LABELS,
} from "@/data/personas/catalog";
import { usePersonaStore } from "@/stores/usePersonaStore";
import { cn } from "@/lib/utils";

export const PersonaSwitcher = () => {
	const { persona, setPersona } = usePersonaStore();
	const shouldReduceMotion = useReducedMotion();

	return (
		<div className="relative flex w-full max-w-lg items-center justify-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
			{PERSONA_DISPLAY_ORDER.map((option) => {
				const isActive = option === persona;

				return (
					<button
						key={option}
						type="button"
						className={cn(
							"relative z-10 flex flex-1 items-center justify-center rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors sm:text-sm",
							isActive
								? "text-white"
								: "text-white/60 hover:text-white focus-visible:text-white",
						)}
						onClick={() => setPersona(option)}
						aria-pressed={isActive}
					>
						{isActive && (
							<motion.span
								layoutId="persona-active-pill"
								className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 shadow-[0_0_25px_rgba(93,132,255,0.45)]"
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

