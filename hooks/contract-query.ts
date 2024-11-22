import {
  queryAllProposalIdsAndTitlesOptions,
  queryContractStatusOptions,
  queryProposalByProposerOptions,
  queryProposalOptions,
  queryProposalResultOptions,
  queryProposalRunningOptions,
  queryVotersOptions,
} from "@/queries/options";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const useAllProposalIdsAndTitlesQuery = () => {
  const options = queryAllProposalIdsAndTitlesOptions();
  return useQuery(options);
};

// DONE
export const useProposalByProposerQuery = (proposer: string | undefined) => {
  const options = queryProposalByProposerOptions(proposer);
  return useQuery(options);
};
// DONE
export const useContractStatusQuery = () => {
  const options = queryContractStatusOptions();
  return useQuery(options);
};
export const useProposalQuery = (
  id: number,
) => {
  const options = queryProposalOptions(id);
  return useQuery(options);
};

export const useProposalResultQuery = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => {
  const options = queryProposalResultOptions(contractAddress, id, enabled);
  return useQuery(options);
};

export const useProposalRunningQuery = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => {
  const options = queryProposalRunningOptions(contractAddress, id, enabled);
  return useQuery(options);
};
//DONE
export const useVotersQuery = (id: number) => {
  const options = queryVotersOptions(id);
  return useQuery(options);
};
