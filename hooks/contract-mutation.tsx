import { CHAIN_ID, CONTRACT_ADDRESS, JUNO_TESTNET_RPC } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import useStore from "@/store/store";

export const useCreateProposal = (
  senderAddress: string | undefined,
  showNotification: (
    type: "default" | "destructive" | "running",
    message: string
  ) => void
) => {
  const queryClient = useQueryClient();
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
        throw new Error(
          "Payment of 1000 ujunox required but not found in store"
        );
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["proposals_by_proposer", senderAddress],
      });
      showNotification("default", "Proposta creata con successo!");
    },
    onError: (err) => {
      showNotification("destructive", err.message);
    },
  });
};

export const useAskToJoinProposal = (
  senderAddress: string | undefined,
  proposal_id: number,
  showNotification: (
    type: "default" | "destructive" | "running",
    message: string
  ) => void
) => {
  return useMutation({
    mutationFn: async () => {
      console.log("qui", senderAddress);
      console.log("qui", proposal_id);
      //  return;
      const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);

      const cosmwasmClient: SigningCosmWasmClient | null =
        await SigningCosmWasmClient.connectWithSigner(
          JUNO_TESTNET_RPC,
          offlineSigner
        );

      if (!cosmwasmClient) throw new Error("Cosmwasm client is not connected");
      const real_fee = {
        amount: [
          {
            denom: "ujuno",
            amount: "5000", // Gas fees separate from payment
          },
        ],
        gas: "2000000",
      };
      const initMsg = {
        add: [],
        ask: senderAddress?.toString(),
        proposal_id: proposal_id * 1,
        rmv: [],
      };
      const msg = { update_voters: initMsg };
      console.log(JSON.stringify(msg, null, 2));

      if (senderAddress) {
        const result = await cosmwasmClient.execute(
          senderAddress,
          CONTRACT_ADDRESS,
          msg,
          real_fee
        );
        console.table(result);
        return result;
      }
    },
    onSuccess: () => {
      showNotification("default", "Richiesta inviata con successo!");
    },
    onError: (err) => {
      showNotification("destructive", err.message);
    },
  });
};
export const useActionToProposal = (
  senderAddress: string | undefined,
  proposal_id: number,
  showNotification: (
    type: "default" | "destructive" | "running",
    message: string
  ) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      voters,
    }: {
      voters: { add: string[]; rmv: string[] };
    }) => {
      console.log("qui", voters.add);
      const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);

      const cosmwasmClient: SigningCosmWasmClient | null =
        await SigningCosmWasmClient.connectWithSigner(
          JUNO_TESTNET_RPC,
          offlineSigner
        );

      if (!cosmwasmClient) throw new Error("Cosmwasm client is not connected");
      const real_fee = {
        amount: [
          {
            denom: "ujuno",
            amount: "5000", // Gas fees separate from payment
          },
        ],
        gas: "2000000",
      };
      const initMsg = {
        add: voters.add,
        ask: "",
        proposal_id: proposal_id * 1,
        rmv: voters.rmv,
      };
      const msg = { update_voters: initMsg };
      console.log(JSON.stringify(msg, null, 2));

      if (senderAddress) {
        const result = await cosmwasmClient.execute(
          senderAddress,
          CONTRACT_ADDRESS,
          msg,
          real_fee
        );
        console.table(result);
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["proposals_by_proposer", senderAddress],
      });
      showNotification("default", "Operazione eseguita con successo!");
    },
    onError: (err) => {
      showNotification("destructive", err.message);
    },
  });
};

export const useVoteProposal = (
  senderAddress: string | undefined,
  proposal_id: number,
  showNotification: (
    type: "default" | "destructive" | "running",
    message: string
  ) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vote: string) => {
      console.log("qui", vote);
      console.log("qui", proposal_id);
      console.log("Number(vote)", Number(vote));
      //  return;
      const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);

      const cosmwasmClient: SigningCosmWasmClient | null =
        await SigningCosmWasmClient.connectWithSigner(
          JUNO_TESTNET_RPC,
          offlineSigner
        );

      if (!cosmwasmClient) throw new Error("Cosmwasm client is not connected");
      // Accedi allo stato dello store
      const { voting_fee } = useStore.getState();
      // Trova la commissione necessaria per questa transazione (se applicabile)
      const real_fee = {
        amount: [
          {
            denom: "ujuno",
            amount: voting_fee.toString(), // Gas fees separate from payment
          },
        ],
        gas: "2000000",
      };
      const initMsg = {
        vote: Number(vote),
        proposal_id: proposal_id * 1,
      };
      const msg = { vote: initMsg };
      console.log(JSON.stringify(msg, null, 2));

      if (senderAddress) {
        const result = await cosmwasmClient.execute(
          senderAddress,
          CONTRACT_ADDRESS,
          msg,
          real_fee
        );
        // console.table(result);
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["running", proposal_id],
      });
      showNotification("default", "Votazione eseguita con successo!");
    },
    onError: (err) => {
      showNotification("destructive", err.message);
    },
  });
};
export const useCloseProposal = (senderAddress: string | undefined) => {
  return useMutation({
    mutationFn: async (proposal_id: number) => {
      //  return;
      const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);

      const cosmwasmClient: SigningCosmWasmClient | null =
        await SigningCosmWasmClient.connectWithSigner(
          JUNO_TESTNET_RPC,
          offlineSigner
        );

      if (!cosmwasmClient) throw new Error("Cosmwasm client is not connected");
      // Accedi allo stato dello store
      const { voting_fee } = useStore.getState();
      // Trova la commissione necessaria per questa transazione (se applicabile)
      const real_fee = {
        amount: [
          {
            denom: "ujuno",
            amount: voting_fee.toString(), // Gas fees separate from payment
          },
        ],
        gas: "2000000",
      };
      const initMsg = {
        proposal_id: proposal_id * 1,
      };
      const msg = { close: initMsg };
      console.log(JSON.stringify(msg, null, 2));
      if (senderAddress) {
        const result = await cosmwasmClient.execute(
          senderAddress,
          CONTRACT_ADDRESS,
          msg,
          real_fee
        );
        // console.table(result);
        return result;
      }
    },
  });
};
