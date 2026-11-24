CREATE TABLE `daily_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`date` text NOT NULL,
	`grade` integer NOT NULL,
	`user_id` text,
	`ranked` integer DEFAULT false NOT NULL,
	`current` integer DEFAULT 0 NOT NULL,
	`shown_at` integer NOT NULL,
	`answers` text DEFAULT '[]' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`correct_count` integer DEFAULT 0 NOT NULL,
	`streak` integer DEFAULT 0 NOT NULL,
	`finished_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_runs_ranked_uq` ON `daily_runs` (`user_id`,`date`) WHERE ranked = 1;--> statement-breakpoint
CREATE INDEX `daily_runs_board_idx` ON `daily_runs` (`date`,`grade`,`score`);--> statement-breakpoint
CREATE TABLE `daily_sets` (
	`date` text NOT NULL,
	`grade` integer NOT NULL,
	`question_ids` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`date`, `grade`)
);
