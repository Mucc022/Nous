import { and, eq } from "drizzle-orm";
import { learningStates, reviewEvents } from "../../../db/schema";
import { parseReviewRequest } from "../../../app/domain/api-contract";
import { authenticateAccessRequest } from '../../domain/access-request';
import { nextLearningState } from "../../../app/domain/scheduler";
import { sameReviewEvent } from '../../domain/event-equality';
import { readBoundedJson, PayloadTooLargeError } from '../../domain/bounded-json';

export async function POST(request: Request): Promise<Response> {
  const userId = await authenticateAccessRequest(request.headers, { issuer: process.env.NOUS_ACCESS_ISSUER, audience: process.env.NOUS_ACCESS_AUDIENCE });
  if (!userId) return privateJson({ error: "authentication_required" }, { status: 401 });
  let event;
  try { event = parseReviewRequest(await readBoundedJson(request), userId); }
  catch (error) { return privateJson({ error: error instanceof Error ? error.message : "invalid_review_event" }, { status: error instanceof PayloadTooLargeError ? 413 : 400 }); }
  let db;
  try { const { getDb } = await import("../../../db"); db = getDb(); }
  catch { return privateJson({ error: "database_unavailable" }, { status: 503 }); }
  try {
    const existing = await db.select().from(reviewEvents).where(eq(reviewEvents.eventId, event.eventId)).limit(1);
    if (existing.length) {
      if (existing[0].userId !== userId || !sameReviewEvent(parseReviewRequest(JSON.parse(existing[0].payloadJson), userId), event)) return privateJson({ error: "event_conflict" }, { status: 409 });
      const stored = await db.select().from(learningStates).where(and(eq(learningStates.userId, userId), eq(learningStates.questionId, event.questionId))).limit(1);
      return privateJson({ event, state: stored[0] ?? null, replayed: true });
    }
    const stored = await db.select().from(learningStates).where(and(eq(learningStates.userId, userId), eq(learningStates.questionId, event.questionId))).limit(1);
    const current = stored[0] ? { userId, questionId: event.questionId, phase: stored[0].phase as "new" | "learning" | "review" | "relearning", dueAt: stored[0].dueAt, reviewLevel: stored[0].reviewLevel, lapses: stored[0].lapses, successfulReviews: stored[0].successfulReviews } : { userId, questionId: event.questionId, phase: "new" as const, dueAt: null, reviewLevel: 0, lapses: 0, successfulReviews: 0 };
    if (event.sessionRepaired && !stored[0]?.dueAt) return privateJson({ error: 'repair_requires_prior_state' }, { status: 409 });
    const next = event.sessionRepaired ? current : nextLearningState(current, event.effectiveRating, new Date(event.attemptedAt));
    await db.batch([
      db.insert(reviewEvents).values({ eventId: event.eventId, userId, questionId: event.questionId, attemptedAt: event.attemptedAt, correctness: event.correctness, effectiveRating: event.effectiveRating, payloadJson: JSON.stringify(event) }),
      db.insert(learningStates).values({ id: `${userId}:${event.questionId}`, userId, questionId: event.questionId, phase: next.phase, dueAt: next.dueAt, reviewLevel: next.reviewLevel, lapses: next.lapses, successfulReviews: next.successfulReviews }).onConflictDoUpdate({ target: learningStates.id, set: { phase: next.phase, dueAt: next.dueAt, reviewLevel: next.reviewLevel, lapses: next.lapses, successfulReviews: next.successfulReviews } }),
    ]);
    return privateJson({ event, state: next, replayed: false }, { status: 201 });
  } catch { return privateJson({ error: "database_write_failed" }, { status: 500 }); }
}

export async function GET(request: Request): Promise<Response> {
  const userId = await authenticateAccessRequest(request.headers, { issuer: process.env.NOUS_ACCESS_ISSUER, audience: process.env.NOUS_ACCESS_AUDIENCE });
  if (!userId) return privateJson({ error: "authentication_required" }, { status: 401 });
  let db;
  try { const { getDb } = await import("../../../db"); db = getDb(); }
  catch { return privateJson({ error: "database_unavailable" }, { status: 503 }); }
  try {
    const [states, events] = await Promise.all([
      db.select().from(learningStates).where(eq(learningStates.userId, userId)),
      db.select().from(reviewEvents).where(eq(reviewEvents.userId, userId)),
    ]);
    return privateJson({ states, events });
  } catch { return privateJson({ error: "database_read_failed" }, { status: 500 }); }
}

function privateJson(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('cache-control', 'no-store');
  headers.set('vary', 'Cookie, Cf-Access-Jwt-Assertion');
  return Response.json(body, { ...init, headers });
}
