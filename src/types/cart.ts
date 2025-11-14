/**
 * Cart and ecommerce system type definitions
 */

export interface CartItem {
	id: string;
	product_sku: string;
	name: string;
	unit_price: number;
	quantity: number;
	total_price: number;
	metadata?: Record<string, unknown>;
	created_at: string;
	updated_at: string;
}

export interface Cart {
	id: string;
	user_id: string;
	items: CartItem[];
	total_items: number;
	total_amount: number;
	currency: string;
	created_at: string;
	updated_at: string;
	metadata?: Record<string, unknown>;
}

export interface CartSummary {
	total_items: number;
	total_amount: number;
	currency: string;
	item_count: number;
}

export interface CartResponse {
	success: boolean;
	message: string;
	cart: Cart;
	summary: CartSummary;
}

export interface AddToCartRequest {
	product_sku: string;
	name: string;
	unit_price: number;
	quantity?: number;
	metadata?: Record<string, unknown>;
}

export interface UpdateCartItemRequest {
	quantity: number;
}

export interface CheckoutRequest {
	payment_method?: string;
	billing_address?: Record<string, unknown>;
	shipping_address?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export interface CheckoutResponse {
	checkout_session_id: string;
	payment_url?: string;
	status: string;
	total_amount: number;
	currency: string;
	metadata?: Record<string, unknown>;
}

export interface CheckoutStatusResponse {
	checkout_session_id: string;
	status: string;
	payment_status?: string;
	total_amount: number;
	currency: string;
	next_steps?: string[];
	metadata?: Record<string, unknown>;
}

export interface Product {
	id: string;
	sku: string;
	name: string;
	description?: string;
	price: number;
	currency: string;
	category: string;
	available: boolean;
	metadata?: Record<string, unknown>;
}

export interface ProductsResponse {
	products: Product[];
	categories: string[];
	total_count: number;
}
