"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const formSchema = z.object({
  search: z.string().min(0).max(200),
});

interface SearchBarProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values?.search);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  return (
    <Form {...form}>
       
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between items-center space-x-2 "
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="search here..." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form?.formState?.isSubmitting}
          variant="outline"
        >
          {form?.formState?.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Search className="mr-2" /> Search
        </Button>
      </form>
    </Form>
  );
}
