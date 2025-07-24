// biome-ignore lint/style/useImportType: <explanation>
import { ReactNode, createContext, useContext, useState } from "react";

// * Unified product selection type
export interface ProductSelection {
	type?: string;
	color?: string;
	size?: string;
	quantity?: number;
	// todo: Add more fields a  s needed
}

interface ProductSelectionContextValue {
	selection: ProductSelection;
	setSelection: (selection: Partial<ProductSelection>) => void;
	resetSelection: () => void;
}

const ProductSelectionContext = createContext<
	ProductSelectionContextValue | undefined
>(undefined);

export const ProductSelectionProvider = ({
	children,
	initialSelection = {},
}: { children: ReactNode; initialSelection?: ProductSelection }) => {
	const [selection, setSelectionState] =
		useState<ProductSelection>(initialSelection);

	// * Update only provided fields
	const setSelection = (update: Partial<ProductSelection>) => {
		setSelectionState((prev) => ({ ...prev, ...update }));
	};

	const resetSelection = () => setSelectionState(initialSelection);

	return (
		<ProductSelectionContext.Provider
			value={{ selection, setSelection, resetSelection }}
		>
			{children}
		</ProductSelectionContext.Provider>
	);
};

export const useProductSelection = () => {
	const ctx = useContext(ProductSelectionContext);
	if (!ctx)
		throw new Error(
			"useProductSelection must be used within a ProductSelectionProvider",
		);
	return ctx;
};
