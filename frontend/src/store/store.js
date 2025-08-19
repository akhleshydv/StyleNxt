import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

const store = create(
  persist(
    (set) => ({
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => {
        set({ currentUser: null });
        // Reset cart count when user logs out
        cartStore.getState().setCartCount(0);
      },
    }),
    { name: "auth-storage", storage: createJSONStorage(() => sessionStorage) }
  ) // closing tab aur browser reset the state to null
);

// Cart store for live cart count
export const cartStore = create((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  fetchAndSetCartCount: async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, { withCredentials: true });
      const items = response.data.items || [];
      const count = items.length; // number of different products
      set({ cartCount: count });
    } catch (error) {
      // If user is not authenticated, set cart count to 0
      if (error.response?.status === 401) {
        set({ cartCount: 0 });
      } else {
        // For other errors, keep the current count
        console.error("Error fetching cart count:", error);
      }
    }
  },
}));

export default store;
