"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProposalList from "@/components/proposal-list";
import VoterManagement from "@/components/voter-management";
import { ProposalForm } from "@/components/add-proposal-form";
import { useWallet } from "@/hooks/wallet";
import { useProposalByProposerQuery } from "@/hooks/contract-query";
import MyProposalList from "@/components/my-proposal-list";
import { useCreateProposal } from "@/hooks/contract-mutation";
import MaxWidthWrapper from "@/components/max-width-wrapper";

// Tipo per la proposta
interface Proposal {
  id: number;
  title: string;
  status: string;
  winner?: string | null;
}

export default function AdminPage() {
  const { wallet, connectKeplr } = useWallet();
  const [selectedProposal, setSelectedProposal] = useState<
    [number, string] | null
  >(null);

  // Query per ottenere le proposte dell'utente
  const {
    data: proposals,
    isLoading: queryLoading,
    error: queryError,
  } = useProposalByProposerQuery(wallet?.address);

  if (queryError) return <div>Errore: {queryError.message}</div>;
  return (
    <MaxWidthWrapper>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <ProposalForm />

        <h2 className="text-xl font-semibold mt-6 mb-2">Le tue proposte</h2>
        {queryLoading ? (
          <div>Loading...</div>
        ) : (
          <MyProposalList
            proposals={proposals?.proposals}
            setSelectedProposal={setSelectedProposal}
          />
        )}
        {selectedProposal && (
          <div>
            <h3 className="text-lg font-semibold">Proposta Selezionata:</h3>
            <p>ID: {selectedProposal[0]}</p>
            <p>Titolo: {selectedProposal[1]}</p>
            {/* Esegui altre azioni */}
          </div>
        )}
        {selectedProposal && (
          <VoterManagement proposalId={selectedProposal[0]} />
        )}
    </MaxWidthWrapper>
  );
}
