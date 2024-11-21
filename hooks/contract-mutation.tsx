import {
  CHAIN_ID,
  CONTRACT_ADDRESS,
  JUNO_TESTNET_REST,
  JUNO_TESTNET_RPC,
} from "@/constant";
import { useMutation } from "@tanstack/react-query";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import useStore from "@/store/store";

export const useCreateProposal = (senderAddress: string | undefined) => {
  return useMutation({
    mutationFn: async ({ initMsg }: { initMsg: object }) => {
      //   console.table('qui',initMsg);
      console.log("qui");
      const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);

      const cosmwasmClient: SigningCosmWasmClient | null =
        await SigningCosmWasmClient.connectWithSigner(
          JUNO_TESTNET_RPC,
          offlineSigner
        );

      if (!cosmwasmClient) throw new Error("Cosmwasm client is not connected");
      // Accedi allo stato dello store
      const { commissions } = useStore.getState();
      // Trova la commissione necessaria per questa transazione (se applicabile)
      const payment = commissions.find((commission) =>
        commission.includes("ujunox")
      );
      if (!payment) {
        throw new Error("Payment of 1000 ujunox required but not found in store");
      }
      const paymentAmount = payment.split(" ")[0]; // "1000"
      const real_fee = {
        amount: [
          {
            denom: "ujuno",
            amount: "5000", // Gas fees separate from payment
          },
        ],
        gas: "2000000",
      };

      const msg = { propose: initMsg };
      console.log(JSON.stringify(msg, null, 2));

      if (senderAddress) {
        const result = await cosmwasmClient.execute(
          senderAddress,
          CONTRACT_ADDRESS,
          msg,
          real_fee, // Puoi specificare un oggetto fee qui se necessario
          undefined,
          [
            {
              denom: "ujunox",
              amount: paymentAmount, // Include il pagamento richiesto dal contratto
            },
          ]
        );
        console.table(result);
        return result;
      }
      // Invia la transazione con le fee
    },
  });
};
