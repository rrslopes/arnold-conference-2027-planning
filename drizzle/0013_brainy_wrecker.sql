ALTER TABLE `masterclass_landing_snapshots` ADD `sourceKey` varchar(64) DEFAULT 'masterclass-lp' NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `sourceKey` varchar(64) DEFAULT 'masterclass-lp' NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `anaUniqueViewers` int;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `anaAverageWatchPercent` int;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `andreiaUniqueViewers` int;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `andreiaAverageWatchPercent` int;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `robertoUniqueViewers` int;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `robertoAverageWatchPercent` int;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `originsJson` text;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `syncSource` varchar(32) DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD `providerUpdatedAt` bigint;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots` ADD CONSTRAINT `masterclass_landing_source_period_unique` UNIQUE(`sourceKey`,`periodStartAt`,`periodEndAt`);
