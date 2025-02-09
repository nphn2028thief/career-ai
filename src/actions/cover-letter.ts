"use server";

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CoverLetter } from "@prisma/client";

import { db } from "@/lib/prisma";
import { coverLetterPrompt } from "@/constants/gemini";

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = googleGenerativeAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateCoverLetter = async (
  data: CoverLetter
): Promise<CoverLetter> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = coverLetterPrompt(
    data.jobTitle,
    data.companyName,
    user.industry,
    user.experience,
    user.skills,
    user.bio,
    data.jobDesc
  );

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDesc: data.jobDesc,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        // status: ,
        userId: user.id,
      },
    });

    return coverLetter;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
};

export const getCoverLetters = async (): Promise<CoverLetter[]> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCoverLetterById = async (
  id: string
): Promise<CoverLetter | null> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
};

export const deleteCoverLetter = async (id: string): Promise<CoverLetter> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
};
