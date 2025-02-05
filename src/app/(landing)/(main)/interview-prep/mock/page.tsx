import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import InterviewQuiz from "../_components/Quiz";
import EPath from "@/constants/path";

function MockInterviewPage() {
  return (
    <div className="pt-6 px-5">
      <div className="container mx-auto space-y-4">
        <div className="flex flex-col gap-2">
          <Link href={EPath.INTERVIEW_PREP}>
            <Button variant="link" className="gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" />
              Back to Interview Preparation
            </Button>
          </Link>
          <div>
            <h1 className="text-6xl font-bold gradient-title">
              Mock interview
            </h1>
            <p className="text-muted-foreground">
              Test your knowledge with industry-specific questions
            </p>
          </div>
        </div>

        <InterviewQuiz />
      </div>
    </div>
  );
}

export default MockInterviewPage;
