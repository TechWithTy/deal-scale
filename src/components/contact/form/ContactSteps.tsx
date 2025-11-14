// src/components/contact/ContactSteps.tsx
// ! ContactSteps component now takes steps as a typed prop
// * Enforces type safety and renders dynamic step numbers
import React from "react";

// ? Step type definition for type safety
export interface ContactStep {
	number: number;
	title: string;
	description: string;
}

// ? Props interface for ContactSteps
interface ContactStepsProps {
	steps: ContactStep[];
	title?: string; // * Optional override for main heading
}

/**
 * ContactSteps displays a sequence of steps with dynamic step numbers.
 * @param steps - Array of step objects to display
 * @param title - Optional heading override
 */
// ! Defensive: steps must be defined and an array
export function ContactSteps({ steps, title }: ContactStepsProps) {
	if (!Array.isArray(steps) || steps.length === 0) {
		// ? Optionally render a fallback or nothing
		return null;
	}
	return (
		<div className="mb-8 rounded-xl border border-white/10 bg-background-dark/50 p-8 backdrop-blur-sm">
			<h2 className="mb-6 text-center font-bold text-2xl text-black dark:text-white">
				{title || "What's Next?"}
			</h2>
			<div className="space-y-6">
				{steps.map((step, idx) => (
					<div key={step.number} className="flex gap-4">
						<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
							{/* * Render step number dynamically, 1-based */}
							<span className="font-bold text-lg text-primary">{idx + 1}</span>
						</div>
						<div>
							<h3 className="font-semibold text-black text-lg dark:text-white/70">
								{step.title}
							</h3>
							<p className="text-black text-sm dark:text-white/70">
								{step.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
// ! Important: Always pass a valid steps array to ContactSteps to avoid runtime errors.

// todo: Update all usages to pass steps prop and remove betaSignupSteps dependency
