"use client";

import { create } from "zustand";
import type { PersonaKey } from "@/data/personas/testimonialsByPersona";

const DEFAULT_GOAL = "";
export const DEFAULT_PERSONA: PersonaKey = "Investor";

interface PersonaState {
	persona: PersonaKey;
	goal: string;
	setPersona: (persona: PersonaKey) => void;
	setGoal: (goal: string) => void;
	setPersonaAndGoal: (persona: PersonaKey, goal: string) => void;
	reset: () => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
	persona: DEFAULT_PERSONA,
	goal: DEFAULT_GOAL,
	setPersona: (persona) => set({ persona }),
	setGoal: (goal) => set({ goal }),
	setPersonaAndGoal: (persona, goal) => set({ persona, goal }),
	reset: () => set({ persona: DEFAULT_PERSONA, goal: DEFAULT_GOAL }),
}));

export const resetPersonaStore = () => usePersonaStore.getState().reset();

