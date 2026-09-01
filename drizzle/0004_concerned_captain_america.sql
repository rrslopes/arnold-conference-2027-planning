ALTER TABLE `room_occupancy` ADD `expandedCapacity` int;--> statement-breakpoint
ALTER TABLE `room_occupancy` ADD `expansionActive` boolean DEFAULT false NOT NULL;