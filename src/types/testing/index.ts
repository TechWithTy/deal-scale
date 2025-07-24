import type { FacebookPixelUser } from "@/types/metrics/facebook_pixel";

export interface AbTestKpi {
	name: string;
	value: number;
	goal?: number;
	unit?: string;
}
export interface ABTestCopy {
	cta: string;
	buttonCta?: string;
	tagline?: string;
	subtitle?: string;
	description?: string;
	whatsInItForMe: string;
	target_audience: string;
	pain_point: string;
	solution: string;
	highlights?: string[];
	highlighted_words?: string[];
	additionalInfo?: string;
	aiGenerated?: {
		model: string;
		version: string;
		date: string;
		params: Record<string, unknown>;
	};
}
export interface AbTestVariant {
	name: string;
	percentage: number;
	copy?: ABTestCopy;
	variant_description?: string;
	kpis?: AbTestKpi[];
}

export interface ABTest {
	id: string;
	name: string;
	description?: string;
	variants: AbTestVariant[];
	startDate: Date;
	endDate?: Date;
	isActive: boolean;
	facebookPixelUsers?: FacebookPixelUser[];
	targetAudience?: string;
	kpis?: AbTestKpi[];
	tags?: string[];
	[key: string]: unknown;
}
