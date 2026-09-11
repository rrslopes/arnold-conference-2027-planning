import { bigint, boolean, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const objectiveProgress = mysqlTable("objective_progress", {
  id: int("id").autoincrement().primaryKey(),
  objectiveKey: varchar("objectiveKey", { length: 80 }).notNull().unique(),
  target: text("target").notNull(),
  current: text("current").notNull(),
  note: text("note").notNull(),
  validated: boolean("validated").default(false).notNull(),
  updatedById: int("updatedById").notNull(),
  updatedByName: varchar("updatedByName", { length: 255 }),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const metricProgress = mysqlTable("metric_progress", {
  id: int("id").autoincrement().primaryKey(),
  metricKey: varchar("metricKey", { length: 180 }).notNull().unique(),
  target: text("target").notNull(),
  actual: text("actual").notNull(),
  note: text("note").notNull(),
  done: boolean("done").default(false).notNull(),
  updatedById: int("updatedById").notNull(),
  updatedByName: varchar("updatedByName", { length: 255 }),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const planningActivity = mysqlTable("planning_activity", {
  id: int("id").autoincrement().primaryKey(),
  entityType: mysqlEnum("entityType", ["objectives", "metrics", "occupancy"]).notNull(),
  action: mysqlEnum("action", ["save", "clear"]).notNull(),
  snapshot: text("snapshot").notNull(),
  actorId: int("actorId").notNull(),
  actorName: varchar("actorName", { length: 255 }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
});

export const roomOccupancy = mysqlTable("room_occupancy", {
  id: int("id").autoincrement().primaryKey(),
  congressKey: varchar("congressKey", { length: 64 }).notNull().unique(),
  capacity: int("capacity"),
  expandedCapacity: int("expandedCapacity"),
  expansionConfirmed: boolean("expansionConfirmed").default(false).notNull(),
  expansionActive: boolean("expansionActive").default(false).notNull(),
  updatedById: int("updatedById").notNull(),
  updatedByName: varchar("updatedByName", { length: 255 }),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const monthlyCongressSales = mysqlTable("monthly_congress_sales", {
  id: int("id").autoincrement().primaryKey(),
  congressKey: varchar("congressKey", { length: 64 }).notNull(),
  monthKey: varchar("monthKey", { length: 7 }).notNull(),
  sold: int("sold").default(0).notNull(),
  updatedById: int("updatedById").notNull(),
  updatedByName: varchar("updatedByName", { length: 255 }),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => ({
  congressMonthUnique: uniqueIndex("monthly_congress_sales_congress_month_unique").on(table.congressKey, table.monthKey),
}));

export const monthlySocialResults = mysqlTable("monthly_social_results", {
  id: int("id").autoincrement().primaryKey(),
  monthKey: varchar("monthKey", { length: 7 }).notNull().unique(),
  periodStartAt: bigint("periodStartAt", { mode: "number" }),
  periodEndAt: bigint("periodEndAt", { mode: "number" }),
  isPartial: boolean("isPartial").default(false).notNull(),
  accountsReached: int("accountsReached"),
  views: int("views"),
  interactions: int("interactions"),
  netFollowers: int("netFollowers"),
  metaMessagesSent: int("metaMessagesSent"),
  reelsPublished: int("reelsPublished"),
  reelsMedianReach: int("reelsMedianReach"),
  reelsMedianViews: int("reelsMedianViews"),
  reelsMedianInteractions: int("reelsMedianInteractions"),
  reelsMedianLikes: int("reelsMedianLikes"),
  reelsMedianComments: int("reelsMedianComments"),
  reelsMedianSharesSaves: int("reelsMedianSharesSaves"),
  reelsMedianShares: int("reelsMedianShares"),
  reelsMedianSaves: int("reelsMedianSaves"),
  carouselsPublished: int("carouselsPublished"),
  carouselsMedianReach: int("carouselsMedianReach"),
  carouselsMedianViews: int("carouselsMedianViews"),
  carouselsMedianInteractions: int("carouselsMedianInteractions"),
  carouselsMedianSharesSaves: int("carouselsMedianSharesSaves"),
  carouselsMedianShares: int("carouselsMedianShares"),
  carouselsMedianSaves: int("carouselsMedianSaves"),
  postsPublished: int("postsPublished"),
  postsTypicalReach: int("postsTypicalReach"),
  postsTypicalViews: int("postsTypicalViews"),
  postsTypicalInteractions: int("postsTypicalInteractions"),
  postsTypicalLikes: int("postsTypicalLikes"),
  postsTypicalComments: int("postsTypicalComments"),
  postsTypicalShares: int("postsTypicalShares"),
  postsTypicalSaves: int("postsTypicalSaves"),
  storiesPublished: int("storiesPublished"),
  storiesMedianReach: int("storiesMedianReach"),
  storiesMedianViews: int("storiesMedianViews"),
  storiesTotalViews: int("storiesTotalViews"),
  storiesAverageViewsTenths: int("storiesAverageViewsTenths"),
  storiesBestViews: int("storiesBestViews"),
  storyReplies: int("storyReplies"),
  storyLinkClicks: int("storyLinkClicks"),
  storyStickerTaps: int("storyStickerTaps"),
  storyProfileVisits: int("storyProfileVisits"),
  note: text("note").notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const calendarWorkflow = mysqlTable("calendar_workflow", {
  id: int("id").autoincrement().primaryKey(),
  calendarItemId: varchar("calendarItemId", { length: 24 }).notNull().unique(),
  caption: text("caption").notNull(),
  artworkUrl: varchar("artworkUrl", { length: 2048 }).notNull(),
  status: varchar("status", { length: 64 }).default("nao-iniciado").notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const emailWorkflow = mysqlTable("email_workflow", {
  id: int("id").autoincrement().primaryKey(),
  emailItemId: varchar("emailItemId", { length: 48 }).notNull().unique(),
  previewUrl: varchar("previewUrl", { length: 2048 }).notNull(),
  status: varchar("status", { length: 64 }).default("nao-foi-feito").notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const emailPerformance = mysqlTable("email_performance", {
  id: int("id").autoincrement().primaryKey(),
  campaignName: varchar("campaignName", { length: 180 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  sentAt: bigint("sentAt", { mode: "number" }).notNull(),
  emailUrl: varchar("emailUrl", { length: 2048 }).notNull(),
  openRateMilli: int("openRateMilli"),
  clickRateMilli: int("clickRateMilli"),
  unsubscribeRateMilli: int("unsubscribeRateMilli"),
  spamRateMilli: int("spamRateMilli"),
  deliveredCount: int("deliveredCount"),
  uniqueClicks: int("uniqueClicks"),
  attributedConversions: int("attributedConversions"),
  attributedRevenueCents: int("attributedRevenueCents"),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const leadProfileSnapshots = mysqlTable("lead_profile_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  sourceKey: varchar("sourceKey", { length: 64 }).notNull(),
  periodStartAt: bigint("periodStartAt", { mode: "number" }).notNull(),
  periodEndAt: bigint("periodEndAt", { mode: "number" }).notNull(),
  totalLeads: int("totalLeads").notNull(),
  newLeads: int("newLeads").notNull(),
  sessions: int("sessions"),
  dmSessions: int("dmSessions"),
  formStarts: int("formStarts"),
  dmConversions: int("dmConversions"),
  firstTimeCount: int("firstTimeCount"),
  attended2026Count: int("attended2026Count"),
  attendedPastCount: int("attendedPastCount"),
  nutritionAestheticsCount: int("nutritionAestheticsCount"),
  sportsNutritionCount: int("sportsNutritionCount"),
  sportsPhysioCount: int("sportsPhysioCount"),
  businessManagementCount: int("businessManagementCount"),
  physicalEducationCount: int("physicalEducationCount"),
  bodybuildingCount: int("bodybuildingCount"),
  otherInterestCount: int("otherInterestCount"),
  singleInterestCount: int("singleInterestCount"),
  multipleInterestsCount: int("multipleInterestsCount"),
  topCitiesJson: text("topCitiesJson").notNull(),
  note: text("note").notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export const masterclassLandingSnapshots = mysqlTable("masterclass_landing_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  sourceKey: varchar("sourceKey", { length: 64 }).default("masterclass-lp").notNull(),
  periodStartAt: bigint("periodStartAt", { mode: "number" }).notNull(),
  periodEndAt: bigint("periodEndAt", { mode: "number" }).notNull(),
  totalLeads: int("totalLeads").notNull(),
  newLeads: int("newLeads").notNull(),
  sessions: int("sessions"),
  dmSessions: int("dmSessions"),
  formStarts: int("formStarts"),
  dmConversions: int("dmConversions"),
  thankYouPageAccesses: int("thankYouPageAccesses"),
  anaLessonStarts: int("anaLessonStarts"),
  anaLessonCompletions: int("anaLessonCompletions"),
  anaUniqueViewers: int("anaUniqueViewers"),
  anaAverageWatchPercent: int("anaAverageWatchPercent"),
  andreiaLessonStarts: int("andreiaLessonStarts"),
  andreiaLessonCompletions: int("andreiaLessonCompletions"),
  andreiaUniqueViewers: int("andreiaUniqueViewers"),
  andreiaAverageWatchPercent: int("andreiaAverageWatchPercent"),
  robertoLessonStarts: int("robertoLessonStarts"),
  robertoLessonCompletions: int("robertoLessonCompletions"),
  robertoUniqueViewers: int("robertoUniqueViewers"),
  robertoAverageWatchPercent: int("robertoAverageWatchPercent"),
  congressHubClicks: int("congressHubClicks"),
  newsLpClicks: int("newsLpClicks"),
  salesPageClicks: int("salesPageClicks"),
  originsJson: text("originsJson"),
  syncSource: varchar("syncSource", { length: 32 }).default("manual").notNull(),
  providerUpdatedAt: bigint("providerUpdatedAt", { mode: "number" }),
  note: text("note").notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, table => ({
  sourcePeriodUnique: uniqueIndex("masterclass_landing_source_period_unique").on(table.sourceKey, table.periodStartAt, table.periodEndAt),
}));

export const monthlyWhatsAppResults = mysqlTable("monthly_whatsapp_results", {
  id: int("id").autoincrement().primaryKey(),
  monthKey: varchar("monthKey", { length: 7 }).notNull().unique(),
  delivered: int("delivered"),
  linkClicks: int("linkClicks"),
  replies: int("replies"),
  optOuts: int("optOuts"),
  attributedPurchases: int("attributedPurchases"),
  humanHandoffs: int("humanHandoffs"),
  note: text("note").notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
});

export type ObjectiveProgress = typeof objectiveProgress.$inferSelect;
export type InsertObjectiveProgress = typeof objectiveProgress.$inferInsert;
export type MetricProgress = typeof metricProgress.$inferSelect;
export type InsertMetricProgress = typeof metricProgress.$inferInsert;
export type PlanningActivity = typeof planningActivity.$inferSelect;
export type RoomOccupancy = typeof roomOccupancy.$inferSelect;
export type InsertRoomOccupancy = typeof roomOccupancy.$inferInsert;
export type MonthlyCongressSale = typeof monthlyCongressSales.$inferSelect;
export type InsertMonthlyCongressSale = typeof monthlyCongressSales.$inferInsert;
export type MonthlySocialResult = typeof monthlySocialResults.$inferSelect;
export type InsertMonthlySocialResult = typeof monthlySocialResults.$inferInsert;
export type CalendarWorkflow = typeof calendarWorkflow.$inferSelect;
export type InsertCalendarWorkflow = typeof calendarWorkflow.$inferInsert;
export type EmailWorkflow = typeof emailWorkflow.$inferSelect;
export type InsertEmailWorkflow = typeof emailWorkflow.$inferInsert;
export type EmailPerformance = typeof emailPerformance.$inferSelect;
export type InsertEmailPerformance = typeof emailPerformance.$inferInsert;
export type LeadProfileSnapshotRow = typeof leadProfileSnapshots.$inferSelect;
export type InsertLeadProfileSnapshotRow = typeof leadProfileSnapshots.$inferInsert;
export type MasterclassLandingSnapshotRow = typeof masterclassLandingSnapshots.$inferSelect;
export type InsertMasterclassLandingSnapshotRow = typeof masterclassLandingSnapshots.$inferInsert;
export type MonthlyWhatsAppResult = typeof monthlyWhatsAppResults.$inferSelect;
export type InsertMonthlyWhatsAppResult = typeof monthlyWhatsAppResults.$inferInsert;
