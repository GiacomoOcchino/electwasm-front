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
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProposalsPage = () => {
  const router = useRouter();

  const {
    data: proposals,
    isLoading: queryProposalsLoading,
    error: queryProposalsError,
  } = useAllProposalIdsAndTitlesQuery();

  if (queryProposalsLoading)
    return (
      <MaxWidthWrapper>
        <h2 className="text-3xl font-bold mb-6">Loading Proposals...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-48 rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </MaxWidthWrapper>
    );
  if (queryProposalsError)
    return (
      <MaxWidthWrapper>
        <h2 className="text-3xl font-bold text-red-500 mb-4">
          Error Loading Proposals
        </h2>
        <p className="text-gray-400">
          {queryProposalsError.message || "An unexpected error occurred."}
        </p>
        <Button
          onClick={() => router.refresh()}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </MaxWidthWrapper>
    );

  return (
    <MaxWidthWrapper>
      <h2 className="text-4xl font-bold text-center mb-8">
        Explore the Latest Proposals
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {proposals?.proposals.map((p) => (
          <Card
            key={p[0]}
            className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 rounded-lg flex flex-col justify-between"
          >
            <CardHeader className="pb-2">
              <h3 className="text-xl font-semibold text-gray-800">{p[1]}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Proposal ID: <span className="font-medium">{p[0]}</span>
              </p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`font-medium ${
                    p[2] === "open" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {p[2]}
                </span>
              </p>
            </CardContent>
            <CardFooter className="pt-4">
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
