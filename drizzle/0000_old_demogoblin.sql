CREATE TABLE `metric_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricKey` varchar(180) NOT NULL,
	`target` text NOT NULL,
	`actual` text NOT NULL,
	`note` text NOT NULL,
	`done` boolean NOT NULL DEFAULT false,
	`updatedById` int NOT NULL,
	`updatedByName` varchar(255),
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `metric_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `metric_progress_metricKey_unique` UNIQUE(`metricKey`)
);
--> statement-breakpoint
CREATE TABLE `objective_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`objectiveKey` varchar(80) NOT NULL,
	`target` text NOT NULL,
	`current` text NOT NULL,
	`note` text NOT NULL,
	`validated` boolean NOT NULL DEFAULT false,
	`updatedById` int NOT NULL,
	`updatedByName` varchar(255),
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `objective_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `objective_progress_objectiveKey_unique` UNIQUE(`objectiveKey`)
);
--> statement-breakpoint
CREATE TABLE `planning_activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('objectives','metrics') NOT NULL,
	`action` enum('save','clear') NOT NULL,
	`snapshot` text NOT NULL,
	`actorId` int NOT NULL,
	`actorName` varchar(255),
	`createdAt` bigint NOT NULL,
	CONSTRAINT `planning_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
