"use client";

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { generateInterviewQuiz, saveQuizResult } from "@/actions/interview";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InterviewQuizResult from "../Result";
import useFetch from "@/hooks/useFetch";
import { IQuestion, IQuiz } from "@/types/interview";
import { Assessment } from "@prisma/client";

const initialQuiz: IQuiz = {
  currentQuestion: 0,
  answers: [],
  showExplanation: false,
};

function InterviewQuiz() {
  const [{ currentQuestion, answers, showExplanation }, setQuiz] =
    useState<IQuiz>(initialQuiz);

  // Generating quiz data
  const {
    isLoading: isGeneratingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch<IQuestion[]>(generateInterviewQuiz);

  // Save quiz result
  const {
    isLoading: isSavingQuizResult,
    fn: saveQuizResultFn,
    data: quizResult,
    setData: setQuizResult,
  } = useFetch<Assessment>(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setQuiz((prev) => ({
        ...prev,
        answers: new Array(quizData.length).fill(null),
      }));
    }
  }, [quizData]);

  // Loading generating quiz data
  if (isGeneratingQuiz) {
    return <BarLoader color="gray" width={"100%"} />;
  }

  // Has quiz result when clicked "Finish quiz"
  if (quizResult) {
    const onStartNewQuiz = () => {
      setQuiz(initialQuiz);
      setQuizResult(null);
      generateQuizFn();
    };

    return (
      <div className="mx-2">
        <InterviewQuizResult result={quizResult} onStartNew={onStartNewQuiz} />
      </div>
    );
  }

  // Initial UI when accessed to this page
  if (!quizData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => generateQuizFn()}>
            Start quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const { question, options, explanation } = quizData[currentQuestion];

  const handleUpdateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setQuiz((prev) => ({ ...prev, answers: newAnswers }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setQuiz((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        showExplanation: true,
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setQuiz((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showExplanation: false,
      }));
    } else {
      finishedQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((item, index) => {
      if (item === quizData[index].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishedQuiz = async () => {
    const score = calculateScore();

    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to save quiz results.");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-lg font-medium">{question}</p>
        <RadioGroup
          className="space-y-2 mt-4"
          value={answers[currentQuestion]}
          disabled={isSavingQuizResult}
          onValueChange={handleUpdateAnswer}
        >
          {options.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <RadioGroupItem value={item} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1">
                {item}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-3">
        {!showExplanation && (
          <Button
            variant="outline"
            disabled={!answers[currentQuestion] || isSavingQuizResult}
            onClick={() =>
              setQuiz((prev) => ({ ...prev, showExplanation: true }))
            }
          >
            Show explanation
          </Button>
        )}

        <div className="ml-auto flex items-center gap-3">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              disabled={isSavingQuizResult}
              onClick={handlePrevious}
            >
              Previous question
            </Button>
          )}
          <Button
            disabled={!answers[currentQuestion] || isSavingQuizResult}
            onClick={handleNext}
          >
            {isSavingQuizResult && (
              <Loader2 className="w-4 h-4 animate-spin" color="gray" />
            )}
            {currentQuestion < quizData.length - 1
              ? "Next question"
              : "Finish quiz"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default InterviewQuiz;
