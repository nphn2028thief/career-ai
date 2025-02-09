"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CoverLetter } from "@prisma/client";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { generateCoverLetter } from "@/actions/cover-letter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { coverletterSchema } from "@/lib/schema";
import useFetch from "@/hooks/useFetch";

type TFormValues = z.infer<typeof coverletterSchema>;

function CoverLetterForm() {
  const form = useForm<TFormValues>({
    resolver: zodResolver(coverletterSchema),
  });

  const {
    isLoading: isGenerating,
    fn: generateCoverLetterFn,
    data: coverLetterDataFetch,
    error: errorGenerateCoverLetter,
  } = useFetch<CoverLetter>(generateCoverLetter);

  useEffect(() => {
    if (errorGenerateCoverLetter) {
      toast.error("Failed to generate cover letter");
      return;
    }

    if (!isGenerating && coverLetterDataFetch) {
      toast.success("Cover letter generated successfully!");
    }
  }, [coverLetterDataFetch, errorGenerateCoverLetter, form, isGenerating]);

  const onSubmit: SubmitHandler<TFormValues> = async (data) => {
    try {
      await generateCoverLetterFn(data);
    } catch (error) {
      console.log("Error generate cover letter: ", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job details</CardTitle>
        <CardDescription>
          Provide information about the position you&apos;re applying for
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isGenerating}
                        placeholder="Enter company name"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Job title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isGenerating}
                        placeholder="Enter job title"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Job description */}
            <FormField
              control={form.control}
              name="jobDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="h-64 resize-none"
                      disabled={isGenerating}
                      placeholder="Write a summary about your job description..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="text-end">
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating cover letter...
                  </>
                ) : (
                  "Generate cover letter"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CoverLetterForm;
