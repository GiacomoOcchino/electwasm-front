import { useCloseProposal } from "@/hooks/contract-mutation";
import { useWallet } from "@/hooks/wallet";
import { useNotification } from "./context/notification-context";
import { MyProposalListProps } from "@/types";



export default function MyProposalList({
  proposals,
  setSelectedProposal,
}: MyProposalListProps) {
  const { showNotification } = useNotification();
  const { wallet } = useWallet();
  const { mutate: closeProposal, isPending: closing } = useCloseProposal(
    wallet?.address
  );

  const handleCloseProposal = (id: number) => {
    closeProposal(id, {
      onSuccess: () => {
        showNotification("default", `Proposta ${id} chiusa con successo.`);
      },
      onError: (err) => {
        let startIndex = err.message.indexOf("message index: 0:");
        if (startIndex != -1) {
          startIndex = startIndex + 18;
          const endIndex = err.message.indexOf(":", startIndex);
          const extractedMessage = err.message.slice(startIndex, endIndex);
          showNotification("destructive", extractedMessage);
        } else showNotification("destructive", err.message);
      },
    });
  };

  if (!proposals || proposals.length === 0) {
    return <p>Nessuna proposta disponibile.</p>;
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div
          key={proposal.id}
          className="border p-4 rounded shadow-md space-y-2 bg-gray-100"
        >
          <h4 className="text-lg font-bold">{proposal.title}</h4>
          <p className="text-sm text-gray-700">
            Stato:{" "}
            <span
              className={`font-semibold ${
                proposal.status === "open" ? "text-green-600" : "text-red-600"
              }`}
            >
              {proposal.status === "open" ? "Aperto" : "Chiuso"}
            </span>
          </p>
          {proposal.winner && (
            <p className="text-sm text-gray-700">
              Vincitore:{" "}
              <span className="font-semibold">{proposal.winner}</span>
            </p>
          )}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setSelectedProposal(proposal)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Gestisci Votanti
            </button>
            {proposal.status === "open" && (
              <button
                onClick={() => handleCloseProposal(proposal.id)}
                disabled={closing}
                className={`${
                  closing
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } text-white px-4 py-2 rounded`}
              >
                {closing ? "Chiudendo..." : "Chiudi Proposta"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
