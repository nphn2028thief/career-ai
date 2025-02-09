"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import CoverLetterForm from "../_components/Form";
import EPath from "@/constants/path";

function CoverLetterCreatePage() {
  return (
    <div className="pt-6 px-5">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <Link href={EPath.COVER_LETTER}>
            <Button variant="link" className="gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" />
              Back to Cover Letters
            </Button>
          </Link>
          <div>
            <h1 className="text-6xl font-bold gradient-title">
              Create cover letter
            </h1>
            <p className="text-muted-foreground">
              Generate a tailored cover letter for your job application
            </p>
          </div>
        </div>

        <CoverLetterForm />
      </div>
    </div>
  );
}

export default CoverLetterCreatePage;
