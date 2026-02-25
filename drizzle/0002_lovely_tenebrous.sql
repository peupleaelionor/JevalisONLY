CREATE TABLE `client_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `simulations` ADD `clientUserId` int;