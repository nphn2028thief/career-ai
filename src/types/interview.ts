export interface IQuestion {
  correctAnswer: string;
  explanation: string;
  options: string[];
  question: string;
}

export interface IQuiz {
  currentQuestion: number;
  answers: string[];
  showExplanation: boolean;
}

export interface IQuestionResult {
  answer: string;
  explanation: string;
  isCorrect: boolean;
  question: string;
  userAnswer: string;
}

export interface IQuizResult {
  id: string;
  category: string;
  improvementTip: string;
  questions: IQuestionResult[];
  quizScore: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
