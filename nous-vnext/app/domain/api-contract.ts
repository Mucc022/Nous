import type { ReviewEvent } from './review-event';

export function resolveUserId(headers: Headers): string | null {
  // Tunnel/Node requests do not have a trusted identity-injecting proxy.
  // Keep remote APIs closed until a server-verified session/JWT adapter is installed.
  // Neither this header nor an arbitrary Bearer value proves authentication.
  void headers;
  return null;
}

export function parseReviewRequest(input: unknown, authenticatedUserId: string): ReviewEvent {
  if (!input || typeof input !== 'object') throw new Error('invalid review event');
  const value = input as Partial<ReviewEvent>;
  const allowed = new Set(['eventId', 'userId', 'questionId', 'attemptedAt', 'correctness', 'hintLevelUsed', 'revealedAnswer', 'userRating', 'effectiveRating', 'responseTimeMs', 'contentVersion', 'schedulerVersion', 'sessionRepaired', 'response']);
  if (Object.keys(input).some(key => !allowed.has(key))) throw new Error('unknown review event field');
  if (value.response !== undefined && typeof value.response !== 'string' && !(Array.isArray(value.response) && value.response.every(item => typeof item === 'string'))) throw new Error('invalid review response evidence');
  if (value.sessionRepaired !== undefined && typeof value.sessionRepaired !== 'boolean') throw new Error('invalid review event repair flag');
  if (value.sessionRepaired && (value.correctness === 'wrong' || value.correctness === 'skipped' || value.revealedAnswer || value.effectiveRating === 'forgot')) throw new Error('invalid review event repair evidence');
  if (value.userId !== authenticatedUserId) throw new Error('review event user does not match authenticated user');
  if (![value.eventId, value.questionId, value.attemptedAt, value.contentVersion].every(item => typeof item === 'string' && item.trim())) throw new Error('invalid review event IDs');
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value.attemptedAt!) || Number.isNaN(Date.parse(value.attemptedAt!))) throw new Error('invalid review event timestamp');
  if (!['correct', 'wrong', 'self_assessed', 'skipped'].includes(value.correctness as string) || !['remember', 'fuzzy', 'forget', 'skip'].includes(value.userRating as string) || !['remember', 'fuzzy', 'forgot'].includes(value.effectiveRating as string) || value.schedulerVersion !== 'baseline-v1') throw new Error('invalid review event values');
  if (!Number.isInteger(value.hintLevelUsed) || value.hintLevelUsed! < 0 || typeof value.revealedAnswer !== 'boolean' || (value.responseTimeMs !== null && (!Number.isInteger(value.responseTimeMs) || value.responseTimeMs! < 0))) throw new Error('invalid review event metrics');
  const expectedRating = value.correctness === 'wrong' || value.correctness === 'skipped' || value.revealedAnswer || value.userRating === 'forget' || value.userRating === 'skip'
    ? 'forgot' : value.hintLevelUsed! > 0 || value.userRating === 'fuzzy' ? 'fuzzy' : 'remember';
  if (value.effectiveRating !== expectedRating) throw new Error('invalid review event: effective rating contradicts evidence');
  return value as ReviewEvent;
}
