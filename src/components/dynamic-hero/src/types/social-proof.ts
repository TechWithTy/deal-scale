"use client";

export interface HeroSocialProofAvatar {
	readonly imageUrl: string;
	readonly profileUrl: string;
}

export interface HeroSocialProofReview {
	readonly title: string;
	readonly subtitle?: string;
	readonly quote?: string;
	readonly rating?: number;
}

export interface HeroSocialProof {
	readonly avatars: HeroSocialProofAvatar[];
	readonly numPeople?: number;
	readonly caption?: string;
	readonly reviews?: HeroSocialProofReview[];
}
