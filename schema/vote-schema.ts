import { z } from "zod";

export const voteSchema = z.object({
  option: z.string().min(1, "Please select an option."),
});

export type VoteFormValues = z.infer<typeof voteSchema>;