"use client";

import { create } from "zustand";

import { DEFAULT_HERO_VIDEO } from "../components/hero-video-preview";
import type { HeroVideoConfig } from "../types/video";

interface HeroVideoStoreState {
	config: HeroVideoConfig | null;
	setConfig: (config: HeroVideoConfig | null) => void;
	reset: () => void;
}

const useHeroVideoStoreBase = create<HeroVideoStoreState>((set) => ({
	config: null,
	setConfig: (config) => set({ config }),
	reset: () => set({ config: null }),
}));

export const setHeroVideoConfig = (config: HeroVideoConfig | null) =>
	useHeroVideoStoreBase.getState().setConfig(config);

export const resetHeroVideoConfig = () =>
	useHeroVideoStoreBase.getState().reset();

export const useHeroVideoConfig = (
	fallback: HeroVideoConfig = DEFAULT_HERO_VIDEO,
): HeroVideoConfig => {
	const config = useHeroVideoStoreBase((state) => state.config);
	return config ?? fallback;
};




