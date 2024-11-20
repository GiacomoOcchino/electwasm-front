'use client'
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CreateProposalForm from '@/components/create-proposal-form';
import ProposalList from '@/components/proposal-list';
import VoterManagement from '@/components/voter-management';
import { ProposalForm } from '@/components/add-proposal-form';

// Tipo per la proposta
interface Proposal {
  id: number;
  title: string;
  status: string;
  winner?: string | null;
}

export default function AdminPage() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const queryClient = useQueryClient();

  // // Query per ottenere le proposte dell'utente
  // const { data: proposals, isLoading } = useQuery<Proposal[]>(['userProposals'], fetchUserProposals);

  // if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ProposalForm />

      {/* <h2 className="text-xl font-semibold mt-6 mb-2">Le tue proposte</h2>
      <ProposalList proposals={proposals} setSelectedProposal={setSelectedProposal} />

      {selectedProposal && (
        <VoterManagement proposalId={selectedProposal.id} />
      )} */}
    </div>
  );
}
