import {
  queryAllProposalIdsAndTitlesOptions,
  queryContractStatusOptions,
  queryProposalByProposerOptions,
  queryProposalOptions,
  queryProposalResultOptions,
  queryProposalRunningOptions,
  queryVotersOptions,
} from "@/queries/options";
import { useQuery } from "@tanstack/react-query";

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
export const useContractStatusQuery = (enabled:boolean) => {
  const options = queryContractStatusOptions(enabled);
  return useQuery(options);
};
export const useProposalQuery = (
  id: number,
) => {
  const options = queryProposalOptions(id);
  return useQuery(options);
};

export const useProposalResultQuery = (
  id: number,
  enabled: boolean
) => {
  const options = queryProposalResultOptions(id,enabled);
  return useQuery(options);
};

export const useProposalRunningQuery = (
  id: number,
  status:boolean
) => {
  const options = queryProposalRunningOptions(id,status);
  return useQuery(options);
};
//DONE
export const useVotersQuery = (id: number,enabled: boolean) => {
  const options = queryVotersOptions(id,enabled);
  return useQuery(options);
};
