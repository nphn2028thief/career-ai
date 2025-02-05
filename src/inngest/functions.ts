import { GoogleGenerativeAI } from "@google/generative-ai";

import { inngest } from "./client";
import { prompt } from "@/constants/gemini";
import { db } from "@/lib/prisma";
import { getNextUpdateDate, handleCleannedText } from "@/lib/utils";

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = googleGenerativeAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Weekly on Sunday of midnight
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const { response } = await step.ai.wrap(
        "gemini",
        async (p) => await model.generateContent(p),
        prompt(industry)
      );

      const part = response.candidates?.[0].content.parts[0];
      const text = part && "text" in part ? part.text : ""; // Check if exist "text" field in part will get text or empty string
      const insights = JSON.parse(handleCleannedText(text));

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdated: getNextUpdateDate(),
          },
        });
      });
    }
  }
);
