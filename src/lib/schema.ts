import { z } from "zod";

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
