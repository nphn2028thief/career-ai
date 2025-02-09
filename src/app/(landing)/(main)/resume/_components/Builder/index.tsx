"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { toast } from "sonner";

import { saveResume } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ResumeEntryForm from "../EntryForm";
import { linkedInText, twitterText } from "@/constants/markdown";
import useFetch from "@/hooks/useFetch";
import { resumeSchema } from "@/lib/schema";
import { entriesToMarkdown, extractInfo } from "@/lib/utils";

interface IProps {
  initialContent: string | null;
}

type TFormValues = z.infer<typeof resumeSchema>;

function ResumeBuilder({ initialContent }: IProps) {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [resumeMode, setResumeMode] = useState<"edit" | "preview">("preview");
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  // Use for donwload PDF
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  const defaultValues = useMemo<TFormValues>(() => {
    const values: TFormValues = {
      contactInfo: {
        email: "",
        mobile: "",
        linkedin: "",
        twitter: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    };

    if (initialContent) {
      const { email, mobile, summary, skills } = extractInfo(initialContent);
      values.contactInfo.email = email;
      values.contactInfo.mobile = mobile;
      values.summary = summary;
      values.skills = skills;
    }

    return values;
  }, [initialContent]);

  const form = useForm<TFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
  });

  const {
    isLoading: isSavingResume,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  useEffect(() => {
    if (initialContent) {
      setActiveTab("preview");
      setPreviewContent(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    if (saveError) {
      toast.error("Failed to save resume.");
      return;
    }

    if (!isSavingResume && saveResult) {
      toast.success("Resume saved successfully.");
    }
  }, [saveError, isSavingResume, saveResult]);

  // Get Contact information for markdown
  const getContactMarkdown = useCallback(() => {
    const { contactInfo } = form.watch();
    const parts: string[] = [];

    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin) parts.push(linkedInText(contactInfo.linkedin));
    if (contactInfo.twitter) parts.push(twitterText(contactInfo.twitter));

    return parts.length
      ? `## <div align="center">Contact information</div>
            \n\n<div align="center">${user?.fullName}</div>
            \n\n<div align="center">${parts.slice(0, 2).join(" | ")}</div>
            \n\n<div align="center">${parts.slice(2).join(" | ")}</div>`
      : "";
  }, [form, user?.fullName]);

  // Get others content for markdown
  const getCombinedContent = useCallback(() => {
    const { summary, skills, experience, education, projects } = form.watch();

    return [
      getContactMarkdown(),
      summary && `## Professional summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown("Experience", experience),
      entriesToMarkdown("Education", education),
      entriesToMarkdown("Projects", projects),
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [form, getContactMarkdown]);

  // Switch to tab preview will show data filled from the form
  useEffect(() => {
    if (!initialContent && activeTab === "preview") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [activeTab, getCombinedContent, initialContent]);

  // Use for markdown change will update "Contact information", "Professional summary" and "Skills" form's sections
  const handleMardownChange = (value?: string) => {
    if (!value) return;

    const { email, mobile, summary, skills } = extractInfo(value);
    const { setValue } = form;
    setPreviewContent(value!);
    setValue("contactInfo.email", email);
    setValue("contactInfo.mobile", mobile);
    setValue("summary", summary);
    setValue("skills", skills);
  };

  // Generate resume with PDF
  const handleGeneratePDF = async () => {
    if (!previewContent || !resumeRef.current) return;

    await setIsGeneratingPDF(true);
    try {
      // Capture the HTML as an image
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/jpeg");

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210 - 8 - 8; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", 8, 8, imgWidth, imgHeight);
      pdf.save("resume.pdf");
    } catch (error) {
      console.log("Error generating PDF: ", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Save resume
  const onSubmit = async () => {
    try {
      await saveResumeFn(previewContent);
    } catch (error) {
      console.log("Error saving resume: ", error);
      toast.error("Failed to save resume");
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume builder
        </h1>
        <div className="space-x-3">
          <Button
            variant="destructive"
            disabled={isSavingResume}
            onClick={onSubmit}
          >
            {isSavingResume ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </Button>
          <Button
            disabled={isGeneratingPDF || isSavingResume}
            onClick={handleGeneratePDF}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList>
          <TabsTrigger
            value="edit"
            disabled={isGeneratingPDF || isSavingResume}
          >
            Form
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            disabled={isGeneratingPDF || isSavingResume}
          >
            Markdown
          </TabsTrigger>
        </TabsList>

        {/* Edit tab (Form) */}
        <TabsContent value="edit" className="mt-4">
          <Form {...form}>
            <form className="space-y-8 mt-8">
              {/* Contact information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Contact information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={isSavingResume}
                            placeholder="your@email.com"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Mobile number */}
                  <FormField
                    control={form.control}
                    name="contactInfo.mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            disabled={isSavingResume}
                            placeholder="+1 234 567 8900"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* LinkedIn URL */}
                  <FormField
                    control={form.control}
                    name="contactInfo.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkeIn URL (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            disabled={isSavingResume}
                            placeholder="https://linkedin.com/in/your-profile"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Twitter */}
                  <FormField
                    control={form.control}
                    name="contactInfo.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter / X profile (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            disabled={isSavingResume}
                            placeholder="https://twitter.com/your-handle"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Professional summary */}
              <div className="space-y-2">
                {/* Contact information */}
                <h3 className="text-lg font-medium">Professional summary</h3>
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="h-32 resize-none"
                          disabled={isSavingResume}
                          placeholder="Write a compelling professional summary..."
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                {/* Contact information */}
                <h3 className="text-lg font-medium">Skills</h3>
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="h-32 resize-none"
                          disabled={isSavingResume}
                          placeholder="List your key skills..."
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Work experiences */}
              <div className="space-y-2">
                {/* Contact information */}
                <h3 className="text-lg font-medium">Work experiences</h3>
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ResumeEntryForm
                          type="experience"
                          entries={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Education */}
              <div className="space-y-2">
                {/* Contact information */}
                <h3 className="text-lg font-medium">Education</h3>
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ResumeEntryForm
                          type="education"
                          entries={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Projects */}
              <div className="space-y-2">
                {/* Contact information */}
                <h3 className="text-lg font-medium">Projects</h3>
                <FormField
                  control={form.control}
                  name="projects"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ResumeEntryForm
                          type="project"
                          entries={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </TabsContent>

        {/* Preview tab (Markdown) */}
        <TabsContent value="preview">
          <Button
            type="button"
            variant="link"
            disabled={isGeneratingPDF}
            className="mb-2"
            onClick={() =>
              setResumeMode((prev) => (prev === "preview" ? "edit" : "preview"))
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="w-4 h-4" />
                Edit resume
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4" />
                Show preview
              </>
            )}
          </Button>

          {resumeMode === "edit" && (
            <div className="flex items-center gap-2 p-3 border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                You will lose editted markdown if you update the form data
              </span>
            </div>
          )}

          <div
            className={`border rounded ${
              resumeMode === "edit" ? "mt-4" : "mt-1"
            }`}
          >
            <MDEditor
              value={previewContent || ""}
              height={800}
              preview={resumeMode}
              onChange={(value) => handleMardownChange(value)}
            />
          </div>
          <div ref={resumeRef} className={isGeneratingPDF ? "block" : "hidden"}>
            <MDEditor.Markdown
              source={previewContent || ""}
              style={{
                background: "#fff",
                color: "#000",
              }}
            />
          </div>
          {/* <div ref={resumeRef}>
            <h1>test123123</h1>
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ResumeBuilder;
