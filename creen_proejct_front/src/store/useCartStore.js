import { create } from 'zustand';

const useCartStore = create((set) => ({
    cart: [], // 장바구니에 담긴 아이템 배열

    // 장바구니에 아이템 추가하는 함수
    addToCart: (item) => set((state) => ({
        cart: [...state.cart, item]
    })),

    // 장바구니 비우기 (결제 완료 후 등에 사용)
    clearCart: () => set({ cart: [] }),
}));

export default useCartStore;