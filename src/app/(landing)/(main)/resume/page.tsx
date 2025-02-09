import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/Builder";

async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="px-5">
      <div className="container mx-auto py-6">
        <ResumeBuilder initialContent={resume?.content || null} />
      </div>
    </div>
  );
}

export default ResumePage;
