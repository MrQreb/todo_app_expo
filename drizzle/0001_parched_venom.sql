CREATE TABLE `photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uri` text NOT NULL,
	`todo_id` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`todo_id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade
);
