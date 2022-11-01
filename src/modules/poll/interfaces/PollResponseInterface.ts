export interface PollResponseInterface {
  id: string;
  description: string;
  slug: string;
  questions: PollQuestionsInterface[];
}

export interface PollQuestionsInterface {
  id: string;
  description?: string;
  options: unknown[];
}
