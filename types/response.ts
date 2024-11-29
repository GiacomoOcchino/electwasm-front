export interface ProposalIdsWithTitlesResponse {
  data: {
    proposals: [number, string][];
  };
}

export interface ProposalsByProposerResponse {
  data: {
    proposals: ProposalInfoByResponse[];   };
}

export interface ProposalInfoByResponse {
  id: number,
  title: string,
  status: "open" | "close",
  winner: string,
}

export interface ProposalDetailsResponse {
  data: {
    id: number;
    title: string;
    description: string;
    status: "open" | "closed";
    expires: {
      at_time: string; // Timestamp in formato stringa
    };
    proposer: string;
    options: string[];
  };
}

export interface ProposalResult {
  data: {
    title: string;
    description: string;
    winner: string;
  };
}

export interface Votes {
  data: {
    counts: number[];
  };
}

export interface VotersResponse {
  data: {
    allowed_voters: string[];
    pending_voters: string[];
    has_voted_voters: string[];
  };
}

export interface StatusResponse {
  data: {
    admin: string;
    commissions: string[];
    voting_fee: number;
  };
}
