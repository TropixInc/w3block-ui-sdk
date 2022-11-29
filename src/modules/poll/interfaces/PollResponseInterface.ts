export interface PollResponseInterface {
  id: string;
  description: string;
  slug: string;
  imageUrl: string;
  questions: PollQuestionsInterface[];
}

export interface PostAnswerResponseInterface {
  achievedLimit: boolean;
  newUser: boolean;
  finishedPoll: boolean;
  answer: AnswerResponseInterface;
}

interface AnswerResponseInterface {
  createdAt: string;
  description: string;
  email: string;
  id: string;
  name: string;
  pollId: string;
  questionId: string;
  tenantId: string;
  updatedAt: string;
  userId: string;
}

export interface PollQuestionsInterface {
  id: string;
  description?: string;
  options: unknown[];
}
