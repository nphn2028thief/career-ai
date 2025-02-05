"use server";

import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

import { generateAIInsights } from "./dashboard";
import { db } from "@/lib/prisma";
import { getNextUpdateDate } from "@/lib/utils";

export const updateUser = async (data: User) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });
  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(
      async (tx) => {
        // If industry doesn't exist, create it with default values - will replace it with AI later
        // Else, update user
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry || "",
          },
        });

        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);
          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdated: getNextUpdateDate(),
            },
          });
        }

        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { industryInsight, updatedUser };
      },
      {
        timeout: 10000,
      }
    );

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile.");
  }
};

export const getUserOnboardingStatus = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await db.user.findUnique({
    where: {
      userId,
    },
  });
  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        userId,
      },
      select: {
        industry: true,
      },
    });

    console.log("isOnboarded: ", !!user?.industry);

    return {
      isOnboarded: !!user?.industry,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("error123: ", error);
    console.error("Error checking onboarding status:", error.message);
    throw new Error("Failed to check onboarding status.");
  }
};
