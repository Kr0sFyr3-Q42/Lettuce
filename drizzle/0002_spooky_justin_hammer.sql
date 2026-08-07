ALTER TABLE `tags` ADD `default_all_days` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tags` ADD `default_days` text DEFAULT '[]' NOT NULL;