"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Assessment } from "@prisma/client";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InterviewQuizResult from "../Result";
import EPath from "@/constants/path";

const pageSize: number = 10;

function InterviewQuizList({ assessments }: { assessments: Assessment[] }) {
  const router = useRouter();

  const [newAssessments, setNewAssessment] = useState<Assessment[]>([]);
  const [selectedQuiz, setselectedQuiz] = useState<Assessment | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setNewAssessment(
      assessments.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    );
  }, [assessments, currentPage]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">
              Recent quizzes
            </CardTitle>
            <CardDescription>Review your past quiz performance</CardDescription>
          </div>

          <Button onClick={() => router.push(EPath.MOCK_INTERVIEW)}>
            Start new quiz
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {newAssessments.map((item, index) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:bg-muted/50 transition-all hover:-translate-y-1"
              onClick={() => setselectedQuiz(item)}
            >
              <CardHeader>
                <CardTitle>Quiz {index + 1}</CardTitle>
                <CardDescription className="flex justify-between">
                  <div>Score: {item.quizScore.toFixed(1)}%</div>
                  <div>
                    {format(new Date(item.createdAt), "MMMM dd, yyyy HH:mm")}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.improvementTip}
                </p>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end items-center gap-3">
            {currentPage > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
            )}
            {currentPage !== Math.ceil(assessments.length / pageSize) && (
              <Button onClick={() => setCurrentPage((prev) => prev + 1)}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected quiz dialog */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setselectedQuiz(null)}>
        <DialogClose hidden />
        <DialogContent className="max-w-3xl max-h-[85vh] mt-8 pt-8 pb-1 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <InterviewQuizResult
            result={selectedQuiz!}
            hideStartNew
            onStartNew={() => router.push(EPath.MOCK_INTERVIEW)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InterviewQuizList;
