import {
  queryAllProposalIdsAndTitlesOptions,
  queryProposalByProposerOptions,
  queryProposalOptions,
  queryProposalResultOptions,
  queryProposalRunningOptions,
  queryVotersOptions,
} from "@/queries/options";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const useAllProposalIdsAndTitlesQuery = (
  contractAddress: string,
  enabled: boolean
) => {
  const options = queryOptions(
    queryAllProposalIdsAndTitlesOptions(contractAddress, enabled)
  );
  return useQuery(options);
};

export const useProposalByProposerQuery = (
  contractAddress: string,
  proposer: string,
  enabled: boolean
) => {
  const options = queryProposalByProposerOptions(
    contractAddress,
    proposer,
    enabled
  );
  return useQuery(options);
};
export const useProposalQuery = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => {
  const options = queryProposalOptions(contractAddress, id, enabled);
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

export const useVotersQuery = (
  contractAddress: string,
  id: number,
  enabled: boolean
) => {
  const options = queryVotersOptions(contractAddress, id, enabled);
  return useQuery(options);
};
