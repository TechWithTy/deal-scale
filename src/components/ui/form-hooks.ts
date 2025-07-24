import * as React from "react";
import {
	ControllerProps,
	type FieldError,
	type FieldPath,
	type FieldValues,
	useFormContext,
} from "react-hook-form";

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

export const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

type FormItemContextValue = {
	id: string;
	formMessageId: string;
	formDescriptionId: string;
};

export const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

export const useFormField = (): {
	id: string;
	name: FieldPath<FieldValues>;
	formItemId: string;
	formDescriptionId: string;
	formMessageId: string;
	error: FieldError | undefined;
} => {
	const fieldContext = React.useContext(FormFieldContext);
	const { id, formMessageId, formDescriptionId } =
		React.useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const fieldState = getFieldState(fieldContext.name, formState);

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId,
		formMessageId,
		error: fieldState.error,
	};
};
