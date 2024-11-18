export interface ProposalIdsWithTitlesResponse {
  id: number;
  title: string;
}

export interface ProposalsByProposerResponse {
  id: number;
  title: string;
}

export interface ProposalResponse {
  id: number;
  title: string;
  description: string;
  status: "open" | "closed";
  expires: number;
  proposer: string;
  options: string[];
}

export interface ProposalResult {
  title: string;
  description: string;
  winner: string;
}

export interface Votes {
  counts: number[];
}

export interface VotersResponse {
  allowed_voters: string[];
  pending_voters: string[];
  has_voted_voters: string[];
}
