import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      superTotalPrice: 0,
      deliveryPrice: 0,
      usingEcoPoint: 0,
      storeName: "",
      storeId: 0,

      addToCart: (newItem) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex((item) => {
            const isSameMenu = String(item.menuId) === String(newItem.menuId);
            const isSameOptions =
              JSON.stringify(item.selectedOptions) ===
              JSON.stringify(newItem.selectedOptions);
            return isSameMenu && isSameOptions;
          });

          if (existingItemIndex !== -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity:
                updatedCart[existingItemIndex].quantity +
                (newItem.quantity || 1),
              savedCarbon:
                updatedCart[existingItemIndex].savedCarbon +
                (newItem.savedCarbon || 0),
            };
            return { cart: updatedCart };
          }

          return { cart: [...state.cart, newItem] };
        }),

      clearCart: () =>
        set({
          cart: [],
          superTotalPrice: 0,
          deliveryPrice: 0,
          usingEcoPoint: 0,
          storeName: "",
          storeId: 0,
        }),

      increaseQuantity: (menuId, selectedOptions) =>
        set((state) => ({
          cart: state.cart.map((c) =>
            String(c.menuId) === String(menuId) &&
            JSON.stringify(c.selectedOptions) ===
              JSON.stringify(selectedOptions)
              ? { ...c, quantity: c.quantity + 1 }
              : c,
          ),
        })),

      decreaseQuantity: (menuId, selectedOptions) =>
        set((state) => ({
          cart: state.cart
            .map((c) =>
              String(c.menuId) === String(menuId) &&
              JSON.stringify(c.selectedOptions) ===
                JSON.stringify(selectedOptions)
                ? { ...c, quantity: c.quantity - 1 }
                : c,
            )
            .filter((c) => c.quantity > 0),
        })),

      setSuperTotalPrice: (price) => set({ superTotalPrice: price }),
      setDeliveryPrice: (price) => set({ deliveryPrice: price }),
      setUsingEcoPoint: (price) => set({ usingEcoPoint: price }),
      setStoreName: (name) => set({ storeName: name }),
      setStoreId: (id) => set({ storeId: id }),

      getTotalSavedCarbon: () =>
        Math.round(
          get().cart.reduce((sum, item) => sum + (item.savedCarbon || 0), 0),
        ),
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
