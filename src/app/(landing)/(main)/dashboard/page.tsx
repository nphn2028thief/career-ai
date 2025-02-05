import { redirect } from "next/navigation";
import { IndustryInsight } from "@prisma/client";

import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import DashboardView from "./_components/View";
import EPath from "@/constants/path";

async function IndustryInsightPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    return redirect(EPath.ONBOARDING);
  }

  const industryInsight: IndustryInsight = await getIndustryInsights();

  return (
    <div className="px-5 pt-16">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
      </div>
      {/* <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense> */}
      <div className="container mx-auto">
        <DashboardView industryInsight={industryInsight} />
      </div>
    </div>
  );
}

export default IndustryInsightPage;
