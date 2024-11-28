import { z } from "zod";

export const proposalSchema = z.object({
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required."),
    option: z
      .array(z.string().min(1, "Each option must be at least 1 character long."))
      .min(2, "You must provide at least two options."),
    expires: z.string().refine(
      (value) => !isNaN(Date.parse(value)), // Verifica che la stringa sia una data valida
      "Invalid date format. Please select a valid date."
    ),
  });

export type ProposalFormValues = z.infer<typeof proposalSchema>;
