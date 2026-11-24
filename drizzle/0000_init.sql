CREATE TABLE `attempt_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`attempt_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	`selected_index` integer,
	`is_correct` integer NOT NULL,
	`time_ms` integer,
	FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `answers_attempt_idx` ON `attempt_answers` (`attempt_id`);--> statement-breakpoint
CREATE INDEX `answers_question_idx` ON `attempt_answers` (`question_id`);--> statement-breakpoint
CREATE TABLE `attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_name` text NOT NULL,
	`class_name` text,
	`grade` integer NOT NULL,
	`level` text NOT NULL,
	`mode` text DEFAULT 'practice' NOT NULL,
	`subjects` text NOT NULL,
	`total_questions` integer NOT NULL,
	`correct_count` integer NOT NULL,
	`score` integer NOT NULL,
	`max_streak` integer DEFAULT 0 NOT NULL,
	`duration_sec` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attempts_board_idx` ON `attempts` (`grade`,`level`,`score`);--> statement-breakpoint
CREATE INDEX `attempts_created_idx` ON `attempts` (`created_at`);--> statement-breakpoint
CREATE TABLE `feedbacks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`attempt_id` integer,
	`player_name` text,
	`grade` integer,
	`level` text,
	`rating` integer NOT NULL,
	`difficulty` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`comment` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "feedbacks_rating_chk" CHECK("feedbacks"."rating" between 1 and 5)
);
--> statement-breakpoint
CREATE INDEX `feedbacks_created_idx` ON `feedbacks` (`created_at`);--> statement-breakpoint
CREATE TABLE `question_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`attempt_id` integer,
	`reason` text NOT NULL,
	`note` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `reports_status_idx` ON `question_reports` (`status`,`question_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`grade` integer NOT NULL,
	`level` text NOT NULL,
	`subject` text NOT NULL,
	`topic` text,
	`content` text NOT NULL,
	`options` text NOT NULL,
	`answer_index` integer NOT NULL,
	`explanation` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "questions_grade_chk" CHECK("questions"."grade" between 6 and 9)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `questions_code_unique` ON `questions` (`code`);--> statement-breakpoint
CREATE INDEX `questions_grade_level_idx` ON `questions` (`grade`,`level`,`is_active`);--> statement-breakpoint
CREATE INDEX `questions_subject_idx` ON `questions` (`subject`);