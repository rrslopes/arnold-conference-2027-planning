CREATE TABLE `monthly_whatsapp_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`monthKey` varchar(7) NOT NULL,
	`delivered` int,
	`linkClicks` int,
	`replies` int,
	`optOuts` int,
	`attributedPurchases` int,
	`humanHandoffs` int,
	`note` text NOT NULL,
	`updatedAt` bigint NOT NULL,
	CONSTRAINT `monthly_whatsapp_results_id` PRIMARY KEY(`id`),
	CONSTRAINT `monthly_whatsapp_results_monthKey_unique` UNIQUE(`monthKey`)
);
--> statement-breakpoint
ALTER TABLE `email_performance` ADD `deliveredCount` int;--> statement-breakpoint
ALTER TABLE `email_performance` ADD `uniqueClicks` int;--> statement-breakpoint
ALTER TABLE `email_performance` ADD `attributedConversions` int;--> statement-breakpoint
ALTER TABLE `email_performance` ADD `attributedRevenueCents` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `sessions` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `dmSessions` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `formStarts` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `dmConversions` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `metaMessagesSent` int;