import { useVotersQuery } from "@/hooks/contract-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActionToProposal } from "@/hooks/contract-mutation";
import { useWallet } from "@/hooks/wallet";
import { useState } from "react";
import { useNotification } from "./context/notification-context";
import { VoterManagementProps } from "@/types";



export default function VoterManagement({ proposalId }: VoterManagementProps) {
  const { showNotification } = useNotification();

  const { wallet } = useWallet();
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);
  const {
    data: voters,
    isLoading: queryVotersLoading,
    error: queryVotersError,
  } = useVotersQuery(proposalId, false);

  const { mutate: actionToProposal, isPending } = useActionToProposal(
    wallet?.address,
    proposalId,
    showNotification
  );
  const handleAddCheckboxChange = (voter: string) => {
    setSelectedToAdd(
      (prev) =>
        prev.includes(voter)
          ? prev.filter((v) => v !== voter) // Remove if already selected
          : [...prev, voter] // Adds if not selected
    );
  };

  const handleRemoveCheckboxChange = (voter: string) => {
    setSelectedToRemove(
      (prev) =>
        prev.includes(voter)
          ? prev.filter((v) => v !== voter) // Rimuove se già selezionato
          : [...prev, voter] // Aggiunge se non è selezionato
    );
  };

  const handleActionToVoters = () => {
    const voters = {
      add: selectedToAdd,
      rmv: selectedToRemove,
    };
    actionToProposal(
      { voters }
    );
  };

  if (queryVotersLoading) return <div>Loading voters...</div>;

  if (queryVotersError)
    return (
      <div className="text-red-500">
        Error loading voters.
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Voter Management</h2>

      {/* Pending Voters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Pending</Badge>
            <span>Voters Waiting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {voters && voters?.pending_voters?.length > 0 ? (
            <div className="space-y-2">
              {voters.pending_voters.map((voter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    id={`pending-${index}`}
                    checked={selectedToAdd.includes(voter)}
                    onCheckedChange={() => handleAddCheckboxChange(voter)}
                  />
                  <label
                    htmlFor={`pending-${index}`}
                    className="text-sm text-gray-800"
                  >
                    {voter}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No voters waiting.</p>
          )}
        </CardContent>
      </Card>

      {/* Allowed Voters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Accepted</Badge>
            <span>Authorized Voters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {voters && voters?.allowed_voters?.length > 0 ? (
            <div className="space-y-2">
              {voters.allowed_voters.map((voter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    id={`allowed-${index}`}
                    checked={selectedToRemove.includes(voter)}
                    onCheckedChange={() => handleRemoveCheckboxChange(voter)}
                  />
                  <label
                    htmlFor={`allowed-${index}`}
                    className="text-sm text-gray-800"
                  >
                    {voter}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No voters allowed.</p>
          )}
        </CardContent>
      </Card>

      {/* Voters Who Have Voted */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Voted</Badge>
            <span>Voters who voted</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {voters && voters?.has_voted_voters?.length > 0 ? (
            <div className="space-y-2">
              {voters.has_voted_voters.map((voter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <label
                    htmlFor={`voted-${index}`}
                    className="text-sm text-gray-800"
                  >
                    {voter}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No voters who voted.</p>
          )}
        </CardContent>
      </Card>

      {/* Azioni (Pulsanti per Gestire i Votanti) */}
      <div className="flex gap-4">
        <Button
          variant="default"
          onClick={handleActionToVoters}
          disabled={selectedToAdd.length === 0 || isPending}
        >
          {isPending ? "Loading" : "Accept/Remove Selected Voters"}
        </Button>
      </div>
    </div>
  );
}
