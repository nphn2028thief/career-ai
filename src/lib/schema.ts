import { z } from "zod";

// Onboarding page
export const OnboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z
    .string()
    .max(500)
    .optional()
    .transform((e) => (e ? e : "")),
  experience: z
    .string({
      required_error: "Experience must be between 0 and 50 years",
    })
    .transform((val) => parseFloat(val))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at lease 0 year")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z
    .string({
      required_error: "Skill cannot be empty",
    })
    .transform((val) =>
      val ? val.split(",").map((skill) => skill.trim()) : []
    )
    .pipe(z.array(z.string())),
});

// Resume page (too much)
export const contactInfoSchema = z.object({
  email: z
    .string({ required_error: "Email cannot be empty" })
    .email("Invalid email"),
  mobile: z
    .string({ required_error: "Mobile phone cannot be empty" })
    .refine((value) =>
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(value)
    ),
  linkedin: z
    .string()
    .optional()
    .transform((e) => (e ? e : "")),
  twitter: z
    .string()
    .optional()
    .transform((e) => (e ? e : "")),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z
      .string()
      .optional()
      .transform((e) => (e ? e : "")),
    description: z.string().min(1, "Description is required"),
    isCurrent: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.isCurrent && !data.endDate) return false;
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({
  contactInfo: contactInfoSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
});

export const coverletterSchema = z.object({
  companyName: z.string({ required_error: "Company name cannot be empty" }),
  jobTitle: z.string({ required_error: "Job title cannot be empty" }),
  jobDesc: z.string({
    required_error: "Please enter your content for job application",
  }),
});
