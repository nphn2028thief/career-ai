/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { experienceDescPrompt } from "@/constants/gemini";
import EPath from "@/constants/path";
import { db } from "@/lib/prisma";
import { Resume } from "@prisma/client";

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = googleGenerativeAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const saveResume = async (content: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath(EPath.RESUME);
    return resume;
  } catch (error: any) {
    console.error("Error saving resume:", error.message);
    throw new Error("Failed to save resume.");
  }
};

export const getResume = async (): Promise<Resume | null> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    return await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });
  } catch (error: any) {
    console.error("Error fetching resume:", error.message);
    throw new Error("Failed to get resume.");
  }
};

export const improveWithAi = async (
  type: string,
  currentContent: string
): Promise<string> => {
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

  const prompt = experienceDescPrompt(type, user.industry, currentContent);

  try {
    const { response } = await model.generateContent(prompt);
    return response.text().trim();
  } catch (error: any) {
    console.error("Error improving content:", error.message);
    throw new Error("Failed to improve content.");
  }
};
