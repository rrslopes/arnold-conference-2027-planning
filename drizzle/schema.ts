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

export type ObjectiveProgress = typeof objectiveProgress.$inferSelect;
export type InsertObjectiveProgress = typeof objectiveProgress.$inferInsert;
export type MetricProgress = typeof metricProgress.$inferSelect;
export type InsertMetricProgress = typeof metricProgress.$inferInsert;
export type PlanningActivity = typeof planningActivity.$inferSelect;
export type RoomOccupancy = typeof roomOccupancy.$inferSelect;
export type InsertRoomOccupancy = typeof roomOccupancy.$inferInsert;
export type MonthlyCongressSale = typeof monthlyCongressSales.$inferSelect;
export type InsertMonthlyCongressSale = typeof monthlyCongressSales.$inferInsert;
export type CalendarWorkflow = typeof calendarWorkflow.$inferSelect;
export type InsertCalendarWorkflow = typeof calendarWorkflow.$inferInsert;
export type EmailWorkflow = typeof emailWorkflow.$inferSelect;
export type InsertEmailWorkflow = typeof emailWorkflow.$inferInsert;
