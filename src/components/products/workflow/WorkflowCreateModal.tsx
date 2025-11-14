import { betaTesterFormFields } from "@/data/contact/formFields";
// WorkflowCreateModal.tsx
// * Modal to create and submit a workflow for monetization
import { longTermAbsenteeOwnerNurtureDsl } from "@/data/worklow/dsl";
import React, { useState } from "react";
import AiCard from "./AiCard";
import TestingCard from "./TestingCard";
import VariablesComponent from "./VariablesComponent";

interface WorkflowCreateModalProps {
	open: boolean;
	onClose: () => void;
}

const WorkflowCreateModal: React.FC<WorkflowCreateModalProps> = ({
	open,
	onClose,
}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [aiPrompt, setAiPrompt] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	// Step: 'form' | 'testing' | 'fail' | 'success'
	const [step, setStep] = useState<"form" | "testing" | "fail" | "success">(
		"form",
	);
	// * File upload state
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	// * Show/hide AI prompt & example prompt
	const [showAIPrompt, setShowAIPrompt] = useState(false);
	// * AI result message
	const [aiResult, setAiResult] = useState<string>("");
	// * Show/hide Example prompt
	const [showExamplePrompt, setShowExamplePrompt] = useState(false);

	// Example Lua script prompt

	// Ref for textarea to insert tool at cursor
	const aiPromptRef = React.useRef<HTMLTextAreaElement>(null);

	// Insert tool or variable at cursor, wrapped in curly braces for visual distinction
	function insertAtCursor(item: string) {
		const textarea = aiPromptRef.current;
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const before = aiPrompt.slice(0, start);
		const after = aiPrompt.slice(end);
		// ! Always wrap inserted items in curly braces for clarity
		const wrapped = `{${item}}`;
		const newValue = before + wrapped + after;
		setAiPrompt(newValue);
		setTimeout(() => {
			textarea.focus();
			textarea.selectionStart = textarea.selectionEnd = start + wrapped.length;
		}, 0);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setStep("testing");
		// Simulate testing (random success/fail after 1.5s)
		setTimeout(() => {
			setSubmitting(false);
			if (Math.random() < 0.5) {
				setStep("fail");
			} else {
				setStep("success");
			}
		}, 1500);
	};

	const handleRetry = () => {
		setStep("form");
		setSuccess(false);
		setSubmitting(false);
	};

	// Reset state when modal opens
	React.useEffect(() => {
		if (open) {
			setStep("form");
			setSuccess(false);
			setSubmitting(false);
			setUploadedFile(null);
			setName("");
			setDescription("");
			setAiPrompt("");
		}
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-8 shadow-xl dark:bg-[#181825]">
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-gray-400 text-xl hover:text-gray-700"
					aria-label="Close"
				>
					×
				</button>
				{step === "testing" || step === "fail" || step === "success" ? (
					<TestingCard status={step} onRetry={handleRetry} onClose={onClose} />
				) : (
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<h2 className="mb-2 font-semibold text-xl">
							Monetize Your Workflow
						</h2>
						<input
							className="rounded border px-3 py-2"
							placeholder="Workflow Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<textarea
							className="rounded border px-3 py-2"
							placeholder="Describe your workflow..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>

						{/* File upload for document files */}
						<div className="mb-2 flex flex-col gap-1">
							<label className="mb-1 block font-medium">
								Attach Document{" "}
								<span className="text-gray-500 text-xs">(PDF, DOCX, TXT)</span>
							</label>
							<input
								type="file"
								accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
								className="file:mr-2 file:cursor-pointer file:rounded-full file:border-2 file:border-primary file:bg-primary/10 file:px-3 file:py-1 file:font-semibold file:text-primary file:text-xs"
								onChange={(e) =>
									setUploadedFile(
										e.target.files && e.target.files[0]
											? e.target.files[0]
											: null,
									)
								}
							/>
							{uploadedFile && (
								<span className="mt-1 text-green-700 text-xs dark:text-green-300">
									Selected: {uploadedFile.name}
								</span>
							)}
						</div>

						{/* Generate with AI Button */}
						<button
							type="button"
							className="mb-2 w-full rounded bg-primary px-4 py-2 font-bold text-white shadow-md transition hover:bg-primary/80"
							onClick={() => {
								setShowAIPrompt((v) => {
									const next = !v;
									if (next)
										setAiResult(
											"// AI generated workflow logic example...\nfunction run() {\n  // ...\n}",
										);
									return next;
								});
							}}
							aria-expanded={showAIPrompt}
						>
							{showAIPrompt ? "Hide AI Prompt" : "Generate with AI"}
						</button>

						{/* AI Prompt and Example Prompt Section (collapsible) */}
						{showAIPrompt && (
							<AiCard
								aiPrompt={aiPrompt}
								setAiPrompt={setAiPrompt}
								insertAtCursor={insertAtCursor}
								showExamplePrompt={showExamplePrompt}
								setShowExamplePrompt={setShowExamplePrompt}
								aiPromptRef={aiPromptRef}
								aiResult={aiResult}
							/>
						)}

						<button
							type="submit"
							className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
							disabled={submitting}
						>
							{submitting ? "Submitting..." : "Submit for Monetization"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default WorkflowCreateModal;
