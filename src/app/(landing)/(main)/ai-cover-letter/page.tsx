import Link from "next/link";
import { Plus } from "lucide-react";

import { getCoverLetters } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/List";
import EPath from "@/constants/path";

async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="px-5">
      <div className="container mx-auto py-6">
        <div className="space-y-4">
          {/* Title */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <h1 className="font-bold gradient-title text-5xl md:text-6xl">
              My cover letters
            </h1>
            <Link href={EPath.CREATE_COVER_LETTER} passHref>
              <Button>
                <Plus className="w-4 h-4" />
                Create new
              </Button>
            </Link>
          </div>

          {/* Cover letter list */}
          <CoverLetterList coverLetters={coverLetters} />
        </div>
      </div>
    </div>
  );
}

export default CoverLetterPage;
