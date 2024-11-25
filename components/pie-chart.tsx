import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useProposalRunningQuery } from "@/hooks/contract-query";

ChartJS.register(ArcElement, Tooltip, Legend);

const VotingPieChart = ({ id }: { id: number }) => {
  const [counts, setCounts] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const { data: proposal, isLoading, error } = useProposalRunningQuery(id);

  // Genera colori casuali
  const generateColors = (num: number) => {
    const randomColor = () =>
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
    return Array.from({ length: num }, () => randomColor());
  };
  // Recupera i dati della query
  useEffect(() => {
    if (proposal) {
      setCounts(proposal.counts);
      // Aggiorna etichette e colori in base ai dati
      setLabels(proposal.counts.map((_, index) => `Option ${index + 1}`));
      setColors(generateColors(proposal.counts.length));
    }
  }, [proposal]);

  // Configurazione del grafico
  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) => color + "AA"), // Colori con trasparenza per hover
      },
    ],
  };
  // Controllo se ci sono voti validi
  const hasVotes = counts.some((count) => count > 0);

  return (
    <div className="max-w-sm mx-auto max-h-[300px]">
      <h2 className="text-center text-lg font-bold mb-4">Real Time Results</h2>
      {hasVotes ? (
        <Doughnut data={data} />
      ) : (
        <div className="text-center text-gray-500">
          Nessun voto disponibile. Attendi che i voti vengano registrati.
        </div>
      )}
    </div>
  );
};

export default VotingPieChart;
