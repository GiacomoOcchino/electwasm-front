import { useVotersQuery } from '@/hooks/contract-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface VoterManagementProps {
  proposalId: number;
}

// Tipo per i votanti
interface Voter {
  address: string[];
  status: 'pending' | 'accepted';
}

export default function VoterManagement({ proposalId }: VoterManagementProps) {
  const {
    data: voters,
    isLoading: queryVotersLoading,
    error: queryVotersError,
  } = useVotersQuery(proposalId)

  // const acceptVotersMutation = useMutation(acceptVoters, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['voters', proposalId]);
  //   },
  // });

  // const removeVotersMutation = useMutation(removeVoters, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['voters', proposalId]);
  //   },
  // });

  // const handleAcceptVoters = (selectedVoters: string[]) => {
  //   acceptVotersMutation.mutate({ proposalId, voters: selectedVoters });
  // };

  // const handleRemoveVoters = (selectedVoters: string[]) => {
  //   removeVotersMutation.mutate({ proposalId, voters: selectedVoters });
  // };

  if (queryVotersLoading) return <div>Loading votanti...</div>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Gestione Votanti</h3>
      <div className="space-y-2">
        {voters?.pending_voters?.map((voter,index) => (
          <label key={index} className="flex items-center">
            <input type="checkbox" name="voter" value={voter} className="mr-2" />
          </label>
        ))}
        {voters?.allowed_voters?.map((voter,index) => (
          <label key={index} className="flex items-center">
            <input type="checkbox" name="voter" value={voter} className="mr-2" />
          </label>
        ))}
        {voters?.has_voted_voters?.map((voter,index) => (
          <label key={index} className="flex items-center">
            <input type="checkbox" name="voter" value={voter} className="mr-2" />
          </label>
        ))}
      </div>
      {/* <button onClick={() => handleAcceptVoters(selectedVoters)} className="bg-blue-500 text-white p-2 rounded mt-2">
        Accetta Votanti Selezionati
      </button>
      <button onClick={() => handleRemoveVoters(selectedVoters)} className="bg-red-500 text-white p-2 rounded mt-2">
        Rimuovi Votanti Selezionati
      </button> */}
    </div>
  );
}
