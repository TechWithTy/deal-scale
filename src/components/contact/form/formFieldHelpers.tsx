// formFieldHelpers.tsx
// * Shared helpers for field prop creation and rendering for all contact forms

import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FieldConfig, RenderFieldProps } from "@/types/contact/formFields";
import { Eye, EyeOff, FileIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

// Helper to generate props for UI field renderer
export const createFieldProps = <
	T extends FieldConfig,
	V extends FieldValues = FieldValues,
>(
	field: T,
	formField: ControllerRenderProps<V>,
): RenderFieldProps<T> => {
	if (field.type === "checkbox") {
		return {
			...field,
			value: formField.value as boolean,
			onChange: formField.onChange as (checked: boolean) => void,
		} as RenderFieldProps<T>;
	}
	if (field.type === "multiselect") {
		return {
			...field,
			value: (formField.value as string[]) || [],
			onChange: formField.onChange as (v: string[]) => void,
		} as RenderFieldProps<T>;
	}
	if (field.type === "file") {
		return {
			...field,
			value: (formField.value as File[]) || [],
			onChange: formField.onChange as (v: File[]) => void,
		} as RenderFieldProps<T>;
	}
	// Defensive: Always provide a string value, never undefined/null, to avoid React controlled/uncontrolled warnings
	return {
		...field,
		value:
			formField.value === undefined || formField.value === null
				? ""
				: (formField.value as string),
		onChange: formField.onChange as (v: string) => void,
	} as RenderFieldProps<T>;
};

// Helper to render the correct UI component based on field type
export const renderFormField = (field: RenderFieldProps<FieldConfig>) => {
	switch (field.type) {
		case "select":
			return (
				<Select
					value={field.value as string}
					onValueChange={field.onChange as (v: string) => void}
				>
					<SelectTrigger>
						<SelectValue placeholder={field.placeholder} />
					</SelectTrigger>
					<SelectContent>
						{field.options?.map((opt) => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		case "multiselect":
			return (
				<MultiSelectDropdown
					options={field.options || []}
					value={field.value as string[]}
					onChange={field.onChange as (v: string[]) => void}
					placeholder={field.placeholder}
					className="border-white/10 bg-white/5 focus:border-primary"
				/>
			);
		case "textarea":
			return (
				<Textarea
					placeholder={field.placeholder}
					className="border-white/10 bg-white/5 focus:border-primary"
					value={field.value as string}
					onChange={(e) =>
						(field.onChange as (v: string) => void)(e.target.value)
					}
					minLength={field.minLength}
					maxLength={field.maxLength}
				/>
			);
		case "checkbox": {
			const inputId = `checkbox-${field.name}`;
			return (
				<div className="flex items-center space-x-2">
					<Checkbox
						id={inputId}
						checked={field.value as boolean}
						onCheckedChange={field.onChange as (c: boolean) => void}
					/>
					<label htmlFor={inputId} className="text-black dark:text-white/70">
						{field.label}
					</label>
				</div>
			);
		}
		case "file": {
			const files = (field.value as File[])?.slice(0, 4) || [];
			const inputId = `file-upload-${field.name}`;
			return (
				<div className="flex flex-col gap-4">
					<input
						id={inputId}
						type="file"
						className="hidden"
						accept={field.accept}
						multiple={field.multiple}
						onChange={(e) => {
							const newFiles = Array.from(e.target.files || []);
							const updated = [...files, ...newFiles].slice(0, 4);
							(field.onChange as (v: File[]) => void)(updated);
							e.target.value = "";
						}}
						disabled={files.length >= 4}
					/>
					<label
						htmlFor={inputId}
						className="cursor-pointer rounded border border-white/10 bg-white/5 px-4 py-2 text-center"
					>
						Browse files
					</label>
					<div className="grid grid-cols-2 gap-2">
						{files.map((file) => (
							<div
								key={`${file.name}-${file.lastModified}-${file.size}`}
								className="relative flex items-center space-x-2 rounded-md bg-white/10 p-2 text-xs"
							>
								{file.type.startsWith("image/") ? (
									<Image
										src={URL.createObjectURL(file)}
										alt={file.name}
										width={40}
										height={40}
										className="rounded object-cover"
									/>
								) : (
									<FileIcon className="text-primary" />
								)}
								<span className="truncate">{file.name}</span>
							</div>
						))}
					</div>
				</div>
			);
		}
		default: {
			const [showPassword, setShowPassword] = useState(false);
			const isSensitive = field.sensitive;

			return (
				<div className="relative">
					<Input
						type={isSensitive && !showPassword ? "password" : "text"}
						placeholder={field.placeholder}
						className="border-white/10 bg-white/5 focus:border-primary"
						value={field.value as string}
						onChange={(e) => {
							let value = e.target.value;

							// ! If pattern is for digits only (like zip code), filter out non-digits.
							if (field.pattern === "^\\d{5}$") {
								value = value.replace(/[^\d]/g, "");
							}

							// * Enforce maxLength
							if (field.maxLength && value.length > field.maxLength) {
								value = value.slice(0, field.maxLength);
							}

							(field.onChange as (v: string) => void)(value);
						}}
						minLength={field.minLength}
						maxLength={field.maxLength}
						pattern={field.pattern}
					/>
					{isSensitive && (
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center pr-3"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className="h-5 w-5 text-gray-400" />
							) : (
								<Eye className="h-5 w-5 text-gray-400" />
							)}
						</button>
					)}
				</div>
			);
		}
	}
};
