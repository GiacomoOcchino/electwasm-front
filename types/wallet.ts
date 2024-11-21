export interface WalletStateType extends ContractStateType {
  wallet: { address: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setWallet: (wallet: { address: string }) => void;
  setLoading: (loading: boolean) => void;
  setContractState: (state: ContractStateType) => void;
}

interface ContractStateType {
  admin: string | null;
  commissions: string[];
  voting_fee: number;
}
