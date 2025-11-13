"use client";

import { toast } from "react-hot-toast";

type ToastHandlers = {
	success: (message: string) => void;
	error: (message: string) => void;
	id: string;
};

const DEFAULT_SUCCESS_DURATION = 5000;
const DEFAULT_ERROR_DURATION = 6000;

export function startStripeToast(message: string): ToastHandlers {
	const id = toast.loading(message, { duration: Infinity });

	return {
		id,
		success: (successMessage: string) => {
			toast.success(successMessage, {
				id,
				duration: DEFAULT_SUCCESS_DURATION,
			});
		},
		error: (errorMessage: string) => {
			toast.error(errorMessage, {
				id,
				duration: DEFAULT_ERROR_DURATION,
			});
		},
	};
}

