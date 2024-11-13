import useStore from "@/store/store";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { CHAIN_ID, JUNO_TESTNET_REST, JUNO_TESTNET_RPC } from "@/constant";

export function useWallet() {
  const { wallet, isAuthenticated, isLoading, setWallet } = useStore();

  const suggestChain = async () => {
    if (!window.keplr) {
      alert('Please install Keplr Wallet');
      return;
    }

    try {
      await window.keplr.experimentalSuggestChain({
        chainId: CHAIN_ID,
        chainName: 'Juno Testnet',
        rpc: JUNO_TESTNET_RPC,
        rest: JUNO_TESTNET_REST,
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'juno',
          bech32PrefixAccPub: 'junopub',
          bech32PrefixValAddr: 'junovaloper',
          bech32PrefixValPub: 'junovaloperpub',
          bech32PrefixConsAddr: 'junovalcons',
          bech32PrefixConsPub: 'junovalconspub',
        },
        currencies: [
          {
            coinDenom: 'JUNO',
            coinMinimalDenom: 'ujunox',
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'JUNO',
            coinMinimalDenom: 'ujunox',
            coinDecimals: 6,
          },
        ],
        stakeCurrency: {
          coinDenom: 'JUNO',
          coinMinimalDenom: 'ujunox',
          coinDecimals: 6,
        },
        coinType: 118,
        gasPriceStep: {
          low: 0.025,
          average: 0.03,
          high: 0.04,
        },
      });
    } catch (error) {
      console.error('Failed to suggest chain:', error);
    }
  };

  const connectKeplr = async () => {
    if (!window.keplr) {
      alert("Keplr extension not found");
      return;
    }
    await suggestChain();
    await window.keplr.enable(CHAIN_ID);
    const OfflineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);
    const accounts = await OfflineSigner.getAccounts();
    // console.table(accounts);
    setWallet(accounts[0]);
    document.cookie = "isAuthenticated=; Max-Age=0;path=/";
  };
  return { wallet, isAuthenticated, isLoading, connectKeplr };
}
