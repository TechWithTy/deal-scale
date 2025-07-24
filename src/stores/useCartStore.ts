import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductType } from '@/types/products';
import type { CartItem, CartState, CartSummary, DEFAULT_CART_SUMMARY } from '@/types/cart';

// Helper to safely get the price of an item (supports both product and variant prices)
const getItemPrice = (item: CartItem): number => 
  item.selectedVariant?.price ?? item.price;

// Helper to check if an item requires shipping
const itemRequiresShipping = (item: CartItem): boolean =>
  item.requiresShipping ?? item.selectedVariant?.requiresShipping ?? true;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1, variant?) => {
        if (quantity < 1) return;
        
        set((state) => {
          const now = Date.now();
          const newItem: CartItem = {
            ...product,
            quantity,
            addedAt: now,
            selectedVariant: variant ? {
              id: variant.id,
              name: variant.name,
              price: variant.price,
              requiresShipping: variant.requiresShipping ?? true,
              ...variant,
            } : undefined,
          };

          // Check if item already exists in cart (matching product and variant)
          const existingItemIndex = state.items.findIndex(
            (item) => 
              item.id === product.id && 
              (!variant || item.selectedVariant?.id === variant.id)
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
              // Update the timestamp to now when quantity changes
              addedAt: now,
            };
            return { items: updatedItems };
          }

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => 
              item.id !== productId || 
              (variantId ? item.selectedVariant?.id !== variantId : false)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId && 
            (!variantId || item.selectedVariant?.id === variantId)
              ? { 
                  ...item, 
                  quantity,
                  // Update the timestamp when quantity changes
                  addedAt: Date.now(),
                }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => 
        get().items.reduce(
          (total, item) => total + (getItemPrice(item) * item.quantity),
          0
        ),
      
      getItemCount: () => 
        get().items.reduce((count, item) => count + item.quantity, 0),
      
      requiresShipping: () =>
        get().items.some(itemRequiresShipping),
      
      getCartSummary: (shippingCost = 0, taxRate = 0, discountAmount = 0) => {
        const items = get().items;
        const subtotal = items.reduce(
          (sum, item) => sum + (getItemPrice(item) * item.quantity),
          0
        );
        
        const itemCount = items.length;
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const requiresShipping = items.some(itemRequiresShipping);
        
        // Calculate tax on the subtotal (excluding shipping)
        const tax = subtotal * taxRate;
        
        // Ensure discount doesn't exceed subtotal + shipping + tax
        const maxDiscount = subtotal + shippingCost + tax;
        const discount = Math.min(discountAmount, maxDiscount);
        
        // Calculate final total
        const total = Math.max(0, subtotal + shippingCost + tax - discount);
        
        return {
          subtotal: Number(subtotal.toFixed(2)),
          shipping: Number(shippingCost.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          discount: Number(discount.toFixed(2)),
          total: Number(total.toFixed(2)),
          itemCount,
          totalQuantity,
          requiresShipping,
        };
      },
    }),
    {
      name: 'cart-storage',
      storage: (() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => Promise.resolve(null),
            setItem: () => Promise.resolve(),
            removeItem: () => Promise.resolve(),
          } as const;
        }
        
        return {
          getItem: (name: string) => {
            const value = window.localStorage.getItem(name);
            return Promise.resolve(value ? JSON.parse(value) : null);
          },
          setItem: (name: string, value: { state: { items: CartItem[] } }) => {
            window.localStorage.setItem(name, JSON.stringify(value));
            return Promise.resolve();
          },
          removeItem: (name: string) => {
            window.localStorage.removeItem(name);
            return Promise.resolve();
          },
        } as const;
      })(),
      // Only persist the items array to storage
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Export a hook to use the cart summary
// This is a convenience hook that uses the store's getCartSummary method
export const useCartSummary = (shippingCost = 0, taxRate = 0, discountAmount = 0) => {
  return useCartStore((state) => {
    return state.getCartSummary(shippingCost, taxRate, discountAmount);
  });
};

// Export a hook to check if cart is empty
export const useIsCartEmpty = () => {
  return useCartStore((state) => state.items.length === 0);
};

// Export a hook to get cart items
export const useCartItems = () => {
  return useCartStore((state) => state.items);
};

// Export a hook to get a specific cart item
export const useCartItem = (productId: string, variantId?: string) => {
  return useCartStore((state) => 
    state.items.find(
      (item) => 
        item.id === productId && 
        (!variantId || item.selectedVariant?.id === variantId)
    )
  );
};

// Export a hook to get the total number of items in the cart
export const useCartItemCount = () => {
  return useCartStore((state) => 
    state.items.reduce((count, item) => count + item.quantity, 0)
  );
};
