import { Assessment } from "@prisma/client";
import { Brain, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function InterviewStatsCard({ assessments }: { assessments: Assessment[] }) {
  const getAverageScore = () => {
    if (!assessments.length) return 0;

    const total = assessments.reduce((acc, curr) => acc + curr.quizScore, 0);
    return (total / assessments.length).toFixed(1);
  };

  const getTotalQuestions = () => {
    if (!assessments.length) return 0;

    const total = assessments.reduce(
      (acc, curr) => acc + curr.questions.length,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments.length) return null;
    return assessments[0].quizScore.toFixed(1);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average score</CardTitle>
          <Trophy className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAverageScore()}%</div>
          <p className="text-xs text-muted-foreground">
            Across all assessments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Question practiced
          </CardTitle>
          <Brain className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTotalQuestions()}</div>
          <p className="text-xs text-muted-foreground">Total questions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest score</CardTitle>
          <Trophy className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getLatestAssessment()}%</div>
          <p className="text-xs text-muted-foreground">
            Across all assessments
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default InterviewStatsCard;
