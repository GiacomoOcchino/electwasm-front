"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { useAllProposalIdsAndTitlesQuery } from "@/hooks/contract-query";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProposalsPage = () => {
  const router = useRouter();

  const {
    data: proposals,
    isLoading: queryProposalsLoading,
    error: queryProposalsError,
  } = useAllProposalIdsAndTitlesQuery();

  if (queryProposalsLoading) return <div>Loading proposte...</div>;
  if (queryProposalsError)
    return (
      <div className="text-red-500">
        Error loading proposals: {queryProposalsError.message}
      </div>
    );

  return (
    <MaxWidthWrapper>
      <h2 className="text-3xl font-bold text-white mb-6">
        Discover All the Available Ballots
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {proposals?.proposals.map((p) => (
          <Card key={p[0]} className="shadow-md border border-gray-200">
            <CardHeader>
              <h3 className="text-xl font-semibold">{p[1]}</h3>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Link
                href={`/proposals/${p[0]}`}
                className={`${buttonVariants({
                  variant: "default",
                  size: "lg",
                })} w-full`}
              >
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default ProposalsPage;
