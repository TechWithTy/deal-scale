import type { FacebookPixelUser } from "@/types/metrics/facebook_pixel";

export interface AbTestKpi {
	name: string;
	value: number;
	goal?: number;
	unit?: string;
}

export interface AbTestWarning {
	code: string;
	message: string;
	severity: "info" | "warning" | "error";
	variantName?: string;
	variantIndex?: number;
	field?: keyof ABTestCopy | "percentage" | "cta";
}

export interface AbTestAnalysisSummary {
	variantCount: number;
	totalPercentage: number;
	isBalanced: boolean;
	isActive: boolean;
}

export interface AbTestAnalysis {
	summary: AbTestAnalysisSummary;
	warnings: AbTestWarning[];
	normalized: boolean;
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
	hope: string;
	fear: string;
	highlights?: string[];
	highlighted_words?: string[];
	fears?: string[];
	pain_points?: string[];
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
	analysis?: AbTestAnalysis;
	[key: string]: unknown;
}
