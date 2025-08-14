import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// Initialize MMKV instance
const mmkv = new MMKV();

// Custom MMKV storage adapter for Zustand
const mmkvStorage: StateStorage = {
  getItem: (key: string) => {
    const value = mmkv.getString(key);
    return value ?? null; // Return null if undefined to match StateStorage
  },
  setItem: (key: string, value: string) => {
    mmkv.set(key, value);
  },
  removeItem: (key: string) => {
    mmkv.delete(key);
  },
};

// Structured logger for better debugging
export const logger = {
  info: (message: string, ...args: any[]) =>
    __DEV__ && console.log(`[CartStore] ${message}`, ...args),
  error: (message: string, ...args: any[]) =>
    console.error(`[CartStore] ${message}`, ...args),
};

// Interface for cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
}

// Interface for cart store
interface CartStore {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  formatPrice: (amount: number) => string;
}

// Zustand store
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Adds a product to the cart or updates quantity if it exists
       * @param product - The product to add
       */
      addItem: (product) => {
        logger.info('Adding item to cart:', product);
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === product.id
          );

          if (existingItemIndex !== -1) {
            // Update quantity for existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity:
                updatedItems[existingItemIndex].quantity + product.quantity,
            };
            return { items: updatedItems };
          }

          // Add new item
          return { items: [...state.items, { ...product }] };
        });
      },

      /**
       * Removes an item from the cart by ID
       * @param id - The ID of the item to remove
       */
      removeItem: (id) => {
        logger.info('Removing item with ID:', id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      /**
       * Updates the quantity of an item in the cart
       * @param id - The ID of the item
       * @param quantity - The new quantity
       */
      updateQuantity: (id, quantity) => {
        logger.info(`Updating quantity for item ${id} to:`, quantity);
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== id),
            };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        });
      },

      /**
       * Clears all items from the cart
       */
      clearCart: () => {
        logger.info('Clearing cart');
        set({ items: [] });
      },

      /**
       * Calculates the total number of items in the cart
       * @returns Total quantity of items
       */
      getTotalItems: () => {
        const total = get().items.reduce((sum, item) => sum + item.quantity, 0);
        logger.info('Total items:', total);
        return total;
      },

      /**
       * Calculates the total price of items in the cart
       * @returns Total price
       */
      getTotalPrice: () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        logger.info('Total price:', total);
        return total;
      },

      /**
       * Formats a price amount to Tanzanian Shilling (TSh)
       * @param amount - The amount to format
       * @returns Formatted price string
       */
      formatPrice: (amount: number) => {
        const formatted = `TSh ${amount.toLocaleString('en-TZ')}`;
        logger.info(`Formatting price ${amount} to:`, formatted);
        return formatted;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
