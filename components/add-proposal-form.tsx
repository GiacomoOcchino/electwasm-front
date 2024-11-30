import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proposalSchema, ProposalFormValues } from "@/schema/admin-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { Button } from "./ui/button";
import MaxWidthWrapper from "./max-width-wrapper";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateProposal } from "@/hooks/contract-mutation";
import { useWallet } from "@/hooks/wallet";
import { useNotification } from "./context/notification-context";
export const ProposalForm = () => {
  const { showNotification } = useNotification();
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      option: [""],
      title: "",
      description: "",
      expires: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "option",
  });
  const { wallet } = useWallet();
  const { mutate: createProposal, isPending: creating } = useCreateProposal(
    wallet?.address,
    showNotification
  );

  const onSubmit = (data: ProposalFormValues) => {
    const parsed = proposalSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Validation error", parsed.error);
      return;
    }
    const formattedExpires = new Date(data.expires).toISOString();
    const f = new Date(formattedExpires).getTime() * 1_000_000;
    const string_date = String(f);
    const initMsg = {
      ...data,
      expires: { at_time: string_date },
    };
    createProposal({ initMsg });
  };
  return (
    <MaxWidthWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <FormLabel>Options</FormLabel>
            {fields.map((field, index) => (
              <FormItem key={field.id} className="flex items-center space-x-2">
                <FormControl>
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={form.watch(`option.${index}`)}
                    onChange={
                      (e) => form.setValue(`option.${index}`, e.target.value)
                    }
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)} 
                  className="text-red-500"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </FormItem>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Option
            </Button>
            {form.formState.errors.option && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.option.message}
              </p>
            )}
          </div>
          <FormField
            control={form.control}
            name="expires"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration (Date and Time)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP") // Show the formatted date
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={
                        (date) =>
                          form.setValue("expires", date?.toISOString() || "") // Set date as ISO string
                      }
                      disabled={(date) => date < new Date()} // Disable past dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-blue-500 text-white"
            disabled={creating}
          >
            {creating ? "Creating the Proposal..." : "Create"}
          </Button>
        </form>
      </Form>
    </MaxWidthWrapper>
  );
};
