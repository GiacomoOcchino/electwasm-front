import { useCloseProposal } from "@/hooks/contract-mutation";
import { useWallet } from "@/hooks/wallet";
import { useNotification } from "./context/notification-context";
import { MyProposalListProps } from "@/types";
import { queryClient } from "@/providers/tanstack";

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
        queryClient.invalidateQueries({
          queryKey: ["proposals_by_proposer", wallet?.address],
        });
        showNotification("default", `Proposal ${id} closed successfully.`);
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
    return <p>No proposal available</p>;
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
            Status:{" "}
            <span
              className={`font-semibold ${
                proposal.status === "open" ? "text-green-600" : "text-red-600"
              }`}
            >
              {proposal.status === "open" ? "Open" : "Closed"}
            </span>
          </p>
          {proposal.winner && (
            <p className="text-sm text-gray-700">
              Winner:{" "}
              <span className="font-semibold">{proposal.winner}</span>
            </p>
          )}
          <div className="flex justify-between items-center mt-4 gap-3">
          {proposal.status === "open"  && (
            <button
              onClick={() => setSelectedProposal(proposal)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Manage Voters
            </button>
            )}
            {proposal.winner === null && (
              <button
                onClick={() => handleCloseProposal(proposal.id)}
                disabled={closing}
                className={`${
                  closing
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } text-white px-4 py-2 rounded`}
              >
                {closing ? "Closing..." : "Close Proposal"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
