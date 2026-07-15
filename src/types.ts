export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
  };
  correctAnswer: "A" | "B" | "C";
  explanation: string;
}

export interface ModuleData {
  id: number;
  title: string;
  objective: string;
  analogy: string[]; // List of short sentences for quick visual summary
  practicalChallenge: {
    instructions: string[]; // List of short sentences
    suggestedPrompt: string;
  };
  quiz: QuizQuestion;
  achievementName: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UserProgress {
  currentModuleId: number;
  completedModuleIds: number[];
  quizAnswers: Record<number, "A" | "B" | "C">;
  score: number;
}
