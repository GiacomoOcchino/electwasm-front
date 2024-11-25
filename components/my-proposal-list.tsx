import { useCloseProposal } from "@/hooks/contract-mutation";
import { useWallet } from "@/hooks/wallet";

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
  const { wallet, connectKeplr } = useWallet();
  const { mutate: closeProposal, isPending: closing } = useCloseProposal(
    wallet?.address
  );
  const handleCloseProposal = (id: number) => {
    closeProposal(id, {
      onSuccess: () => {
        alert(`Proposta ${id} chiusa con successo.`);
      },
      onError: () => {
        alert(`Errore nella chiusura della proposta ${id}.`);
      },
    });
  };
  return (
    <div className="space-y-4">
      {proposals.map(([id, title]) => (
        <div key={id} className="border p-4 rounded shadow-md space-y-2">
          <h4 className="text-lg font-bold">{title}</h4>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSelectedProposal([id, title])}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Gestisci Votanti
            </button>
            <button
              onClick={() => handleCloseProposal(id)}
              disabled={closing}
              className={`${
                closing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-4 py-2 rounded`}
            >
              {closing ? "Chiudendo..." : "Chiudi Proposta"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
