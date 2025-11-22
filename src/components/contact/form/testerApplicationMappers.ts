import type { BetaTesterFormValues } from "@/data/contact/formFields";
import type { PriorityPilotFormValues } from "@/data/contact/pilotFormFields";
import type { TesterApplicationRequest } from "@/types/testers";

interface BetaExtras {
	featureVotes?: string[];
}

interface PilotExtras {
	termsAccepted?: boolean;
	wantedFeatures?: string[];
	featureVotes?: string[];
}

const sanitizeArray = (values?: string[] | null): string[] => {
	if (!Array.isArray(values)) {
		return [];
	}
	return values
		.map((value) => value.trim())
		.filter((value) => value.length > 0);
};

export const mapBetaTesterApplication = (
	data: BetaTesterFormValues,
	extras: BetaExtras = {},
): TesterApplicationRequest => {
	const wantedFeatures = sanitizeArray(data.wantedFeatures);
	const featureVotes = sanitizeArray(extras.featureVotes);

	const payload: TesterApplicationRequest = {
		tester_type: "beta",
		company: data.companyName.trim(),
		icp_type: data.icpType,
		employee_count: data.employeeCount,
		deals_closed_last_year: data.avgDealsClosedPerMonth,
		pain_points: sanitizeArray(data.painPoints),
		terms_accepted: Boolean(data.termsAccepted),
	};

	if (wantedFeatures.length > 0) {
		payload.wanted_features = wantedFeatures;
	}

	if (featureVotes.length > 0) {
		payload.interested_features = featureVotes;
	}

	return payload;
};

export const mapPilotTesterApplication = (
	data: PriorityPilotFormValues,
	extras: PilotExtras = {},
): TesterApplicationRequest => {
	const wantedFeatures = sanitizeArray(extras.wantedFeatures);
	const featureVotes = sanitizeArray(extras.featureVotes);

	const payload: TesterApplicationRequest = {
		tester_type: "pilot",
		company: data.companyName.trim(),
		icp_type: data.icpType,
		employee_count: data.teamSizeAcquisitions,
		deals_closed_last_year: data.avgDealsClosedPerMonth,
		pain_points: sanitizeArray(data.primaryChallenge),
		terms_accepted: extras.termsAccepted ?? true,
		team_size_acquisitions: data.teamSizeAcquisitions,
		primary_deal_sources: sanitizeArray(data.primaryDealSources),
		current_crm: data.currentCRM,
		feedback_commitment: data.feedbackCommitment,
		payment_agreement: data.paymentAgreement,
		success_metrics: data.successMetrics.trim(),
	};

	if (wantedFeatures.length > 0) {
		payload.wanted_features = wantedFeatures;
	}

	if (featureVotes.length > 0) {
		payload.interested_features = featureVotes;
	}

	return payload;
};
