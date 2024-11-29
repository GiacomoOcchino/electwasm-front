import { OfflineSigner } from '@cosmjs/proto-signing'; // Importa il tipo se necessario

export {};

declare global {
  interface Window {
    keplr?: {
      enable: (chainId: string) => Promise<void>;
      experimentalSuggestChain: (chainInfo: ChainInfo) => Promise<void>;
    };
    getOfflineSigner: (chainId: string) => OfflineSigner;
  }
}
interface ChainInfo {
  chainId: string; // ID univoco della blockchain (es: cosmoshub-4)
  chainName: string; // Nome visualizzato della blockchain
  rpc: string; // URL dell'endpoint RPC per le chiamate alla blockchain
  rest: string; // URL dell'endpoint REST per le chiamate alla blockchain
  bip44: {
      coinType: number; // Coin type utilizzato per generare gli indirizzi
  };
  bech32Config: {
      bech32PrefixAccAddr: string; // Prefisso Bech32 per gli indirizzi account
      bech32PrefixAccPub: string;  // Prefisso Bech32 per le chiavi pubbliche degli account
      bech32PrefixValAddr: string;  // Prefisso Bech32 per gli indirizzi validator
      bech32PrefixValPub: string;  // Prefisso Bech32 per le chiavi pubbliche dei validator
      bech32PrefixConsAddr: string; // Prefisso Bech32 per gli indirizzi consensus
      bech32PrefixConsPub: string;  // Prefisso Bech32 per le chiavi pubbliche consensus
  };
  currencies: {
      coinDenom: string; // Denominazione della moneta (es: ATOM)
      coinMinimalDenom: string; // Denominazione minima della moneta (es: uatom)
      coinDecimals: number; // Numero di decimali
  }[];
  feeCurrencies: {
      coinDenom: string;
      coinMinimalDenom: string;
      coinDecimals: number;
  }[];
  stakeCurrency: {
      coinDenom: string;
      coinMinimalDenom: string;
      coinDecimals: number;
  };
  coinType: number; // Coin type (ripetuto da bip44.coinType per chiarezza?)
  gasPriceStep: {
      low: number; // Gas price più basso
      average: number; // Gas price medio
      high: number; // Gas price più alto
  };
}