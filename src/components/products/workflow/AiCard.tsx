import { longTermAbsenteeOwnerNurtureDsl } from "@/data/worklow/dsl";
import type React from "react";
import VariablesComponent from "./VariablesComponent";

interface AiCardProps {
	aiPrompt: string;
	setAiPrompt: (v: string) => void;
	insertAtCursor: (item: string) => void;
	showExamplePrompt: boolean;
	setShowExamplePrompt: (v: boolean) => void;
	aiPromptRef?: React.RefObject<HTMLTextAreaElement>;
	aiResult?: string;
}

const AiCard: React.FC<AiCardProps> = ({
	aiPrompt,
	setAiPrompt,
	insertAtCursor,
	showExamplePrompt,
	setShowExamplePrompt,
	aiPromptRef,
	aiResult,
}) => (
	<div className="flex animate-fadein flex-col gap-2">
		<label htmlFor="ai-prompt" className="mb-1 block font-medium">
			AI Prompt{" "}
			<span className="text-gray-500 text-xs">
				(describe logic, click a tool or variable to insert)
			</span>
		</label>
		{/* Modular variables/tools/contact fields UI */}
		<VariablesComponent onInsert={insertAtCursor} />
		<textarea
			ref={aiPromptRef}
			className="min-h-[100px] rounded border bg-white px-3 py-2 font-mono dark:bg-[#181825]"
			placeholder={
				"Write a Lua script or describe your automation logic.\nE.g., use send_email, update_lead, etc."
			}
			value={aiPrompt}
			onChange={(e) => setAiPrompt(e.target.value)}
			required
		/>
		{/* AI Result Message Box */}
		{aiResult && (
			<div className="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-blue-900 text-sm shadow-inner dark:border-blue-700 dark:bg-blue-900 dark:text-blue-100">
				<span className="mb-1 block font-semibold text-blue-700 dark:text-blue-200">
					AI Result:
				</span>
				<span className="whitespace-pre-line">{aiResult}</span>
			</div>
		)}
		{/* Example prompt toggle */}
		<div className="mt-2">
			<button
				type="button"
				className="mb-1 font-semibold text-primary text-xs underline hover:text-primary/80"
				onClick={() => setShowExamplePrompt(!showExamplePrompt)}
			>
				{showExamplePrompt ? "Hide Example" : "Show Example"}
			</button>
			{showExamplePrompt && (
				<>
					<span className="block text-gray-500 text-xs">Example prompt:</span>
					<pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded border border-gray-200 bg-gray-100 p-3 font-mono text-xs dark:border-gray-700 dark:bg-[#232336]">
						{longTermAbsenteeOwnerNurtureDsl}
					</pre>
				</>
			)}
		</div>
	</div>
);

export default AiCard;
