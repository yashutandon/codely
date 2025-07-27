"use client"

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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constant";


const formSchema = z.object({
  value: z.string().min(1, { message: "value is required" }).max(10000, { message: "value is too long" }),
});

export const ProjectForm = () => {
  const trpc = useTRPC();
  const queryClient=useQueryClient();
  const router=useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const onSelect=(value:string)=>{
    form.setValue("value",value,{
        shouldDirty:true,
        shouldValidate:true,
        shouldTouch:true,
    });
  }
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess:(data)=>{
        queryClient.invalidateQueries(
            trpc.projects.getMany.queryOptions(),
        );
        router.push(`/projects/${data.id}`)
    },
    onError:(error)=>{
        // TODO
        toast.error(error.message);
    }
  }));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const isPending = createProject.isPending;
  const isDisabled = isPending || !form.formState.isValid;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Form {...form}>
        <section className="space-y-6">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
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

      <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
            {PROJECT_TEMPLATES.map((template)=>(
               <Button
               key={template.title}
               variant="outline"
               size="sm"
               className="bg-white dark:bg-sidebar"
               onClick={()=>onSelect(template.prompt)}
               >
                {template.emoji} {template.title}
               </Button>
            ))}
      </div>
      </section>
    </Form>
  );
};
