CREATE TABLE `assignment_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`assignment_id` integer NOT NULL,
	`user_id` text,
	`player_name` text NOT NULL,
	`class_name` text,
	`correct_count` integer NOT NULL,
	`total_questions` integer NOT NULL,
	`score10_x100` integer NOT NULL,
	`duration_sec` integer DEFAULT 0 NOT NULL,
	`answers` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `submissions_assignment_idx` ON `assignment_submissions` (`assignment_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`grade` integer NOT NULL,
	`level` text NOT NULL,
	`subjects` text NOT NULL,
	`question_ids` text NOT NULL,
	`mode` text DEFAULT 'test' NOT NULL,
	`time_limit_min` integer,
	`due_at` integer,
	`is_open` integer DEFAULT true NOT NULL,
	`created_by` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assignments_code_unique` ON `assignments` (`code`);--> statement-breakpoint
CREATE INDEX `assignments_created_idx` ON `assignments` (`created_at`);--> statement-breakpoint
CREATE TABLE `live_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`grade` integer NOT NULL,
	`level` text NOT NULL,
	`subjects` text NOT NULL,
	`question_count` integer NOT NULL,
	`player_count` integer NOT NULL,
	`results` text NOT NULL,
	`question_stats` text NOT NULL,
	`host_user_id` text,
	`started_at` integer NOT NULL,
	`ended_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`host_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `live_sessions_ended_idx` ON `live_sessions` (`ended_at`);--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'student' NOT NULL;