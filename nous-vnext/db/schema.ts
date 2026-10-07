import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const sources = sqliteTable("sources", {
  sourceId: text("source_id").primaryKey(),
  sha256: text("sha256").notNull(),
  title: text("title").notNull(),
  chunksJson: text("chunks_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({ sha256Unique: uniqueIndex("sources_sha256_unique").on(table.sha256) }));

export const contentPackages = sqliteTable("content_packages", {
  packageId: text("package_id").primaryKey(),
  title: text("title").notNull(),
  contentVersion: text("content_version").notNull(),
  sourceIdsJson: text("source_ids_json").notNull(),
  payloadJson: text("payload_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const learningStates = sqliteTable("learning_states", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  questionId: text("question_id").notNull(),
  phase: text("phase").notNull(),
  dueAt: text("due_at"),
  reviewLevel: integer("review_level").notNull().default(0),
  lapses: integer("lapses").notNull().default(0),
  successfulReviews: integer("successful_reviews").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({ userQuestionUnique: uniqueIndex("learning_states_user_question_unique").on(table.userId, table.questionId), dueIndex: index("learning_states_user_due_idx").on(table.userId, table.dueAt) }));

export const reviewEvents = sqliteTable("review_events", {
  eventId: text("event_id").primaryKey(),
  userId: text("user_id").notNull(),
  questionId: text("question_id").notNull(),
  attemptedAt: text("attempted_at").notNull(),
  correctness: text("correctness").notNull(),
  effectiveRating: text("effective_rating").notNull(),
  payloadJson: text("payload_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({ userQuestionIndex: index("review_events_user_question_idx").on(table.userId, table.questionId), userAttemptIndex: index("review_events_user_attempt_idx").on(table.userId, table.attemptedAt) }));
