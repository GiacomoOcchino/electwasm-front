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
import { CalendarIcon, Plus, Trash } from "lucide-react"; // Icone per aggiungere/rimuovere opzioni
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
      option: [""], // Una opzione iniziale
      title: "",
      description: "",
      expires: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "option", // Nome del campo dinamico
  });
  const { wallet, connectKeplr } = useWallet();
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
    // Invia i dati al contratto (ad esempio tramite CosmJS)
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
                    value={form.watch(`option.${index}`)} // Legge dinamicamente il valore
                    onChange={
                      (e) => form.setValue(`option.${index}`, e.target.value) // Imposta il valore
                    }
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)} // Rimuove l'opzione
                  className="text-red-500"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </FormItem>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")} // Aggiunge una nuova opzione vuota
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
                          format(new Date(field.value), "PPP") // Mostra la data formattata
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
                          form.setValue("expires", date?.toISOString() || "") // Imposta la data come stringa ISO
                      }
                      disabled={(date) => date < new Date()} // Disabilita date passate
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-blue-500 text-white" 
              disabled={creating}
              >
             {creating ? "Creando la Proposta..." : "Crea"}
          </Button>
        </form>
      </Form>
      {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <Input placeholder="Enter the title" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <Textarea
            placeholder="Enter the description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Options</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                placeholder={`Option ${index + 1}`}
                {...register(`option.${index}` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
                className="text-red-500"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append("")} // Aggiunge una nuova opzione vuota
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Option
          </Button>
          {errors.option && (
            <p className="text-red-500 text-sm">{errors.option.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">
            Expiration (Date and Time)
          </label>
          <Input
            type="datetime-local"
            {...register("expires")}
            className="border border-gray-300 rounded p-2"
          />
          {errors.expires && (
            <p className="text-red-500 text-sm">{errors.expires.message}</p>
          )}
        </div>

        <Button type="submit" className="bg-blue-500 text-white">
          Submit
        </Button>
      </form> */}
    </MaxWidthWrapper>
  );
};
