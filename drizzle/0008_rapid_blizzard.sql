CREATE TABLE `email_performance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignName` varchar(180) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`sentAt` bigint NOT NULL,
	`emailUrl` varchar(2048) NOT NULL,
	`openRateMilli` int,
	`clickRateMilli` int,
	`unsubscribeRateMilli` int,
	`spamRateMilli` int,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `email_performance_id` PRIMARY KEY(`id`)
);
