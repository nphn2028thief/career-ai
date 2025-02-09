"use client";

import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { improveWithAi } from "@/actions/resume";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { entrySchema } from "@/lib/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { formatDisplayDate } from "@/lib/utils";
import { TEntry } from "@/types/resume";

interface IProps {
  type: "experience" | "education" | "project";
  entries: TEntry[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...event: any[]) => void;
}

function ResumeEntryForm(props: IProps) {
  const { type, entries, onChange } = props;

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const defaultValues = useMemo<TEntry>(() => {
    return {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    };
  }, []);

  const form = useForm<TEntry>({
    mode: "onBlur",
    resolver: zodResolver(entrySchema),
    defaultValues,
  });

  const {
    isLoading: isImproving,
    fn: improveWithAiFn,
    data: improvedContent,
    error: improveError,
  } = useFetch<string>(improveWithAi);

  useEffect(() => {
    if (improveError) {
      toast.success("Description improved failed.");
      return;
    }

    if (!isImproving && improvedContent) {
      form.setValue("description", improvedContent);
      toast.success("Description improved successfully.");
    }
  }, [improveError, isImproving, improvedContent, form]);

  const handleImproveDescription = async () => {
    const currentContent = form.watch("description");
    if (!currentContent) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAiFn({ type, currentContent });
  };

  const handleCancel = () => {
    form.reset(defaultValues);
    setIsAdding(false);
  };

  const handleAdd: SubmitHandler<TEntry> = (data) => {
    const formattedEntry: TEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.isCurrent ? "" : formatDisplayDate(data.endDate!),
    };

    onChange([...entries, formattedEntry]);
    handleCancel();
  };

  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle>
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.isCurrent
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Title / position */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / Position</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your title / position" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Organization / company */}
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization / Company</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Organization / Company you used to work for"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Start date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Input {...field} type="month" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* End date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="month"
                        disabled={form.watch("isCurrent")}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4 mt-4">
              {/* Is current */}
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="flex-1">Current</FormLabel>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isImproving}
                        className="h-32 resize-none"
                        placeholder={`Description of your ${type}`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving || !form.watch("description")}
              >
                {isImproving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Improving
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Improve with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end items-center gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={form.handleSubmit(handleAdd)}>
              <PlusCircle className="w-4 h-4" />
              Add entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="w-4 h-4" />
          Add {type}
        </Button>
      )}
    </div>
  );
}

export default ResumeEntryForm;
