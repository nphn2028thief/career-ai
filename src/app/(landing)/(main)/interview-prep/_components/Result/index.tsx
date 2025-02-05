import { CheckCircle2, Trophy, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IQuizResult } from "@/types/interview";

interface IProps {
  result: IQuizResult;
  hideStartNew?: boolean;
  onStartNew: () => void;
}

function InterviewQuizResult(props: IProps) {
  const { result, hideStartNew = false, onStartNew } = props;

  if (!result) return null;

  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient0-t">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Quiz result
      </h1>

      <CardContent>
        {/* Quiz score */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className="w-full" />
        </div>

        {/* Improvement tip */}
        {result.improvementTip && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        <div className="space-y-4 mt-4">
          <h3 className="font-medium">Question review</h3>
          {result.questions.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">{item.question}</p>
                {item.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium underline underline-offset-2 text-white">
                    Your answer:
                  </span>{" "}
                  {item.userAnswer}
                </p>
                {!item.isCorrect && (
                  <p>
                    <span className="font-medium underline underline-offset-2 text-white">
                      Correct answer:
                    </span>{" "}
                    {item.answer}
                  </p>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium underline underline-offset-2 text-white">
                  Explaination:
                </p>
                <p>{item.explanation}:</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button className="w-full" onClick={onStartNew}>
            Start new quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}

export default InterviewQuizResult;
