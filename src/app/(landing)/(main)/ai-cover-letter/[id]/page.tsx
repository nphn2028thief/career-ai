import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCoverLetterById } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import CoverLetterPreview from "../_components/Preview";
import EPath from "@/constants/path";

interface IProps {
  params: {
    id: string;
  };
}

async function CoverLetterDetailPage({ params }: IProps) {
  const id = params.id;

  const coverLetter = await getCoverLetterById(id);

  if (!coverLetter) return null;

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
          <h1 className="text-6xl font-bold gradient-title">
            {coverLetter.jobTitle} at {coverLetter.companyName}
          </h1>
        </div>

        <CoverLetterPreview content={coverLetter.content} />
      </div>
    </div>
  );
}

export default CoverLetterDetailPage;
