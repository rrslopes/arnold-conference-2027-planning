import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  calendarWorkflow,
  emailPerformance,
  emailWorkflow,
  InsertUser,
  leadProfileSnapshots,
  masterclassLandingSnapshots,
  metricProgress,
  monthlyCongressSales,
  monthlySocialResults,
  monthlyWhatsAppResults,
  objectiveProgress,
  planningActivity,
  roomOccupancy,
  users,
} from "../drizzle/schema";
import type { SocialMonthlyResult } from "../shared/socialMetrics";
import { toStoredRate, type EmailPerformanceDraft } from "../shared/emailPerformance";
import { NEWS_LP_SOURCE, type LeadProfileSnapshotDraft } from "../shared/leadProfile";
import type { MasterclassLandingSnapshotDraft } from "../shared/masterclassLanding";
import type { WhatsAppMonthlyResult } from "../shared/whatsappPerformance";
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
  expandedCapacity: number | null;
  expansionConfirmed: boolean;
  expansionActive: boolean;
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

export type SocialMonthlyResultInput = SocialMonthlyResult;
export type EmailPerformanceInput = EmailPerformanceDraft;
export type LeadProfileSnapshotInput = LeadProfileSnapshotDraft;
export type MasterclassLandingSnapshotInput = MasterclassLandingSnapshotDraft;
export type WhatsAppMonthlyResultInput = WhatsAppMonthlyResult;

export async function getSharedPlanningState() {
  const db = await requireDb();
  const [objectives, metrics, activity, occupancy, monthlySales, socialResults, whatsappResults, editorialWorkflow, emailApprovals, emailPerformanceResults, leadProfileResults, masterclassLandingResults] = await Promise.all([
    db.select().from(objectiveProgress),
    db.select().from(metricProgress),
    db.select().from(planningActivity).orderBy(desc(planningActivity.createdAt)).limit(20),
    db.select().from(roomOccupancy),
    db.select().from(monthlyCongressSales),
    db.select().from(monthlySocialResults),
    db.select().from(monthlyWhatsAppResults),
    db.select().from(calendarWorkflow),
    db.select().from(emailWorkflow),
    db.select().from(emailPerformance).orderBy(desc(emailPerformance.sentAt)),
    db.select().from(leadProfileSnapshots).where(eq(leadProfileSnapshots.sourceKey, NEWS_LP_SOURCE.key)).orderBy(desc(leadProfileSnapshots.periodEndAt)),
    db.select().from(masterclassLandingSnapshots).orderBy(desc(masterclassLandingSnapshots.periodEndAt)),
  ]);
  return { objectives, metrics, activity, occupancy, monthlySales, socialResults, whatsappResults, editorialWorkflow, emailApprovals, emailPerformanceResults, leadProfileResults, masterclassLandingResults };
}

export async function saveLeadProfileSnapshot(entry: LeadProfileSnapshotInput) {
  const db = await requireDb();
  const now = Date.now();
  const values = {
    sourceKey: NEWS_LP_SOURCE.key,
    periodStartAt: entry.periodStartAt,
    periodEndAt: entry.periodEndAt,
    totalLeads: entry.totalLeads,
    newLeads: entry.newLeads,
    sessions: entry.sessions,
    dmSessions: entry.dmSessions,
    formStarts: entry.formStarts,
    dmConversions: entry.dmConversions,
    firstTimeCount: entry.firstTimeCount,
    attended2026Count: entry.attended2026Count,
    attendedPastCount: entry.attendedPastCount,
    nutritionAestheticsCount: entry.nutritionAestheticsCount,
    sportsNutritionCount: entry.sportsNutritionCount,
    sportsPhysioCount: entry.sportsPhysioCount,
    businessManagementCount: entry.businessManagementCount,
    physicalEducationCount: entry.physicalEducationCount,
    bodybuildingCount: entry.bodybuildingCount,
    otherInterestCount: entry.otherInterestCount,
    note: entry.note,
    updatedAt: now,
  };
  if (entry.id) await db.update(leadProfileSnapshots).set(values).where(eq(leadProfileSnapshots.id, entry.id));
  else await db.insert(leadProfileSnapshots).values({ ...values, singleInterestCount: null, multipleInterestsCount: null, topCitiesJson: "[]" });
  return { updatedAt: now };
}

export async function deleteLeadProfileSnapshot(id: number) {
  const db = await requireDb();
  await db.delete(leadProfileSnapshots).where(eq(leadProfileSnapshots.id, id));
  return { deletedId: id };
}

export async function saveMasterclassLandingSnapshot(entry: MasterclassLandingSnapshotInput) {
  const db = await requireDb();
  const now = Date.now();
  const values = {
    periodStartAt: entry.periodStartAt,
    periodEndAt: entry.periodEndAt,
    totalLeads: entry.totalLeads,
    newLeads: entry.newLeads,
    sessions: entry.sessions,
    dmSessions: entry.dmSessions,
    formStarts: entry.formStarts,
    dmConversions: entry.dmConversions,
    thankYouPageAccesses: entry.thankYouPageAccesses,
    anaLessonStarts: entry.anaLessonStarts,
    anaLessonCompletions: entry.anaLessonCompletions,
    andreiaLessonStarts: entry.andreiaLessonStarts,
    andreiaLessonCompletions: entry.andreiaLessonCompletions,
    robertoLessonStarts: entry.robertoLessonStarts,
    robertoLessonCompletions: entry.robertoLessonCompletions,
    congressHubClicks: entry.congressHubClicks,
    newsLpClicks: entry.newsLpClicks,
    salesPageClicks: entry.salesPageClicks,
    note: entry.note,
    updatedAt: now,
  };
  if (entry.id) await db.update(masterclassLandingSnapshots).set(values).where(eq(masterclassLandingSnapshots.id, entry.id));
  else await db.insert(masterclassLandingSnapshots).values(values);
  return { updatedAt: now };
}

export async function deleteMasterclassLandingSnapshot(id: number) {
  const db = await requireDb();
  await db.delete(masterclassLandingSnapshots).where(eq(masterclassLandingSnapshots.id, id));
  return { deletedId: id };
}

export async function saveEmailPerformance(entry: EmailPerformanceInput) {
  const db = await requireDb();
  const now = Date.now();
  const values = {
    campaignName: entry.campaignName,
    subject: entry.subject,
    sentAt: entry.sentAt,
    emailUrl: entry.emailUrl,
    openRateMilli: toStoredRate(entry.openRate),
    clickRateMilli: toStoredRate(entry.clickRate),
    unsubscribeRateMilli: toStoredRate(entry.unsubscribeRate),
    spamRateMilli: toStoredRate(entry.spamRate),
    deliveredCount: entry.deliveredCount,
    uniqueClicks: entry.uniqueClicks,
    attributedConversions: entry.attributedConversions,
    attributedRevenueCents: entry.attributedRevenueCents,
    updatedAt: now,
  };
  if (entry.id) {
    await db.update(emailPerformance).set(values).where(eq(emailPerformance.id, entry.id));
  } else {
    await db.insert(emailPerformance).values(values);
  }
  return { updatedAt: now };
}

export async function deleteEmailPerformance(id: number) {
  const db = await requireDb();
  await db.delete(emailPerformance).where(eq(emailPerformance.id, id));
  return { deletedId: id };
}

export async function saveSocialMonthlyResults(entries: SocialMonthlyResultInput[]) {
  const db = await requireDb();
  const now = Date.now();
  await db.transaction(async tx => {
    for (const entry of entries) {
      const values = {
        monthKey: entry.monthKey,
        accountsReached: entry.accountsReached,
        views: entry.views,
        interactions: entry.interactions,
        netFollowers: entry.netFollowers,
        metaMessagesSent: entry.metaMessagesSent,
        reelsPublished: entry.reelsPublished,
        reelsMedianReach: entry.reelsMedianReach,
        reelsMedianViews: entry.reelsMedianViews,
        reelsMedianInteractions: entry.reelsMedianInteractions,
        reelsMedianShares: entry.reelsMedianShares,
        reelsMedianSaves: entry.reelsMedianSaves,
        carouselsPublished: entry.carouselsPublished,
        carouselsMedianReach: entry.carouselsMedianReach,
        carouselsMedianViews: entry.carouselsMedianViews,
        carouselsMedianInteractions: entry.carouselsMedianInteractions,
        carouselsMedianShares: entry.carouselsMedianShares,
        carouselsMedianSaves: entry.carouselsMedianSaves,
        storiesPublished: entry.storiesPublished,
        storiesMedianReach: entry.storiesMedianReach,
        storiesMedianViews: entry.storiesMedianViews,
        storyReplies: entry.storyReplies,
        storyLinkClicks: entry.storyLinkClicks,
        storyStickerTaps: entry.storyStickerTaps,
        storyProfileVisits: entry.storyProfileVisits,
        note: entry.note,
        updatedAt: now,
      };
      await tx.insert(monthlySocialResults).values(values).onDuplicateKeyUpdate({ set: values });
    }
  });
  return { updatedAt: now };
}

export async function saveWhatsAppMonthlyResults(entries: WhatsAppMonthlyResultInput[]) {
  const db = await requireDb();
  const now = Date.now();
  await db.transaction(async tx => {
    for (const entry of entries) {
      const values = {
        monthKey: entry.monthKey,
        delivered: entry.delivered,
        linkClicks: entry.linkClicks,
        replies: entry.replies,
        optOuts: entry.optOuts,
        attributedPurchases: entry.attributedPurchases,
        humanHandoffs: entry.humanHandoffs,
        note: entry.note,
        updatedAt: now,
      };
      await tx.insert(monthlyWhatsAppResults).values(values).onDuplicateKeyUpdate({ set: values });
    }
  });
  return { updatedAt: now };
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
        expandedCapacity: entry.expandedCapacity,
        expansionConfirmed: entry.expansionConfirmed,
        expansionActive: entry.expansionActive,
        updatedById: actor.id,
        updatedByName: actorName,
        updatedAt: now,
      }).onDuplicateKeyUpdate({
        set: {
          capacity: entry.capacity,
          expandedCapacity: entry.expandedCapacity,
          expansionConfirmed: entry.expansionConfirmed,
          expansionActive: entry.expansionActive,
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
