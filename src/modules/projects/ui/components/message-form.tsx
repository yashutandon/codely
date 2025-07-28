import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Usage } from "./usage";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z.string().min(1, { message: "value is required" }).max(10000, { message: "value is too long" }),
});

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const router=useRouter();
  const queryClient=useQueryClient();
  const {data:usage}=useQuery(trpc.usage.status.queryOptions());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess:()=>{
        form.reset();
        queryClient.invalidateQueries(
            trpc.messages.getMany.queryOptions({projectId}),
        );
        queryClient.invalidateQueries(
          trpc.usage.status.queryOptions()
        )
    },
    onError:(error)=>{
        toast.error(error.message);
        if(error.data?.code==="TOO_MANY_REQUESTS"){
          router.push("/pricing")
        }
    }
  }));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };

  const isPending = createMessage.isPending;
  const isDisabled = isPending || !form.formState.isValid;
  const [isFocused, setIsFocused] = useState(false);
  const showUsage = !!usage;

  return (
    <Form {...form}>
      {showUsage && (
        <Usage
         points={usage.remainingPoints}
         msBeforeNext={usage.msBeforeNext}
        />
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent text-sm"
              placeholder="What would you like to build?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />

        <div className="flex items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium">
              <span>⌘</span>Enter
            </kbd>{" "}
            to submit
          </div>

          <Button
            disabled={isDisabled}
            type="submit"
            className={cn(
              "size-8 rounded-full transition-colors",
              isDisabled && "bg-muted-foreground border"
            )}
          >
            <ArrowUpIcon className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
