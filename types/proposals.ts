import { ProposalInfoByResponse } from "./response";

export interface MyProposalListProps {
  proposals: ProposalInfoByResponse[] | undefined;
  setSelectedProposal: (proposal: ProposalInfoByResponse) => void;
}

export interface Proposal {
  id: number;
  title: string;
  status: string;
  winner?: string | null;
}

export interface ProposalListProps {
  proposals: Proposal[];
  setSelectedProposal: (proposal: Proposal) => void;
}

export interface VoterManagementProps {
    proposalId: number;
  }