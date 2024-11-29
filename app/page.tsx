"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAllProposalIdsAndTitlesQuery } from "@/hooks/contract-query";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const {
    data: proposals,
    isLoading: queryProposalsLoading,
    error: queryProposalsError,
  } = useAllProposalIdsAndTitlesQuery();
  const totalProposals = proposals?.proposals.length || 0;
  const [displayedCount, setDisplayedCount] = useState(0);
  useEffect(() => {
    if (!queryProposalsLoading && totalProposals > 0) {
      let start = 0;
      const duration = 1000; // Durata dell'animazione in millisecondi
      const increment = Math.ceil(totalProposals / (duration / 50)); // Passo incrementale

      const interval = setInterval(() => {
        start += increment;
        if (start >= totalProposals) {
          start = totalProposals;
          clearInterval(interval);
        }
        setDisplayedCount(start);
      }, 50); // Aggiorna il numero ogni 50ms
    }
  }, [queryProposalsLoading, totalProposals]);
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white">
        <section className="text-center max-w-3xl px-6 py-12">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to{" "}
            <span className="text-blue-500">ElectWasm Voting DApp</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            This decentralized application leverages blockchain technology to
            enable transparent and secure voting. Whether you're an admin
            managing proposals or a voter sharing your preference, this app
            makes it easy and trustworthy.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="secondary">
              <Link href="/proposals">Explore Proposals</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="w-full max-w-4xl px-6 py-12">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Propose</CardTitle>
                <CardDescription>
                  Create and manage proposals seamlessly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Admins can create new proposals, define options, set
                  expiration dates, and manage the voting process.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/admin">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Vote</CardTitle>
                <CardDescription>
                  Secure and fair voting system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Voters can cast their votes on active proposals with
                  confidence, knowing their preferences are secure.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/proposals">Vote Now</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>Proposal Statistics</CardTitle>
                <CardDescription>
                  A transparent and dynamic way to track proposals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Discover the number of proposals created and their impact on
                  governance, powered by blockchain transparency.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                {queryProposalsLoading ? (
                  <Skeleton className="h-10 w-1/2 rounded-lg bg-gray-200 animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-center">
                    {displayedCount}
                  </p>
                )}
                <p className="text-sm text-gray-400 text-center">
                  Total number of proposals registered in the system.
                </p>
              </CardFooter>
            </Card>
          </div>
        </section>

        <footer className="py-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 Your DApp. Powered by Giacomo Occhino</p>
          <p>
            Visit our{" "}
            <Link href="/docs" className="text-blue-400 underline">
              Documentation
            </Link>{" "}
            for more details.
          </p>
        </footer>
      </main>
    </>
  );
}
