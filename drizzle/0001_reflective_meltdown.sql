CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`simulationId` int NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`stripeSessionId` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'EUR',
	`status` enum('pending','succeeded','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `simulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(32) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`country` enum('france','suisse','belgique','luxembourg') NOT NULL,
	`canton` varchar(64),
	`city` varchar(255) NOT NULL,
	`operationType` enum('achat','vente','achat_vente') NOT NULL,
	`purchasePrice` decimal(15,2),
	`salePrice` decimal(15,2),
	`acquisitionDate` varchar(10),
	`renovationCost` decimal(15,2),
	`loanAmount` decimal(15,2),
	`loanRate` decimal(5,3),
	`loanDuration` int,
	`results` json,
	`reportUrl` text,
	`status` enum('pending','paid','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `simulations_id` PRIMARY KEY(`id`),
	CONSTRAINT `simulations_publicId_unique` UNIQUE(`publicId`)
);
