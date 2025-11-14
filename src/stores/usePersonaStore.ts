"use client";

import { create } from "zustand";
import {
	DEFAULT_PERSONA_KEY,
	PERSONA_GOALS,
	type PersonaKey,
} from "@/data/personas/catalog";

const deriveGoal = (persona: PersonaKey): string =>
	PERSONA_GOALS[persona] ?? PERSONA_GOALS[DEFAULT_PERSONA_KEY];

const INITIAL_STATE = {
	persona: DEFAULT_PERSONA_KEY,
	goal: deriveGoal(DEFAULT_PERSONA_KEY),
} as const;

interface PersonaState {
	persona: PersonaKey;
	goal: string;
	setPersona: (persona: PersonaKey) => void;
	setGoal: (goal: string) => void;
	setPersonaAndGoal: (persona: PersonaKey, goal: string) => void;
	reset: () => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
	...INITIAL_STATE,
	setPersona: (persona) =>
		set({
			persona,
			goal: deriveGoal(persona),
		}),
	setGoal: (goal) => set({ goal }),
	setPersonaAndGoal: (persona, goal) => set({ persona, goal }),
	reset: () => set({ ...INITIAL_STATE }),
}));

export const resetPersonaStore = () => usePersonaStore.getState().reset();

