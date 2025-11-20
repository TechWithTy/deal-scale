import type { DiscountCode } from "@/types/discount/discountCode";
import type { ProductType } from "@/types/products";
import type { ShippingOption, ShippingPrice } from "@/types/products/shipping";

export interface ShippingMethodSelectorProps {
	selectedShipping: ShippingOption | null;
	onSelectShipping: (option: ShippingOption) => void;
	shippingOptions: ShippingOption[];
}

export interface PaymentSectionProps {
	error: string | null;
	setError: (error: string | null) => void;
}

export interface OrderSummaryProps {
	product: ProductType;
	selection: {
		type?: string;
		color?: string;
		size?: string;
		quantity: number;
	};
	subtotal: number;
	shipping: number | ShippingPrice;
	tax: number;
	total: number;
	discountedTotal?: number;
	discountApplied: DiscountCode | null;
	isLoading: boolean;
	error: string | null;
	onPay: (e?: React.FormEvent) => Promise<void> | void;
}

export interface DiscountCodeInputProps {
	discountCode: string;
	setDiscountCode: (code: string) => void;
	discountApplied: DiscountCode | null;
	discountError: string | null;
	checkingDiscount: boolean;
	onCheckDiscount: () => void;
}

export interface CheckoutHeaderProps {
	onClose: () => void;
}

export interface CheckoutFooterProps {
	isLoading: boolean;
	total: number;
	error: string | null;
	onPay: (e?: React.FormEvent) => Promise<void> | void;
}
