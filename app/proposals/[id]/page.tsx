"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  useProposalQuery,
  useProposalResultQuery,
  useVotersQuery,
} from "@/hooks/contract-query";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  useAskToJoinProposal,
  useVoteProposal,
} from "@/hooks/contract-mutation";
import useStore from "@/store/store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import VotingPieChart from "@/components/pie-chart";
import { Badge } from "@/components/ui/badge";
import { useNotification } from "@/components/context/notification-context";
import { VoteFormValues, voteSchema } from "@/schema/vote-schema";
import { useEffect, useState } from "react";


const ProposalDetailsPage = ({ params }: { params: { id: number } }) => {
  const { showNotification } = useNotification();

  const { id } = params;
  const { wallet } = useStore();
  const [skipQuery, setSkipQuery] = useState(false);
  const { data: proposal, isLoading, error } = useProposalQuery(id);
  const { mutate: askToJoin, isPending: asking } = useAskToJoinProposal(
    wallet?.address,
    id,
    showNotification
  );

  const { mutate: voteProposal, isPending: voting } = useVoteProposal(
    wallet?.address,
    id,
    showNotification
  );
  const isClosed = proposal?.status === "closed";
  const {
    data: results,
  } = useProposalResultQuery(id, isClosed);
  const {
    data: voters,
    isLoading: queryVotersLoading,
    error: queryVotersError,
  } = useVotersQuery(Number(id), skipQuery);
  if (queryVotersError) {
    console.error(queryVotersError);
  }
  const form = useForm<VoteFormValues>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      option: "",
    },
  });

  const onSubmit = (data: VoteFormValues) => {
    const parsed = voteSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Validation error", parsed.error);
      return;
    }
    voteProposal(data.option);
  };

  const handleRequestAccess = () => {
    askToJoin(undefined);
  };
  // Checking whether the user is among the allowed_voters
  const isAllowedVoter = voters?.allowed_voters.includes(wallet?.address || "");
  // Checking whether the user is among the allowed_voters
  const AlreadyVoted = voters?.has_voted_voters.includes(wallet?.address || "");
  useEffect(() => {
    // Disable further queries if the user has already voted
    if (AlreadyVoted) setSkipQuery(true);
  }, [AlreadyVoted]);
  if (isLoading) return <div>Loading proposal details...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <MaxWidthWrapper>
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold">{proposal?.title}</h1>
          <Badge
            variant={proposal?.status === "open" ? "default" : "destructive"}
            className="uppercase"
          >
            {proposal?.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col">
          <p className="text-gray-700">{proposal?.description}</p>
          <p className="font-semibold">Proposer:</p>
          <code className="text-sm md:text-base text-ellipsis overflow-hidden">
            {proposal?.proposer}
          </code>
          <p>
            <span className="font-semibold">Expires:</span>{" "}
            {new Date(
              Number(proposal?.expires.at_time) / 1_000_000
            ).toLocaleString()}
          </p>
          {/* Show voter status */}
          {queryVotersLoading ? (
            <p>Loading voter status...</p>
          ) : (
            <p>
              {isAllowedVoter ? (
                <span className="text-green-500">You are allowed to vote.</span>
              ) : AlreadyVoted ? (
                <span className="text-red-500">You have already voted.</span>
              ) : (
                <span className="text-red-500">
                  You are not allowed to vote.
                </span>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Form to vote */}
        <Card className="bg-gray-100 shadow-md">
          <CardHeader>
            <h2 className="text-lg font-semibold">Cast Your Vote</h2>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="option"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select an option:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-2"
                        >
                          {proposal?.options.map((option, index) => (
                            <FormItem
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <RadioGroupItem
                                value={index.toString()}
                                id={`option-${index}`}
                              />
                              <FormLabel htmlFor={`option-${index}`}>
                                {option}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4">
                  {!isClosed && (
                    <Button type="submit" className="w-full" disabled={voting}>
                      {voting ? "Submitting Vote..." : "Submit Vote"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Chart by results */}
        {!isClosed ? (
          <Card className="shadow-md">
            <CardHeader>
              <h2 className="text-lg font-semibold">Real Time Results</h2>
            </CardHeader>
            <CardContent>
              <VotingPieChart id={id} status={isClosed} />
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md">
            <CardHeader>
              <h2 className="text-lg font-semibold">Proposal Result</h2>
            </CardHeader>
            <CardContent>
              {results?.winner ?
              <h3>{results?.winner}</h3>
              :
              <h3>Waiting for the count...</h3>
              }
            </CardContent>
          </Card>
        )}
      </div>
      {!isClosed && !isAllowedVoter && !AlreadyVoted && (
        <div className="mt-6">
          <Button
            onClick={handleRequestAccess}
            disabled={asking}
            className="w-full bg-yellow-500 text-white"
          >
            {asking ? "Requesting Access..." : "Request Voting Access"}
          </Button>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default ProposalDetailsPage;
