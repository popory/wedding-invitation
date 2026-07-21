CREATE TABLE `guestbook_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`message` text NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`client_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `guestbook_created_at_idx` ON `guestbook_entries` (`created_at`);