// import { useVotersQuery } from '@/hooks/contract-query';
// interface VoterManagementProps {
//   proposalId: number;
// }

// // Tipo per i votanti
// interface Voter {
//   address: string[];
//   status: 'pending' | 'accepted';
// }

// export default function VoterManagement({ proposalId }: VoterManagementProps) {
//   const {
//     data: voters,
//     isLoading: queryVotersLoading,
//     error: queryVotersError,
//   } = useVotersQuery(proposalId)

//   // const acceptVotersMutation = useMutation(acceptVoters, {
//   //   onSuccess: () => {
//   //     queryClient.invalidateQueries(['voters', proposalId]);
//   //   },
//   // });

//   // const removeVotersMutation = useMutation(removeVoters, {
//   //   onSuccess: () => {
//   //     queryClient.invalidateQueries(['voters', proposalId]);
//   //   },
//   // });

//   // const handleActionToVoters = (selectedVoters: string[]) => {
//   //   acceptVotersMutation.mutate({ proposalId, voters: selectedVoters });
//   // };

//   // const handleRemoveVoters = (selectedVoters: string[]) => {
//   //   removeVotersMutation.mutate({ proposalId, voters: selectedVoters });
//   // };

//   if (queryVotersLoading) return <div>Loading votanti...</div>;

//   return (
//     <div className="mt-4">
//       <h3 className="text-lg font-semibold mb-2">Gestione Votanti</h3>
//       <div className="space-y-2">
//         {voters?.pending_voters?.map((voter,index) => (
//           <label key={index} className="flex items-center">
//             <input type="checkbox" name="voter" value={voter} className="mr-2" />
//             {voter}
//           </label>
//         ))}
//         {voters?.allowed_voters?.map((voter,index) => (
//           <label key={index} className="flex items-center">
//             <input type="checkbox" name="voter" value={voter} className="mr-2" />
//             {voter}
//           </label>
//         ))}
//         {voters?.has_voted_voters?.map((voter,index) => (
//           <label key={index} className="flex items-center">
//             <input type="checkbox" name="voter" value={voter} className="mr-2" />
//             {voter}
//           </label>
//         ))}
//       </div>
//       {/* <button onClick={() => handleActionToVoters(selectedVoters)} className="bg-blue-500 text-white p-2 rounded mt-2">
//         Accetta Votanti Selezionati
//       </button>
//       <button onClick={() => handleRemoveVoters(selectedVoters)} className="bg-red-500 text-white p-2 rounded mt-2">
//         Rimuovi Votanti Selezionati
//       </button> */}
//     </div>
//   );
// }
import { useVotersQuery } from "@/hooks/contract-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActionToProposal } from "@/hooks/contract-mutation";
import { useWallet } from "@/hooks/wallet";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface VoterManagementProps {
  proposalId: number;
}

export default function VoterManagement({ proposalId }: VoterManagementProps) {
  const { wallet, connectKeplr } = useWallet();
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const {
    data: voters,
    isLoading: queryVotersLoading,
    error: queryVotersError,
  } = useVotersQuery(proposalId);

  const { mutate: actionToProposal, isPending: creating } = useActionToProposal(
    wallet?.address,
    proposalId
  );
   // Gestisce la selezione/deselezione dei votanti da aggiungere
   const handleAddCheckboxChange = (voter: string) => {
    setSelectedToAdd((prev) =>
      prev.includes(voter)
        ? prev.filter((v) => v !== voter) // Rimuove se già selezionato
        : [...prev, voter] // Aggiunge se non è selezionato
    );
  };
  // Gestisce la selezione/deselezione dei votanti da rimuovere
  const handleRemoveCheckboxChange = (voter: string) => {
    setSelectedToRemove((prev) =>
      prev.includes(voter)
        ? prev.filter((v) => v !== voter) // Rimuove se già selezionato
        : [...prev, voter] // Aggiunge se non è selezionato
    );
  };

  // Placeholder per la mutation di accettazione
  const handleActionToVoters = () => {
    console.log("Votanti accettati:", selectedToAdd);
    // Chiama la tua mutation qui
    const voters = {
      add:selectedToAdd,
      rmv: selectedToRemove,
    };
    actionToProposal(
      { voters },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["voters", proposalId],
          });
          console.log("ok");
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  // Placeholder per la mutation di rimozione
  const handleRemoveVoters = () => {
    console.log("Votanti rimossi:", selectedToRemove);
    // Chiama la tua mutation qui
    // removeVotersMutation.mutate({ proposalId, voters: selectedToRemove });
  };
  if (queryVotersLoading) return <div>Caricamento votanti...</div>;

  if (queryVotersError)
    return (
      <div className="text-red-500">
        Errore durante il caricamento dei votanti.
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestione Votanti</h2>

      {/* Pending Voters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Pending</Badge>
            <span>Votanti in Attesa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          { voters && voters?.pending_voters?.length > 0 ? (
            <div className="space-y-2">
              {voters.pending_voters.map((voter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox id={`pending-${index}`} checked={selectedToAdd.includes(voter)}
                    onCheckedChange={() => handleAddCheckboxChange(voter)}/>
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
            <p className="text-gray-500">Nessun votante in attesa.</p>
          )}
        </CardContent>
      </Card>

      {/* Allowed Voters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Accepted</Badge>
            <span>Votanti Autorizzati</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {voters && voters?.allowed_voters?.length > 0 ? (
            <div className="space-y-2">
              {voters.allowed_voters.map((voter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox id={`allowed-${index}`}checked={selectedToRemove.includes(voter)}
                    onCheckedChange={() => handleRemoveCheckboxChange(voter)} />
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
            <p className="text-gray-500">Nessun votante autorizzato.</p>
          )}
        </CardContent>
      </Card>

      {/* Voters Who Have Voted */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Voted</Badge>
            <span>Votanti che Hanno Votato</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {voters &&  voters?.has_voted_voters?.length > 0 ? (
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
            <p className="text-gray-500">Nessun votante che ha votato.</p>
          )}
        </CardContent>
      </Card>

      {/* Azioni (Pulsanti per Gestire i Votanti) */}
      <div className="flex gap-4">
        <Button variant="default" onClick={handleActionToVoters} disabled={selectedToAdd.length === 0}>
          Accetta/Rimuovi Votanti Selezionati
        </Button>
        {/* <Button variant="destructive" onClick={handleRemoveVoters} disabled={selectedToRemove.length === 0}>
          Rimuovi Votanti Selezionati
        </Button> */}
      </div>
    </div>
  );
}

