import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useProposalRunningQuery } from "@/hooks/contract-query";

ChartJS.register(ArcElement, Tooltip, Legend);

const VotingPieChart = ({id}:{id: number}) => {
  const [counts, setCounts] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
  ]);
  const { data: proposal, isLoading, error } = useProposalRunningQuery(id);
  // Recupera i dati della query
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("http://localhost:4000/vote-counts"); // Sostituisci con la tua API
    //     const data = await response.json();
    //     setCounts(data.data.counts);
    //   } catch (error) {
    //     console.error("Errore durante il fetch dei dati:", error);
    //   }
    // };
    if (proposal) setCounts(proposal?.counts);

    // fetchData();

    // Aggiorna periodicamente
    // const interval = setInterval(fetchData, 5000); // Aggiorna ogni 5 secondi
    // return () => clearInterval(interval);
  }, [proposal]);

  // Configurazione del grafico
  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-center text-lg font-bold mb-4">Voting Results</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default VotingPieChart;
