ALTER TABLE `monthly_social_results` ADD `periodStartAt` bigint;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `periodEndAt` bigint;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `isPartial` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `reelsMedianLikes` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `reelsMedianComments` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsPublished` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsTypicalReach` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsTypicalViews` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsTypicalInteractions` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsTypicalLikes` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsTypicalComments` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsTypicalShares` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `postsTypicalSaves` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `storiesTotalViews` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `storiesAverageViewsTenths` int;--> statement-breakpoint
ALTER TABLE `monthly_social_results` ADD `storiesBestViews` int;