import { betaTesterFormFields } from "@/data/contact/formFields";
import type React from "react";

interface VariablesComponentProps {
	onInsert: (value: string) => void;
	// Optionally allow customizing which sets to show
	showTools?: boolean;
	showVariables?: boolean;
	showContactFields?: boolean;
}

const TOOLS = [
	{ label: "send_email", icon: "build" },
	{ label: "update_lead", icon: "build" },
	{ label: "create_task", icon: "build" },
];

const VARIABLES = [
	{ label: "input_leads", icon: "code" },
	{ label: "user_email", icon: "code" },
	{ label: "workflow_id", icon: "code" },
];

const CONTACT_FIELDS = betaTesterFormFields
	.filter((f) => ["text", "email", "tel", "select"].includes(f.type))
	.map((f) => ({ label: f.name, icon: "person", title: f.label }));

export const VariablesComponent: React.FC<VariablesComponentProps> = ({
	onInsert,
	showTools = true,
	showVariables = true,
	showContactFields = true,
}) => (
	<div className="mb-2 flex flex-col gap-1">
		{showTools && (
			<div className="flex flex-wrap items-center gap-2">
				<span className="mr-1 font-semibold text-gray-500 text-xs">Tools:</span>
				{TOOLS.map((tool) => (
					<button
						key={tool.label}
						type="button"
						className="flex cursor-pointer select-none items-center gap-1 rounded-full border-2 border-primary bg-primary/10 px-2 py-1 font-bold text-primary text-xs shadow-sm transition hover:bg-primary/20 focus:ring-2 focus:ring-primary dark:bg-primary/30"
						style={{ outline: "none" }}
						onClick={() => onInsert(tool.label)}
						title={tool.label}
					>
						<span className="material-symbols-outlined text-base">
							{tool.icon}
						</span>
						{tool.label}
					</button>
				))}
			</div>
		)}
		{showVariables && (
			<div className="mt-1 flex flex-wrap items-center gap-2">
				<span className="mr-1 font-semibold text-gray-500 text-xs">
					Variables:
				</span>
				{VARIABLES.map((variable) => (
					<button
						key={variable.label}
						type="button"
						className="flex cursor-pointer select-none items-center gap-1 rounded-full border-2 border-blue-400 bg-blue-100 px-2 py-1 font-bold text-blue-700 text-xs shadow-sm transition hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
						style={{ outline: "none" }}
						onClick={() => onInsert(variable.label)}
						title={variable.label}
					>
						<span className="material-symbols-outlined text-base">
							{variable.icon}
						</span>
						{variable.label}
					</button>
				))}
			</div>
		)}
		{showContactFields && (
			<div className="mt-1 flex flex-wrap items-center gap-2">
				<span className="mr-1 font-semibold text-gray-500 text-xs">
					Contact Fields:
				</span>
				{CONTACT_FIELDS.map((field) => (
					<button
						key={field.label}
						type="button"
						className="flex cursor-pointer select-none items-center gap-1 rounded-full border-2 border-green-400 bg-green-100 px-2 py-1 font-bold text-green-700 text-xs shadow-sm transition hover:bg-green-200 focus:ring-2 focus:ring-green-400 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
						style={{ outline: "none" }}
						onClick={() => onInsert(field.label)}
						title={field.title}
					>
						<span className="material-symbols-outlined text-base">
							{field.icon}
						</span>
						{field.label}
					</button>
				))}
			</div>
		)}
	</div>
);

export default VariablesComponent;
