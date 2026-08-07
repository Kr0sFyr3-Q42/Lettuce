CREATE TABLE `freezer_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_name` text NOT NULL,
	`portions` integer DEFAULT 1 NOT NULL,
	`date_added` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meal_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`meal_name` text NOT NULL,
	`date_served` text NOT NULL,
	`servings` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pantry_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_name` text NOT NULL,
	`unit` text,
	`quantity` real
);
--> statement-breakpoint
CREATE TABLE `saved_menus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`menu_data` text NOT NULL,
	`persons_per_day` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`prompt_snippet` text NOT NULL,
	`is_system` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);