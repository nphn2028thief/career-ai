/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { improvementPrompt, interviewPrompt } from "@/constants/gemini";
import { db } from "@/lib/prisma";
import { handleCleannedText } from "@/lib/utils";
import { IQuestion } from "@/types/interview";

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = googleGenerativeAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateInterviewQuiz = async (): Promise<IQuestion[]> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const prompt = interviewPrompt(user.industry, user.skills);
    const { response } = await model.generateContent(prompt);

    return JSON.parse(handleCleannedText(response.text()))
      .questions as IQuestion[];
  } catch (error: any) {
    console.error("Error generating quiz:", error.message);
    throw new Error("Failed to generate quiz questions.");
  }
};

export const saveQuizResult = async (
  questions: IQuestion[],
  answers: string[],
  score: number
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((item, index) => ({
    question: item.question,
    answer: item.correctAnswer,
    userAnswer: answers[index],
    isCorrect: item.correctAnswer === answers[index],
    explanation: item.explanation,
  }));

  const wrongAnswers = questionResults.filter((item) => !item.isCorrect);
  let improvementTip = "";

  if (wrongAnswers.length) {
    const text = wrongAnswers
      .map(
        (item) =>
          `Question: "${item.question}"\nCorrect answer: "${item.answer}"\nUser answer: "${item.userAnswer}"`
      )
      .join("\n\n");

    const prompt = improvementPrompt(user.industry, text);

    try {
      const { response } = await model.generateContent(prompt);
      improvementTip = response.text().trim();
    } catch (error: any) {
      console.error("Error generating improvement tip:", error.message);
      throw new Error("Failed to generate improvement tip.");
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error: any) {
    console.error("Error saving quiz result:", error.message);
    throw new Error("Failed to save quiz result.");
  }
};

export const getAssessments = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error: any) {
    console.error("Error fetching assessments:", error.message);
    throw new Error("Failed to fetch assessments.");
  }
};
