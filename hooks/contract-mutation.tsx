import { CHAIN_ID, CONTRACT_ADDRESS, JUNO_TESTNET_RPC } from "@/constant";
import { useMutation } from "@tanstack/react-query";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import useStore from "@/store/store";
import { queryClient } from "@/providers/tanstack";

export const useCreateProposal = (
  senderAddress: string | undefined,
  showNotification: (type: "default" | "destructive", message: string) => void
) => {
  return useMutation({
    mutationFn: async ({ initMsg }: { initMsg: object }) => {
      const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);
      const cosmwasmClient: SigningCosmWasmClient | null =
        await SigningCosmWasmClient.connectWithSigner(
          JUNO_TESTNET_RPC,
          offlineSigner
        );

      if (!cosmwasmClient) throw new Error("Cosmwasm client is not connected");
      // Access store status
      const { commissions } = useStore.getState();
      // Find the fee required for this transaction (if applicable)
      const payment = commissions.find((commission) =>
        commission.includes("ujunox")
      );
      if (!payment) {
        throw new Error(
          "Payment of 1000 ujunox required but not found in store"
        );
      }
      const paymentAmount = payment.split(" ")[0];
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
          real_fee, 
          undefined,
          [
            {
              denom: "ujunox",
              amount: paymentAmount, // Includes the payment required by the contract
            },
          ]
        );
        console.table(result);
        return result;
      }
      // Submit transaction with fees
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["proposals_by_proposer", senderAddress],
      });
      showNotification("default", "Proposal created successfully!");
    },
    onError: (err) => {
      showNotification("destructive", err.message);
    },
  });
};

export const useAskToJoinProposal = (
  senderAddress: string | undefined,
  proposal_id: number,
  showNotification: (type: "default" | "destructive", message: string) => void
) => {
  return useMutation({
    mutationFn: async () => {
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
      showNotification("default", "Request sent successfully!");
    },
    onError: (err) => {
      showNotification("destructive", err.message);
    },
  });
};
export const useActionToProposal = (
  senderAddress: string | undefined,
  proposal_id: number,
  showNotification: (type: "default" | "destructive", message: string) => void
) => {
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
        queryKey: ["voters", proposal_id],
      });
      showNotification("default", "Operation performed successfully!");
    },
    onError: (err) => {
      showNotification("destructive", err.message);
    },
  });
};

export const useVoteProposal = (
  senderAddress: string | undefined,
  proposal_id: number,
  showNotification: (type: "default" | "destructive", message: string) => void
) => {
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
      // Access store status
      const { voting_fee } = useStore.getState();
      // Find the fee required for this transaction (if applicable)
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
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["running", proposal_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["voters", proposal_id],
      });
      showNotification("default", "Vote accepted!");
    },
    onError: (err) => {
      let startIndex = err.message.indexOf("message index: 0:");
      if (startIndex != -1) {
        startIndex = startIndex + 18;
        const endIndex = err.message.indexOf(":", startIndex);
        const extractedMessage = err.message.slice(startIndex, endIndex);
        showNotification("destructive", extractedMessage);
      } else showNotification("destructive", err.message);
    },
  });
};
export const useCloseProposal = (senderAddress: string | undefined) => {
  return useMutation({
    mutationFn: async (proposal_id: number) => {
      const offlineSigner: OfflineSigner = window.getOfflineSigner!(CHAIN_ID);
      const cosmwasmClient: SigningCosmWasmClient | null =
        await SigningCosmWasmClient.connectWithSigner(
          JUNO_TESTNET_RPC,
          offlineSigner
        );

      if (!cosmwasmClient) throw new Error("Cosmwasm client is not connected");
      // Access store status
      const { voting_fee } = useStore.getState();
      // Find the fee required for this transaction (if applicable)
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
        return result;
      }
    },
  });
};
