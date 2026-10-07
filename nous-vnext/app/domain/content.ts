export const PACKAGE_FORMAT = "nous-package-v0.1" as const;

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "short_answer"
  | "explanation"
  | "analysis";

export type SourceRef = {
  sourceId: string;
  chunkId: string;
  quote: string;
};

export type Question = {
  questionId: string;
  type: QuestionType;
  prompt: string;
  choices?: string[];
  answer: string | string[];
  explanation?: string;
  hint?: string;
  cognitiveSkill?: string;
  sourceRefs: SourceRef[];
};

export type Card = {
  cardId: string;
  title: string;
  summary?: string;
  tags?: string[];
  questions: Question[];
};

export type SourceChunk = { chunkId: string; text: string; index: number };
export type SourceDocument = {
  sourceId: string;
  sha256: string;
  title: string;
  chunks: SourceChunk[];
};

export type NousPackage = {
  format: typeof PACKAGE_FORMAT;
  contentVersion: string;
  title: string;
  sources: SourceDocument[];
  cards: Card[];
};
