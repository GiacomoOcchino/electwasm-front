interface ProposalListProps {
  proposals: [number, string][] | undefined;
  setSelectedProposal: (proposal: [number, string]) => void;
}

export default function MyProposalList({
  proposals,
  setSelectedProposal,
}: ProposalListProps) {
  if (!proposals || proposals.length === 0) {
    return <p>Nessuna proposta disponibile.</p>;
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div key={proposal[0]} className="border p-4 rounded shadow-md">
          <h4 className="text-lg font-bold">{proposal[1]}</h4>
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
