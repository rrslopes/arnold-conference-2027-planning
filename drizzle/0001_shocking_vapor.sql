CREATE TABLE `monthly_congress_sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`congressKey` varchar(64) NOT NULL,
	`monthKey` varchar(7) NOT NULL,
	`sold` int NOT NULL DEFAULT 0,
	`updatedById` int NOT NULL,
	`updatedByName` varchar(255),
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `monthly_congress_sales_id` PRIMARY KEY(`id`),
	CONSTRAINT `monthly_congress_sales_congress_month_unique` UNIQUE(`congressKey`,`monthKey`)
);
--> statement-breakpoint
CREATE TABLE `room_occupancy` (
	`id` int AUTO_INCREMENT NOT NULL,
	`congressKey` varchar(64) NOT NULL,
	`capacity` int,
	`updatedById` int NOT NULL,
	`updatedByName` varchar(255),
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `room_occupancy_id` PRIMARY KEY(`id`),
	CONSTRAINT `room_occupancy_congressKey_unique` UNIQUE(`congressKey`)
);
--> statement-breakpoint
ALTER TABLE `planning_activity` MODIFY COLUMN `entityType` enum('objectives','metrics','occupancy') NOT NULL;