import { CONTRACT_ADDRESS, JUNO_TESTNET_REST } from "@/constant";
import useStore from "@/store/store";
import {
  ProposalDetailsResponse,
  ProposalIdsWithTitlesResponse,
  ProposalResult,
  ProposalsByProposerResponse,
  StatusResponse,
  VotersResponse,
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

export const queryAllProposalIdsAndTitlesOptions = () => ({
  queryKey: ["all_proposal_ids"],
  queryFn: async () => {
    /* base64 of {"all_proposal_ids":{}} */
    const response = await fetch(
      JUNO_TESTNET_REST +
        "cosmwasm/wasm/v1/contract/" +
        CONTRACT_ADDRESS +
        "/smart/eyJhbGxfcHJvcG9zYWxfaWRzIjp7fX0="
    );
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    const result: ProposalIdsWithTitlesResponse = await response.json();
    return result.data;
  },
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
export const queryContractStatusOptions = (enabled: boolean) => ({
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
  enabled: !enabled,
  staleTime: Infinity,
  cacheTime: Infinity,
});

export const queryProposalOptions = (id: number) => ({
  queryKey: ["proposal", id],
  queryFn: async () => {
    /* base64 of {"proposal":{proposal_id:proposer}} */
    const jsonString = JSON.stringify({
      proposal: { proposal_id: id * 1 },
    });
    const base64String = window.btoa(jsonString);
    console.log(jsonString);
    console.log(base64String);
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
    const result: ProposalDetailsResponse = await response.json();
    return result.data;
  },
  enabled: !!id,
});

export const queryProposalResultOptions = (id: number, closed: boolean) => ({
  queryKey: ["winner", id],
  queryFn: async () => {
    /* base64 of {"proposal":{proposal_id:proposer}} */
    const jsonString = JSON.stringify({
      winner: { proposal_id: Number(id) },
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
    const result: ProposalResult = await response.json();
    return result.data;
  },
  enabled: !!CONTRACT_ADDRESS && !!closed,
});
export const queryProposalRunningOptions = (id: number, status: boolean) => ({
  queryKey: ["running", id],
  queryFn: async () => {
    /* base64 of {"running":{proposal_id:id}} */
    console.log("here", id);

    const jsonString = JSON.stringify({
      running: { proposal_id: Number(id) },
    });
    console.log("here", jsonString);
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
    const result: Votes = await response.json();
    return result.data;
  },
  enabled: !!CONTRACT_ADDRESS && !status,
});
export const queryVotersOptions = (id: number) => ({
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
    const result: VotersResponse = await response.json();
    return result.data;
  },
  enabled: !!id,
});
