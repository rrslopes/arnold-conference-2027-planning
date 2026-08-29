CREATE TABLE `calendar_workflow` (
	`id` int AUTO_INCREMENT NOT NULL,
	`calendarItemId` varchar(24) NOT NULL,
	`caption` text NOT NULL,
	`artworkUrl` varchar(2048) NOT NULL,
	`status` varchar(64) NOT NULL DEFAULT 'nao-iniciado',
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `calendar_workflow_id` PRIMARY KEY(`id`),
	CONSTRAINT `calendar_workflow_calendarItemId_unique` UNIQUE(`calendarItemId`)
);
