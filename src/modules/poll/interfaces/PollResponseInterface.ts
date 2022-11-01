export interface PollResponseInterface {
  id: string;
  description: string;
  questions: PollQuestionsInterface[];
}

export interface PollQuestionsInterface {
  id: string;
  description?: string;
  options: unknown[];
}
