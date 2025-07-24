import type { ProductType } from "@/types/products";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  requiresShipping?: boolean;
  [key: string]: unknown; // Allow for additional variant properties
}

export interface CartItem extends Omit<ProductType, 'types' | 'colors' | 'sizes'> {
  /**
   * The selected variant of the product, if applicable
   */
  selectedVariant?: ProductVariant;
  
  /**
   * Quantity of this item in the cart
   * @minimum 1
   */
  quantity: number;
  
  /**
   * Timestamp when this item was added to the cart
   */
  addedAt?: number;
  
  /**
   * Optional notes or customization for this item
   */
  notes?: string;
  
  /**
   * Whether this item requires shipping
   * If not set, falls back to variant.requiresShipping or true
   */
  requiresShipping?: boolean;
}

export interface CartSummary {
  /**
   * Subtotal of all items before discounts, shipping, and tax
   */
  subtotal: number;
  
  /**
   * Total shipping cost
   */
  shipping: number;
  
  /**
   * Total tax amount
   */
  tax: number;
  
  /**
   * Total discount amount
   */
  discount: number;
  
  /**
   * Grand total (subtotal + shipping + tax - discount)
   */
  total: number;
  
  /**
   * Number of unique items in the cart
   */
  itemCount: number;
  
  /**
   * Total quantity of all items
   */
  totalQuantity: number;
  
  /**
   * Whether the cart requires shipping
   */
  requiresShipping: boolean;
}

export interface CartState {
  /**
   * Array of items in the cart
   */
  items: CartItem[];
  
  /**
   * Add an item to the cart or update its quantity if it already exists
   * @param product The product to add
   * @param quantity Quantity to add (default: 1)
   * @param variant Optional product variant
   */
  addItem: (product: ProductType, quantity?: number, variant?: ProductVariant) => void;
  
  /**
   * Remove an item from the cart
   * @param productId ID of the product to remove
   * @param variantId Optional variant ID if removing a specific variant
   */
  removeItem: (productId: string, variantId?: string) => void;
  
  /**
   * Update the quantity of an item in the cart
   * Removes the item if quantity is 0 or less
   * @param productId ID of the product
   * @param quantity New quantity
   * @param variantId Optional variant ID
   */
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  
  /**
   * Remove all items from the cart
   */
  clearCart: () => void;
  
  /**
   * Get the cart total (subtotal + shipping + tax - discount)
   */
  getCartTotal: () => number;
  
  /**
   * Get the total number of items in the cart
   */
  getItemCount: () => number;
  
  /**
   * Check if any items in the cart require shipping
   */
  requiresShipping: () => boolean;
  
  /**
   * Calculate a detailed cart summary
   */
  getCartSummary: (shippingCost?: number, taxRate?: number, discountAmount?: number) => CartSummary;
}

/**
 * Default values for a new cart
 */
export const DEFAULT_CART_SUMMARY: CartSummary = {
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
  totalQuantity: 0,
  requiresShipping: false,
};
