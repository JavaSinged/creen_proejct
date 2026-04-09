import { create } from "zustand";
import { persist } from "zustand/middleware"; // 🌟 persist 임포트

const useCartStore = create(
  persist(
    (set, get) => ({
      // 🌟 get 추가 (탄소 계산 함수 등에서 필요)
      cart: [],
      superTotalPrice: 0,
      deliveryPrice: 0,
      usingEcoPoint: 0,
      storeName: "",
      storeId: 0,

      // 장바구니에 아이템 추가
      addToCart: (item) =>
        set((state) => ({
          cart: [...state.cart, item],
        })),

      // 장바구니 비우기
      clearCart: () => set({ cart: [], storeId: 0, storeName: "" }),

      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((c) =>
            c.id === id ? { ...c, quantity: c.quantity + 1 } : c,
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart
            .map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
            .filter((c) => c.quantity > 0),
        })),

      setSuperTotalPrice: (price) => set({ superTotalPrice: price }),
      setDeilveryPrice: (price) => set({ deliveryPrice: price }),
      setUsingEcoPoint: (price) => set({ usingEcoPoint: price }), // 🌟 오타 수정 (usingEcoPoint)
      setStoreName: (name) => set({ storeName: name }),
      setStoreId: (id) => set({ storeId: id }),

      // 탄소 절감 계산기
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
