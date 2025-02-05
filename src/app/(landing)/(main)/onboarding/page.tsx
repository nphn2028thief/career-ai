import { redirect } from "next/navigation";
import React from "react";

import { getUserOnboardingStatus } from "@/actions/user";
import EPath from "@/constants/path";
import OnBoardingForm from "./_components/form";

async function OnBoardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    return redirect(EPath.DASHBOARD);
  }

  return <OnBoardingForm />;
}

export default OnBoardingPage;
