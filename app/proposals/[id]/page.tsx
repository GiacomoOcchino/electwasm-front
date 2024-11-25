"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useProposalQuery } from "@/hooks/contract-query";
import { z } from "zod";
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

// Schema per validare il form
const voteSchema = z.object({
  option: z.string().min(1, "Please select an option."),
});

type VoteFormValues = z.infer<typeof voteSchema>;

const ProposalDetailsPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { wallet } = useStore();

  // Query per i dettagli della proposta
  const { data: proposal, isLoading, error } = useProposalQuery(id);
  const { mutate: askToJoin, isPending: asking } = useAskToJoinProposal(
    wallet?.address,
    id
  );

  const { mutate: voteProposal, isPending: voting } = useVoteProposal(
    wallet?.address,
    id
  );

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
    voteProposal(data.option, {
      onSuccess: () => {
        console.log("Vote submitted successfully.");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const handleRequestAccess = () => {
    askToJoin(undefined, {
      onSuccess: () => {
        console.log("Request for access submitted successfully.");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  if (isLoading) return <div>Loading proposal details...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <MaxWidthWrapper>
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold">{proposal?.title}</h1>
          <Badge
            variant={proposal?.status === "open" ? "default" : "destructive"}
          >
            {proposal?.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{proposal?.description}</p>
          <p>
            <span className="font-semibold">Proposer:</span> {proposal?.proposer}
          </p>
          <p>
            <span className="font-semibold">Expires:</span>{" "}
            {new Date(
              Number(proposal?.expires.at_time) / 1_000_000
            ).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Form per votare */}
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
                            <FormItem key={index} className="flex items-center space-x-3">
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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={voting}
                  >
                    {voting ? "Submitting Vote..." : "Submit Vote"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Grafico per risultati */}
        <Card className="shadow-md">
          <CardHeader>
            <h2 className="text-lg font-semibold">Real Time Results</h2>
          </CardHeader>
          <CardContent>
            <VotingPieChart id={id} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button
          onClick={handleRequestAccess}
          disabled={asking}
          className="w-full bg-yellow-500 text-white"
        >
          {asking ? "Requesting Access..." : "Request Voting Access"}
        </Button>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProposalDetailsPage;
