import type { StorageLike } from './repository';
import { LearningStateRepository, ReviewEventRepository } from './learning-repository';
import type { ReviewEvent } from './review-event';
import { nextLearningState, type LearningState } from './scheduler';

export function commitReview(input: { userId: string; storage: StorageLike; event: ReviewEvent; now: Date; }): LearningState {
  if (input.event.userId !== input.userId) throw new Error('复习事件用户与当前用户不一致');
  const states = new LearningStateRepository(input.userId, input.storage);
  const events = new ReviewEventRepository(input.userId, input.storage);
  const previous = states.get(input.event.questionId);
  const recorded = events.list().find(event => event.eventId === input.event.eventId);
  if (recorded) {
    const keys = Object.keys(input.event) as (keyof ReviewEvent)[];
    if (Object.keys(recorded).length !== keys.length || keys.some(key => JSON.stringify(recorded[key]) !== JSON.stringify(input.event[key]))) {
      throw new Error('复习事件身份冲突：相同 eventId 的证据不能改变');
    }
    if (!previous) throw new Error('复习事件已有记录但学习状态缺失，需要恢复');
    return previous;
  }
  const current = previous ?? states.ensure(input.event.questionId);
  if (input.event.sessionRepaired === true) {
    if (!previous || !previous.dueAt || input.event.effectiveRating === 'forgot' || input.event.correctness === 'wrong' || input.event.correctness === 'skipped' || input.event.revealedAnswer) {
      throw new Error('无效的本轮修复证据');
    }
    events.append(input.event);
    return previous;
  }
  const next = nextLearningState(current, input.event.effectiveRating, input.now);
  states.save(next);
  try { events.append(input.event); } catch (error) {
    if (previous) states.save(previous); else states.remove(input.event.questionId);
    throw error;
  }
  return next;
}
