import { CONTRACT_ADDRESS, JUNO_TESTNET_REST } from "@/constant";
import useStore from "@/store/store";
import {
  ProposalIdsWithTitlesResponse,
  ProposalResponse,
  ProposalResult,
  ProposalsByProposerResponse,
  StatusResponse,
  Votes,
} from "@/types/response";

export const contractOption = {
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, //24H
      staleTime: 1000 * 30, //30sec
      refetchInterval: 1000 * 30,
    },
  },
};

export const queryAllProposalIdsAndTitlesOptions = (
  contractAddress: string,
  enabled: boolean
) => ({
  queryKey: ["all_proposal_ids", contractAddress],
  queryFn: async () => {
    /* base64 of {"all_proposal_ids":{}} */
    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        contractAddress +
        "/smart/eyJhbGxfcHJvcG9zYWxfaWRzIjp7fX0="
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: ProposalIdsWithTitlesResponse = await response.json();
    return result;
  },
  enabled: !!contractAddress && enabled,
});

export const queryProposalByProposerOptions = (
  proposer: string | undefined
) => ({
  queryKey: ["proposal_by_proposer", proposer],
  queryFn: async () => {
    if (!proposer) throw new Error("Proposer address is required");
    /* base64 of {"all_proposal_ids":{proposer:proposer}} */
    const jsonString = JSON.stringify({
      proposal_by_proposer: { proposer: proposer },
    });
    const base64String = window.btoa(jsonString);

    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        CONTRACT_ADDRESS +
        "/smart/" +
        base64String +
        ""
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: ProposalsByProposerResponse = await response.json();
    return result.data;
  },
  enabled: !!proposer,
});
export const queryContractStatusOptions = () => ({
  queryKey: ["contract_status"],
  queryFn: async () => {
    /* base64 of {"status":{}} */
    const jsonString = JSON.stringify({
      status: {},
    });
    const base64String = window.btoa(jsonString);

    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        CONTRACT_ADDRESS +
        "/smart/" +
        base64String +
        ""
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: StatusResponse = await response.json();
    // Aggiorna lo store con i dati della query
    const setContractState = useStore.getState().setContractState;
    setContractState(result.data);
    return result.data;
  },
});

export const queryProposalOptions = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => ({
  queryKey: ["proposal", id],
  queryFn: async () => {
    /* base64 of {"proposal":{proposal_id:proposer}} */
    const jsonString = JSON.stringify({
      proposal: { proposal_id: id },
    });
    const base64String = window.btoa(jsonString);

    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        contractAddress +
        "/smart/" +
        base64String +
        ""
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: ProposalResponse = await response.json();
    return result;
  },
  enabled: !!contractAddress && enabled,
});

export const queryProposalResultOptions = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => ({
  queryKey: ["winner", id],
  queryFn: async () => {
    /* base64 of {"proposal":{proposal_id:proposer}} */
    const jsonString = JSON.stringify({
      winner: { proposal_id: id },
    });
    const base64String = window.btoa(jsonString);

    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        contractAddress +
        "/smart/" +
        base64String +
        ""
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: ProposalResult = await response.json();
    return result;
  },
  enabled: !!contractAddress && enabled,
});
export const queryProposalRunningOptions = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => ({
  queryKey: ["running", id],
  queryFn: async () => {
    /* base64 of {"running":{proposal_id:proposer}} */
    const jsonString = JSON.stringify({
      running: { proposal_id: id },
    });
    const base64String = window.btoa(jsonString);

    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        contractAddress +
        "/smart/" +
        base64String +
        ""
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: Votes = await response.json();
    return result;
  },
  enabled: !!contractAddress && enabled,
});
export const queryVotersOptions = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => ({
  queryKey: ["voters", id],
  queryFn: async () => {
    /* base64 of {"voters":{proposal_id:proposer}} */
    const jsonString = JSON.stringify({
      voters: { proposal_id: id },
    });
    const base64String = window.btoa(jsonString);

    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        contractAddress +
        "/smart/" +
        base64String +
        ""
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: Votes = await response.json();
    return result;
  },
  enabled: !!contractAddress && enabled,
});
