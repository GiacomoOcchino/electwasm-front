import { OfflineSigner } from '@cosmjs/proto-signing'; // Importa il tipo se necessario

export {};

declare global {
  interface Window {
    keplr?: {
      enable: (chainId: string) => Promise<void>;
    };
    getOfflineSigner: (chainId: string) => OfflineSigner;
  }
}