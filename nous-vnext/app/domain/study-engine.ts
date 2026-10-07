import type { QuestionType } from './content';

export type UserRating = 'remember' | 'fuzzy' | 'forget' | 'skip';
export type EffectiveRating = 'remember' | 'fuzzy' | 'forgot';
export type AttemptContext = { questionType: QuestionType; submitted: boolean; correct: boolean | null; hintLevelUsed: number; revealedAnswer: boolean; userRating: UserRating };

export function effectiveRating(context: AttemptContext): EffectiveRating {
  if (!context.submitted || context.revealedAnswer || context.correct === false || context.userRating === 'forget' || context.userRating === 'skip') return 'forgot';
  if (context.hintLevelUsed > 0 || context.userRating === 'fuzzy') return 'fuzzy';
  return 'remember';
}

export function gradeAttempt(context: AttemptContext): { effectiveRating: EffectiveRating; repair: boolean } {
  const rating = effectiveRating(context);
  return { effectiveRating: rating, repair: rating === 'forgot' };
}
