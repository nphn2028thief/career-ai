"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updateUser } from "@/actions/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import EPath from "@/constants/path";
import { industries } from "@/constants/landing";
import useFetch from "@/hooks/useFetch";
import { IIndustry } from "@/types/landing";
import { OnboardingSchema } from "@/lib/schema";

type TFormValue = z.infer<typeof OnboardingSchema>;

function OnBoardingForm() {
  const [selectedIndustry, setSelectedIndustry] = useState<IIndustry | null>(
    null
  );
  const experienceRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const form = useForm<TFormValue>({
    resolver: zodResolver(OnboardingSchema),
  });

  const {
    isLoading: isUpdateUserLoading,
    fn: updateUserFn,
    error: updateUserError,
  } = useFetch<TFormValue>(updateUser);

  useEffect(() => {
    if (updateUserError) {
      toast.success("Failed to complete profile");
      return;
    }

    if (!isUpdateUserLoading) {
      toast.success("Profile completed successfully!");
      router.push(EPath.DASHBOARD);
    }
  }, [updateUserError, isUpdateUserLoading, router]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (experienceRef.current && experienceRef.current.type === "number") {
        e.preventDefault(); // Prevent mouse wheel scroll on number input
      }
    };

    const inputElement = experienceRef.current;
    if (inputElement) {
      inputElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    // Cleanup listener on component unmount
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const onSubmit: SubmitHandler<TFormValue> = async (data) => {
    try {
      console.log({
        ...data,
        industry: `${data.industry}-${data.subIndustry}`
          .toLowerCase()
          .replace(/ /g, "-"),
      });
      await updateUserFn({
        ...data,
        industry: `${data.industry}-${data.subIndustry}`
          .toLowerCase()
          .replace(/ /g, "-"),
      });
    } catch (error) {
      console.log("Complete profile onboarding error: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-background">
      <Card className="max-w-lg w-full mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete your profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select
                      defaultValue={field.value}
                      disabled={isUpdateUserLoading}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedIndustry(
                          industries.find((item) => item.id === value) || null
                        );
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[324px]">
                        {industries.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              {/* Sub industry */}
              {selectedIndustry && (
                <FormField
                  control={form.control}
                  name="subIndustry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub industry</FormLabel>
                      <Select
                        defaultValue={field.value}
                        disabled={isUpdateUserLoading}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sub industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          avoidCollisions={false}
                          className="max-h-[224px]"
                        >
                          {selectedIndustry.subIndustries.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}

              {/* Years of experience */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of experience</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        ref={experienceRef}
                        type="number"
                        disabled={isUpdateUserLoading}
                        placeholder="Enter years of experience"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isUpdateUserLoading}
                        placeholder="E.g: Python, TypeScript, Node.js"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-muted-foreground">
                      Separate multiple skills with commas and spaces
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional bio</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isUpdateUserLoading}
                        className="h-32 resize-none"
                        placeholder="Tell us about your professional background..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isUpdateUserLoading}
                className="w-full"
              >
                {isUpdateUserLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Complete profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default OnBoardingForm;
