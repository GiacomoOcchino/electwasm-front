export interface WalletStateType {
  wallet: { address: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setWallet: (wallet: { address: string }) => void;
  setLoading: (loading: boolean) => void;
}
