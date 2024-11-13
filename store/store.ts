import { WalletStateType } from "@/types";
import { Wallet } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const useStore = create<WalletStateType>()(
  persist(
    (set) => ({
      wallet: null,
      isAuthenticated: false,
      isLoading: true,
      setWallet: (wallet) =>
        set({ wallet, isAuthenticated: !!wallet, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "wallet-storage",
      onRehydrateStorage: () => (state) => {
        return state && state.setLoading(false);
      },
    }
  )
);

export default useStore;
