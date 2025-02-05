import { getAssessments } from "@/actions/interview";
import InterviewStatsCard from "./_components/Stats";
import InterviewPerformanceChart from "./_components/Performance";
import InterviewQuizList from "./_components/QuizList";

async function InterviewPage() {
  const assessments = await getAssessments();

  return (
    <div className="pt-16 px-5">
      <div>
        <h1 className="text-6xl font-bold gradient-title mb-5">
          Interview preparation
        </h1>
      </div>
      <div className="space-y-5">
        <InterviewStatsCard assessments={assessments} />
        <InterviewPerformanceChart assessments={assessments} />
        <InterviewQuizList assessments={assessments} />
      </div>
    </div>
  );
}

export default InterviewPage;
