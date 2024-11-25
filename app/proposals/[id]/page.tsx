"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProposalQuery, useVotersQuery } from "@/hooks/contract-query";
// import { useVoteMutation } from "@/hooks/contract-mutation";
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
  });

  // Form per selezionare un'opzione
  const { handleSubmit, control, setValue, watch } = useForm<VoteFormValues>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      option: "",
    },
  });

  // const {
  //   data: voters,
  //   isLoading: queryVotersLoading,
  //   error: queryVotersError,
  // } = useVotersQuery(id)
  const handleRequestAccess = () => {
    askToJoin(undefined, {
      onSuccess: () => {
        // queryClient.invalidateQueries({
        //   queryKey: ["proposal_by_proposer", wallet?.address],
        // });
        console.log("ok");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  if (isLoading) return <div>Loading proposal details...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const onSubmit = (data: VoteFormValues) => {
    const parsed = voteSchema.safeParse(data);
    console.log("voto", parsed);
    console.log("voto", parsed);
    if (!parsed.success) {
      console.error("Validation error", parsed.error);
      return;
    }
    voteProposal(data.option, {
      onSuccess: () => {
        // queryClient.invalidateQueries({
        //   queryKey: ["proposal_by_proposer", wallet?.address],
        // });
        console.log("ok");
      },
      onError: (error) => {
        console.error(error);
      },
    });

    // const formattedExpires = new Date(data.expires).toISOString();
    // const f = new Date(formattedExpires).getTime() * 1_000_000;
    // const string_date = String(f);

    // const initMsg = {
    //   ...data,
    //   expires: { at_time: string_date },
    // };
    // createProposal(
    //   { initMsg },
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({
    //         queryKey: ["proposal_by_proposer", wallet?.address],
    //       });
    //       console.log("ok");
    //     },
    //     onError: (error) => {
    //       console.error(error);
    //     },
    //   }
    // );
    // Invia i dati al contratto (ad esempio tramite CosmJS)
  };
  return (
    <MaxWidthWrapper>
      <h1 className="text-xl md:text-3xl font-bold mb-4">{proposal?.title}</h1>
      <p className="mb-4">{proposal?.description}</p>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p>
            Status:
            <span
              className={`${
                proposal?.status == "open" ? "bg-green-500" : "bg-red-500"
              } p-1 font-bold rounded-lg`}
            >
              {proposal?.status}
            </span>
          </p>
          <p>
            Expires:{" "}
            {new Date(
              Number(proposal?.expires.at_time) / 1_000_000
            ).toLocaleString()}
          </p>
          <p>Proposer: {proposal?.proposer}</p>
          <div className="hidden md:block">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
                <FormField
                  control={form.control}
                  name="option"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Select an option:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          // value={selectedOption}
                          // onValueChange={(value) => setValue("option", value)}
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            {proposal?.options.map((option, index) => (
                              <FormControl key={index}>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={index.toString()}
                                    id={`option-${index}`}
                                  />
                                  {/* <label
                              htmlFor={`option-${index}`}
                              className="text-sm"
                            >
                              {option}
                            </label> */}
                                  <FormLabel className="font-normal">
                                    {option}
                                  </FormLabel>
                                </div>
                              </FormControl>
                            ))}
                            <FormMessage />
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="space-y-4 mt-2">
                  <Button type="submit" className=" w-full">
                    Submit Vote
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <VotingPieChart id={id} />
      </div>
      <div className="md:hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <FormField
              control={form.control}
              name="option"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select an option:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      // value={selectedOption}
                      // onValueChange={(value) => setValue("option", value)}
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        {proposal?.options.map((option, index) => (
                          <FormControl key={index}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={index.toString()}
                                id={`option-${index}`}
                              />
                              {/* <label
                              htmlFor={`option-${index}`}
                              className="text-sm"
                            >
                              {option}
                            </label> */}
                              <FormLabel className="font-normal">
                                {option}
                              </FormLabel>
                            </div>
                          </FormControl>
                        ))}
                        <FormMessage />
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="space-y-4 mt-2">
              <Button type="submit" className=" w-full">
                Submit Vote
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="mt-6">
        <Button
          onClick={handleRequestAccess}
          disabled={asking}
          className="bg-yellow-500 text-white w-full"
        >
          {asking ? "Requesting Access..." : "Request Voting Access"}
        </Button>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProposalDetailsPage;
