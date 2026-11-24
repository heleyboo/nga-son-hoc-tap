CREATE TABLE `game_plays` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`game` text NOT NULL,
	`score` integer,
	`correct` integer,
	`total` integer,
	`answered` integer,
	`level` integer,
	`victory` integer DEFAULT false NOT NULL,
	`duration_sec` integer,
	`xp` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `game_plays_user_idx` ON `game_plays` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `game_plays_board_idx` ON `game_plays` (`game`,`total`,`score`);