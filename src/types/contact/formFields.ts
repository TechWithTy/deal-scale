// * Global base type for all contact form fields
// * Global base type for all contact form fields
export interface BaseField {
	name: string;
	label: string;
	type: string;
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	// * Indicates if the field contains sensitive information (e.g., SSN, account numbers)
	sensitive?: boolean;
	// * Optional regex pattern for validating input on the frontend
	pattern?: string;
}

export type TextInputField = BaseField & {
	type: "text" | "email" | "tel" | "url" | "password";
	value?: string;
	onChange?: (value: string) => void;
};

export type SelectField = BaseField & {
	type: "select";
	options: { value: string; label: string }[];
	value?: string;
	onChange?: (value: string) => void;
};

export type TextAreaField = BaseField & {
	type: "textarea";
	value?: string;
	onChange?: (value: string) => void;
};

export type CheckboxField = BaseField & {
	type: "checkbox";
	value?: boolean;
	onChange?: (checked: boolean) => void;
};

export interface FileField extends BaseField {
	type: "file";
	accept?: string;
	multiple?: boolean;
	value: File[];
	onChange: (value: File[]) => void;
}

export type MultiselectField = BaseField & {
	type: "multiselect";
	options: { value: string; label: string; description?: string }[];
	value: string[];
	onChange: (value: string[]) => void;
};

export type FieldConfig =
	| TextInputField
	| SelectField
	| TextAreaField
	| CheckboxField
	| FileField
	| MultiselectField;

export type RenderFieldProps<T extends FieldConfig> = T extends CheckboxField
	? T
	: T extends FileField
		? T
		: T extends MultiselectField
			? T
			: T & { value: string; onChange: (value: string) => void };
