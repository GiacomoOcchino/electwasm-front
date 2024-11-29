"use client";
import { useState } from "react";
import VoterManagement from "@/components/voter-management";
import { ProposalForm } from "@/components/add-proposal-form";
import { useWallet } from "@/hooks/wallet";
import { useProposalByProposerQuery } from "@/hooks/contract-query";
import MyProposalList from "@/components/my-proposal-list";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ProposalInfoByResponse } from "@/types/response";

export default function AdminPage() {
  const { wallet } = useWallet();
  const [selectedProposal, setSelectedProposal] = useState<ProposalInfoByResponse | null>(null);

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
        <div className="my-4">
          <h3 className="text-lg font-semibold">Proposta Selezionata:</h3>
          <div className="flex flex-col gap-4 md:flex-row">
            <p>ID: {selectedProposal.id}</p>
            <p>Titolo: {selectedProposal.title}</p>
            <p>
              Stato:{" "}
              <span
                className={`font-semibold ${
                  selectedProposal.status === "open"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedProposal.status === "open" ? "Aperto" : "Chiuso"}
              </span>
            </p>
            {selectedProposal.winner && (
              <p>Vincitore: {selectedProposal.winner}</p>
            )}
          </div>
        </div>
      )}
      {selectedProposal && (
        <VoterManagement proposalId={selectedProposal.id} />
      )}
    </MaxWidthWrapper>
  );
}
