CREATE TABLE `email_workflow` (
	`id` int AUTO_INCREMENT NOT NULL,
	`emailItemId` varchar(48) NOT NULL,
	`previewUrl` varchar(2048) NOT NULL,
	`status` varchar(64) NOT NULL DEFAULT 'nao-foi-feito',
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `email_workflow_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_workflow_emailItemId_unique` UNIQUE(`emailItemId`)
);
