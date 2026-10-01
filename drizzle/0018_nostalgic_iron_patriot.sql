CREATE TABLE `landing_monthly_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceKey` varchar(64) NOT NULL,
	`monthKey` varchar(7) NOT NULL,
	`snapshotId` int NOT NULL,
	`status` enum('open','closed') NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `landing_monthly_blocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `landing_monthly_source_month_unique` UNIQUE(`sourceKey`,`monthKey`)
);
