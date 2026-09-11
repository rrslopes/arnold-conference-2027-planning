ALTER TABLE `masterclass_landing_snapshots` ADD `uniquePeopleInPeriod` int;--> statement-breakpoint
ALTER TABLE `masterclass_landing_snapshots`
  ADD `uniquePeopleInPeriod` int,
  ADD `totalUniquePeople` int;
