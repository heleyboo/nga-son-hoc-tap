CREATE TABLE `share_cards` (
	`slug` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`source_id` integer NOT NULL,
	`card` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `share_cards_source_uq` ON `share_cards` (`kind`,`source_id`);