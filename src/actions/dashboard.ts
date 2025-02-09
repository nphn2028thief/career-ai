"use server";

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IndustryInsight } from "@prisma/client";

import { prompt } from "@/constants/gemini";
import { db } from "@/lib/prisma";
import { getNextUpdateDate, handleCleannedText } from "@/lib/utils";

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = googleGenerativeAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateAIInsights = async (industry: string | null) => {
  const { response } = await model.generateContent(prompt(industry));
  return JSON.parse(handleCleannedText(response.text()));
};

export const getIndustryInsights = async (): Promise<IndustryInsight> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);
    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdated: getNextUpdateDate(),
      },
    });
    return industryInsight;
  }

  return user.industryInsight;
};
