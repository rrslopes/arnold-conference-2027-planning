ALTER TABLE `lead_profile_snapshots` ADD `uniquePeopleInPeriod` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `uniquePeopleInPeriod` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `totalUniquePeople` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `profileBaseCount` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `originsJson` text;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `masterclassClicks` int;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `masterclassClickOriginsJson` text;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `syncSource` varchar(32) DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `providerUpdatedAt` bigint;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD `providerObservation` text;--> statement-breakpoint
ALTER TABLE `lead_profile_snapshots` ADD CONSTRAINT `lead_profile_source_period_unique` UNIQUE(`sourceKey`,`periodStartAt`,`periodEndAt`);
