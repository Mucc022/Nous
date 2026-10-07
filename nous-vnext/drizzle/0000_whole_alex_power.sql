CREATE TABLE `content_packages` (
	`package_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content_version` text NOT NULL,
	`source_ids_json` text NOT NULL,
	`payload_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learning_states` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`phase` text NOT NULL,
	`due_at` text,
	`review_level` integer DEFAULT 0 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`successful_reviews` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `learning_states_user_question_unique` ON `learning_states` (`user_id`,`question_id`);--> statement-breakpoint
CREATE INDEX `learning_states_user_due_idx` ON `learning_states` (`user_id`,`due_at`);--> statement-breakpoint
CREATE TABLE `review_events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`attempted_at` text NOT NULL,
	`correctness` text NOT NULL,
	`effective_rating` text NOT NULL,
	`payload_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `review_events_user_question_idx` ON `review_events` (`user_id`,`question_id`);--> statement-breakpoint
CREATE INDEX `review_events_user_attempt_idx` ON `review_events` (`user_id`,`attempted_at`);--> statement-breakpoint
CREATE TABLE `sources` (
	`source_id` text PRIMARY KEY NOT NULL,
	`sha256` text NOT NULL,
	`title` text NOT NULL,
	`chunks_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sources_sha256_unique` ON `sources` (`sha256`);