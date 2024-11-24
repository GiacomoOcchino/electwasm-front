interface Proposal {
    id: number;
    title: string;
    status: string;
    winner?: string | null;
  }
  
  interface ProposalListProps {
    proposals: Proposal[];
    setSelectedProposal: (proposal: Proposal) => void;
  }
  
  export default function ProposalList({ proposals, setSelectedProposal }: ProposalListProps) {
    return (
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="border p-4 rounded shadow-md">
            <h4 className="text-lg font-bold">{proposal.title}</h4>
            <p className="text-sm">Stato: {proposal.status}</p>
            {proposal.winner && <p className="text-sm">Vincitore: {proposal.winner}</p>}
            <button
              onClick={() => setSelectedProposal(proposal)}
              className="bg-green-500 text-white p-2 rounded mt-2"
            >
              Gestisci Votanti
            </button>
          </div>
        ))}
      </div>
    );
  }
  