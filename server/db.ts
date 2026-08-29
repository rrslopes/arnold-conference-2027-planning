import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  calendarWorkflow,
  emailWorkflow,
  InsertUser,
  metricProgress,
  monthlyCongressSales,
  objectiveProgress,
  planningActivity,
  roomOccupancy,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db;
}

type Actor = { id: number; name: string | null };

export type ObjectiveEntryInput = {
  key: string;
  target: string;
  current: string;
  note: string;
  validated: boolean;
};

export type MetricEntryInput = {
  key: string;
  target: string;
  actual: string;
  note: string;
  done: boolean;
};

export type OccupancyEntryInput = {
  congressKey: string;
  capacity: number | null;
  monthlySales: Array<{ monthKey: string; sold: number }>;
};

export type CalendarWorkflowInput = {
  calendarItemId: string;
  caption: string;
  artworkUrl: string;
  status: string;
};

export type EmailWorkflowInput = {
  emailItemId: string;
  previewUrl: string;
  status: string;
};

export async function getSharedPlanningState() {
  const db = await requireDb();
  const [objectives, metrics, activity, occupancy, monthlySales, editorialWorkflow, emailApprovals] = await Promise.all([
    db.select().from(objectiveProgress),
    db.select().from(metricProgress),
    db.select().from(planningActivity).orderBy(desc(planningActivity.createdAt)).limit(20),
    db.select().from(roomOccupancy),
    db.select().from(monthlyCongressSales),
    db.select().from(calendarWorkflow),
    db.select().from(emailWorkflow),
  ]);
  return { objectives, metrics, activity, occupancy, monthlySales, editorialWorkflow, emailApprovals };
}

export async function saveEmailWorkflow(entry: EmailWorkflowInput) {
  const db = await requireDb();
  const now = Date.now();
  await db.insert(emailWorkflow).values({
    emailItemId: entry.emailItemId,
    previewUrl: entry.previewUrl,
    status: entry.status,
    updatedAt: now,
  }).onDuplicateKeyUpdate({
    set: {
      previewUrl: entry.previewUrl,
      status: entry.status,
      updatedAt: now,
    },
  });
  return { updatedAt: now };
}

export async function saveCalendarWorkflow(entry: CalendarWorkflowInput) {
  const db = await requireDb();
  const now = Date.now();
  await db.insert(calendarWorkflow).values({
    calendarItemId: entry.calendarItemId,
    caption: entry.caption,
    artworkUrl: entry.artworkUrl,
    status: entry.status,
    updatedAt: now,
  }).onDuplicateKeyUpdate({
    set: {
      caption: entry.caption,
      artworkUrl: entry.artworkUrl,
      status: entry.status,
      updatedAt: now,
    },
  });
  return { updatedAt: now };
}

export async function saveObjectiveProgress(entries: ObjectiveEntryInput[], actor: Actor) {
  const db = await requireDb();
  const now = Date.now();
  const actorName = actor.name ?? "Usuário da equipe";
  await db.transaction(async tx => {
    for (const entry of entries) {
      await tx.insert(objectiveProgress).values({
        objectiveKey: entry.key,
        target: entry.target,
        current: entry.current,
        note: entry.note,
        validated: entry.validated,
        updatedById: actor.id,
        updatedByName: actorName,
        updatedAt: now,
      }).onDuplicateKeyUpdate({
        set: {
          target: entry.target,
          current: entry.current,
          note: entry.note,
          validated: entry.validated,
          updatedById: actor.id,
          updatedByName: actorName,
          updatedAt: now,
        },
      });
    }
    await tx.insert(planningActivity).values({
      entityType: "objectives",
      action: "save",
      snapshot: JSON.stringify(entries),
      actorId: actor.id,
      actorName,
      createdAt: now,
    });
  });
  return { updatedAt: now, updatedByName: actorName };
}

export async function saveMetricProgress(entries: MetricEntryInput[], actor: Actor) {
  const db = await requireDb();
  const now = Date.now();
  const actorName = actor.name ?? "Usuário da equipe";
  await db.transaction(async tx => {
    for (const entry of entries) {
      await tx.insert(metricProgress).values({
        metricKey: entry.key,
        target: entry.target,
        actual: entry.actual,
        note: entry.note,
        done: entry.done,
        updatedById: actor.id,
        updatedByName: actorName,
        updatedAt: now,
      }).onDuplicateKeyUpdate({
        set: {
          target: entry.target,
          actual: entry.actual,
          note: entry.note,
          done: entry.done,
          updatedById: actor.id,
          updatedByName: actorName,
          updatedAt: now,
        },
      });
    }
    await tx.insert(planningActivity).values({
      entityType: "metrics",
      action: "save",
      snapshot: JSON.stringify(entries),
      actorId: actor.id,
      actorName,
      createdAt: now,
    });
  });
  return { updatedAt: now, updatedByName: actorName };
}

export async function saveOccupancyProgress(entries: OccupancyEntryInput[], actor: Actor) {
  const db = await requireDb();
  const now = Date.now();
  const actorName = actor.name ?? "Usuário da equipe";
  await db.transaction(async tx => {
    for (const entry of entries) {
      await tx.insert(roomOccupancy).values({
        congressKey: entry.congressKey,
        capacity: entry.capacity,
        updatedById: actor.id,
        updatedByName: actorName,
        updatedAt: now,
      }).onDuplicateKeyUpdate({
        set: {
          capacity: entry.capacity,
          updatedById: actor.id,
          updatedByName: actorName,
          updatedAt: now,
        },
      });
      for (const month of entry.monthlySales) {
        await tx.insert(monthlyCongressSales).values({
          congressKey: entry.congressKey,
          monthKey: month.monthKey,
          sold: month.sold,
          updatedById: actor.id,
          updatedByName: actorName,
          updatedAt: now,
        }).onDuplicateKeyUpdate({
          set: {
            sold: month.sold,
            updatedById: actor.id,
            updatedByName: actorName,
            updatedAt: now,
          },
        });
      }
    }
    await tx.insert(planningActivity).values({
      entityType: "occupancy",
      action: "save",
      snapshot: JSON.stringify(entries),
      actorId: actor.id,
      actorName,
      createdAt: now,
    });
  });
  return { updatedAt: now, updatedByName: actorName };
}

export async function clearObjectiveProgress(actor: Actor) {
  const db = await requireDb();
  const now = Date.now();
  const actorName = actor.name ?? "Usuário da equipe";
  await db.transaction(async tx => {
    await tx.delete(objectiveProgress);
    await tx.insert(planningActivity).values({
      entityType: "objectives",
      action: "clear",
      snapshot: "[]",
      actorId: actor.id,
      actorName,
      createdAt: now,
    });
  });
  return { updatedAt: now, updatedByName: actorName };
}

export async function clearMetricProgress(actor: Actor) {
  const db = await requireDb();
  const now = Date.now();
  const actorName = actor.name ?? "Usuário da equipe";
  await db.transaction(async tx => {
    await tx.delete(metricProgress);
    await tx.insert(planningActivity).values({
      entityType: "metrics",
      action: "clear",
      snapshot: "[]",
      actorId: actor.id,
      actorName,
      createdAt: now,
    });
  });
  return { updatedAt: now, updatedByName: actorName };
}
