import { WalletStateType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Inizializza lo store
const useStore = create<WalletStateType>()(
  persist(
    (set) => ({
      wallet: null,
      isAuthenticated: false,
      isLoading: true,
      admin: null,
      commissions: [],
      voting_fee: 0,
      setWallet: (wallet) =>
        set({ wallet, isAuthenticated: !!wallet, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      setContractState: (state) =>
        set({
          admin: state.admin,
          commissions: state.commissions,
          voting_fee: state.voting_fee,
        }),
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
