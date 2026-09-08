import { afterAll, describe, expect, it } from "vitest";
import { eq, or } from "drizzle-orm";
import type { TrpcContext } from "./_core/context";
import { getDb, saveOccupancyProgress, saveSocialMonthlyResults, saveWhatsAppMonthlyResults } from "./db";
import { appRouter } from "./routers";
import { calendarWorkflow, emailPerformance, emailWorkflow, leadProfileSnapshots, masterclassLandingSnapshots, monthlyCongressSales, monthlySocialResults, monthlyWhatsAppResults, objectiveProgress, planningActivity, roomOccupancy } from "../drizzle/schema";

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const objectiveKey = `qa-sync-${runId}`;
const occupancyKey = `qa-occupancy-${runId}`;
const workflowKey = "9999";
const emailWorkflowKey = `email-base-qa-sync-${runId}`;
const socialMonthKey = "2099-99";
const whatsappMonthKey = "2099-98";
const emailCampaignName = `QA Performance ${runId}`;
const leadSnapshotNote = `QA LP ${runId}`;
const masterclassSnapshotNote = `QA Masterclass LP ${runId}`;
const actorAName = `QA Navegador A ${runId}`;
const actorBName = `QA Navegador B ${runId}`;

function createAnonymousContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe.sequential("shared planning persistence", () => {
  afterAll(async () => {
    const db = await getDb();
    if (!db) return;
    await db.delete(objectiveProgress).where(eq(objectiveProgress.objectiveKey, objectiveKey));
    await db.delete(monthlyCongressSales).where(eq(monthlyCongressSales.congressKey, occupancyKey));
    await db.delete(roomOccupancy).where(eq(roomOccupancy.congressKey, occupancyKey));
    await db.delete(calendarWorkflow).where(eq(calendarWorkflow.calendarItemId, workflowKey));
    await db.delete(emailWorkflow).where(eq(emailWorkflow.emailItemId, emailWorkflowKey));
    await db.delete(monthlySocialResults).where(eq(monthlySocialResults.monthKey, socialMonthKey));
    await db.delete(monthlyWhatsAppResults).where(eq(monthlyWhatsAppResults.monthKey, whatsappMonthKey));
    await db.delete(emailPerformance).where(eq(emailPerformance.campaignName, emailCampaignName));
    await db.delete(leadProfileSnapshots).where(eq(leadProfileSnapshots.note, leadSnapshotNote));
    await db.delete(masterclassLandingSnapshots).where(eq(masterclassLandingSnapshots.note, masterclassSnapshotNote));
    await db.delete(planningActivity).where(or(eq(planningActivity.actorName, actorAName), eq(planningActivity.actorName, actorBName)));
  });

  it("saves in one authenticated session and reads in another", async () => {
    const anonymousBrowserA = appRouter.createCaller(createAnonymousContext());
    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());

    await anonymousBrowserA.planning.saveObjectives({
      entries: [{ key: objectiveKey, target: "1200", current: "180", note: "Registro do navegador A", validated: false }],
      actorName: actorAName,
    });

    const readInBrowserB = await anonymousBrowserB.planning.getState();
    expect(readInBrowserB.objectives.find(item => item.objectiveKey === objectiveKey)).toMatchObject({
      target: "1200",
      current: "180",
      updatedByName: actorAName,
    });
    expect(readInBrowserB.activity.some(item => item.actorName === actorAName && item.entityType === "objectives")).toBe(true);

    await anonymousBrowserB.planning.saveObjectives({
      entries: [{ key: objectiveKey, target: "1200", current: "360", note: "Atualização do navegador B", validated: true }],
      actorName: actorBName,
    });

    const readBackInBrowserA = await anonymousBrowserA.planning.getState();
    expect(readBackInBrowserA.objectives.find(item => item.objectiveKey === objectiveKey)).toMatchObject({
      current: "360",
      note: "Atualização do navegador B",
      validated: true,
      updatedByName: actorBName,
    });
    expect(readBackInBrowserA.activity.some(item => item.actorName === actorBName && item.entityType === "objectives")).toBe(true);
  });

  it("persists capacity and monthly sales for a second anonymous browser", async () => {
    await saveOccupancyProgress([{ congressKey: occupancyKey, capacity: 500, expandedCapacity: 650, expansionConfirmed: false, expansionActive: false, monthlySales: [
      { monthKey: "2026-09", sold: 80 },
      { monthKey: "2026-10", sold: 45 },
    ] }], { id: 0, name: actorAName });

    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());
    const state = await anonymousBrowserB.planning.getState();
    expect(state.occupancy.find(item => item.congressKey === occupancyKey)).toMatchObject({ capacity: 500, expandedCapacity: 650, expansionConfirmed: false, expansionActive: false, updatedByName: actorAName });
    expect(state.monthlySales.filter(item => item.congressKey === occupancyKey).map(item => [item.monthKey, item.sold])).toEqual(expect.arrayContaining([
      ["2026-09", 80],
      ["2026-10", 45],
    ]));
    expect(state.activity.some(item => item.actorName === actorAName && item.entityType === "occupancy")).toBe(true);
  });

  it("synchronizes caption, artwork link and status between anonymous browsers", async () => {
    const anonymousBrowserA = appRouter.createCaller(createAnonymousContext());
    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());

    await anonymousBrowserA.planning.saveCalendarWorkflow({
      calendarItemId: workflowKey,
      caption: "Legenda criada pelo navegador A",
      artworkUrl: "https://drive.google.com/file/d/qa-a/view",
      status: "aprovar-legenda",
    });

    const readInBrowserB = await anonymousBrowserB.planning.getState();
    expect(readInBrowserB.editorialWorkflow.find(item => item.calendarItemId === workflowKey)).toMatchObject({
      caption: "Legenda criada pelo navegador A",
      artworkUrl: "https://drive.google.com/file/d/qa-a/view",
      status: "aprovar-legenda",
    });

    await anonymousBrowserB.planning.saveCalendarWorkflow({
      calendarItemId: workflowKey,
      caption: "Legenda ajustada e aprovada pelo navegador B",
      artworkUrl: "https://drive.google.com/file/d/qa-b/view",
      status: "aprovado-para-programar",
    });

    const readBackInBrowserA = await anonymousBrowserA.planning.getState();
    expect(readBackInBrowserA.editorialWorkflow.find(item => item.calendarItemId === workflowKey)).toMatchObject({
      caption: "Legenda ajustada e aprovada pelo navegador B",
      artworkUrl: "https://drive.google.com/file/d/qa-b/view",
      status: "aprovado-para-programar",
    });
  });

  it("synchronizes email preview and email-specific status between anonymous browsers", async () => {
    const anonymousBrowserA = appRouter.createCaller(createAnonymousContext());
    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());

    await anonymousBrowserA.planning.saveEmailWorkflow({
      emailItemId: emailWorkflowKey,
      previewUrl: "https://example.com/email-preview-a",
      status: "em-criacao",
    });

    const readInBrowserB = await anonymousBrowserB.planning.getState();
    expect(readInBrowserB.emailApprovals.find(item => item.emailItemId === emailWorkflowKey)).toMatchObject({
      previewUrl: "https://example.com/email-preview-a",
      status: "em-criacao",
    });

    await anonymousBrowserB.planning.saveEmailWorkflow({
      emailItemId: emailWorkflowKey,
      previewUrl: "https://example.com/email-preview-b",
      status: "email-mkt-aprovado",
    });

    const readBackInBrowserA = await anonymousBrowserA.planning.getState();
    expect(readBackInBrowserA.emailApprovals.find(item => item.emailItemId === emailWorkflowKey)).toMatchObject({
      previewUrl: "https://example.com/email-preview-b",
      status: "email-mkt-aprovado",
    });
  });

  it("persists a social result and exposes it to a second anonymous browser", async () => {
    await saveSocialMonthlyResults([{
      monthKey: socialMonthKey as "2026-09",
      accountsReached: 32000,
      views: 60000,
      interactions: 2400,
      netFollowers: 100,
      metaMessagesSent: 700,
      reelsPublished: 8,
      reelsMedianReach: 3996,
      reelsMedianViews: 4739,
      reelsMedianInteractions: 89,
      reelsMedianShares: 12,
      reelsMedianSaves: 5,
      carouselsPublished: 4,
      carouselsMedianReach: 2190,
      carouselsMedianViews: 4933,
      carouselsMedianInteractions: 86,
      carouselsMedianShares: 11,
      carouselsMedianSaves: 3,
      storiesPublished: 60,
      storiesMedianReach: 277,
      storiesMedianViews: 382,
      storyReplies: 8,
      storyLinkClicks: 95,
      storyStickerTaps: 40,
      storyProfileVisits: 109,
      note: "Registro de QA sem autoria visível",
    }]);

    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());
    const state = await anonymousBrowserB.planning.getState();
    expect(state.socialResults.find(item => item.monthKey === socialMonthKey)).toMatchObject({
      accountsReached: 32000,
      metaMessagesSent: 700,
      reelsMedianShares: 12,
      reelsMedianSaves: 5,
      storyLinkClicks: 95,
      note: "Registro de QA sem autoria visível",
    });
  });

  it("creates, updates, reads and deletes email performance between anonymous browsers", async () => {
    const anonymousBrowserA = appRouter.createCaller(createAnonymousContext());
    const anonymousBrowserB = appRouter.createCaller(createAnonymousContext());
    const initial = {
      campaignName: emailCampaignName,
      subject: "Assunto inicial de QA",
      sentAt: Date.UTC(2026, 8, 4, 12),
      emailUrl: "https://example.com/qa-email",
      openRate: 31.25,
      clickRate: null,
      unsubscribeRate: null,
      spamRate: null,
      deliveredCount: 800,
      uniqueClicks: null,
      attributedConversions: null,
      attributedRevenueCents: null,
    };
    await anonymousBrowserA.planning.saveEmailPerformance(initial);

    const readInBrowserB = await anonymousBrowserB.planning.getState();
    const created = readInBrowserB.emailPerformanceResults.find(item => item.campaignName === emailCampaignName);
    expect(created).toMatchObject({ subject: initial.subject, openRateMilli: 31250, clickRateMilli: null, deliveredCount: 800 });

    await anonymousBrowserB.planning.saveEmailPerformance({ ...initial, id: created!.id, clickRate: 5.4, unsubscribeRate: 0.18, spamRate: 0.02, uniqueClicks: 43, attributedConversions: 6, attributedRevenueCents: 189900 });
    const readBackInBrowserA = await anonymousBrowserA.planning.getState();
    expect(readBackInBrowserA.emailPerformanceResults.find(item => item.id === created!.id)).toMatchObject({ clickRateMilli: 5400, unsubscribeRateMilli: 180, spamRateMilli: 20, uniqueClicks: 43, attributedConversions: 6, attributedRevenueCents: 189900 });

    await anonymousBrowserA.planning.deleteEmailPerformance({ id: created!.id });
    const afterDelete = await anonymousBrowserB.planning.getState();
    expect(afterDelete.emailPerformanceResults.some(item => item.id === created!.id)).toBe(false);
  });

  it("creates, updates, reads and deletes a news LP snapshot between anonymous browsers", async () => {
    const browserA = appRouter.createCaller(createAnonymousContext());
    const browserB = appRouter.createCaller(createAnonymousContext());
    const initial = {
      periodStartAt: Date.UTC(2026, 8, 1, 12), periodEndAt: Date.UTC(2026, 8, 4, 12), totalLeads: 100, newLeads: 20,
      sessions: 200, dmSessions: 35, formStarts: 50, dmConversions: 8,
      firstTimeCount: 50, attended2026Count: 30, attendedPastCount: 20,
      nutritionAestheticsCount: 55, sportsNutritionCount: 50, sportsPhysioCount: 25, businessManagementCount: 20,
      physicalEducationCount: 30, bodybuildingCount: 15, otherInterestCount: 5,
      note: leadSnapshotNote,
    };
    await browserA.planning.saveLeadProfileSnapshot(initial);
    const readInB = await browserB.planning.getState();
    const created = readInB.leadProfileResults.find(item => item.note === leadSnapshotNote);
    expect(created).toMatchObject({ sourceKey: "conference-news-lp", totalLeads: 100, sessions: 200, dmSessions: 35, formStarts: 50, dmConversions: 8, topCitiesJson: "[]" });

    await browserB.planning.saveLeadProfileSnapshot({ ...initial, id: created!.id, totalLeads: 120, newLeads: 40 });
    const readBackInA = await browserA.planning.getState();
    expect(readBackInA.leadProfileResults.find(item => item.id === created!.id)).toMatchObject({ totalLeads: 120, newLeads: 40 });

    await browserA.planning.deleteLeadProfileSnapshot({ id: created!.id });
    const afterDelete = await browserB.planning.getState();
    expect(afterDelete.leadProfileResults.some(item => item.id === created!.id)).toBe(false);
  });

  it("persists the monthly WhatsApp source and exposes it to another anonymous browser", async () => {
    await saveWhatsAppMonthlyResults([{ monthKey: whatsappMonthKey as "2026-09", delivered: 480, linkClicks: 42, replies: 18, optOuts: 2, attributedPurchases: 3, humanHandoffs: 9, note: "QA compartilhado" }]);
    const browserB = appRouter.createCaller(createAnonymousContext());
    const state = await browserB.planning.getState();
    expect(state.whatsappResults.find(item => item.monthKey === whatsappMonthKey)).toMatchObject({ delivered: 480, linkClicks: 42, replies: 18, attributedPurchases: 3, humanHandoffs: 9 });
  });

  it("persists, edits and deletes the masterclass landing source across anonymous browsers", async () => {
    const browserA = appRouter.createCaller(createAnonymousContext());
    const browserB = appRouter.createCaller(createAnonymousContext());
    const initial = {
      periodStartAt: Date.UTC(2026, 8, 1, 12), periodEndAt: Date.UTC(2026, 8, 8, 12), totalLeads: 80, newLeads: 20,
      sessions: 160, dmSessions: 30, formStarts: 35, dmConversions: 6, thankYouPageAccesses: 18,
      anaLessonStarts: 10, anaLessonCompletions: 5, andreiaLessonStarts: 8, andreiaLessonCompletions: 3,
      robertoLessonStarts: 6, robertoLessonCompletions: 2, congressHubClicks: 4, newsLpClicks: 2, salesPageClicks: null, note: masterclassSnapshotNote,
    };
    await browserA.planning.saveMasterclassLandingSnapshot(initial);
    const readInB = await browserB.planning.getState();
    const created = readInB.masterclassLandingResults.find(item => item.note === masterclassSnapshotNote);
    expect(created).toMatchObject({ totalLeads: 80, newLeads: 20, sessions: 160, thankYouPageAccesses: 18, anaLessonStarts: 10 });

    await browserB.planning.saveMasterclassLandingSnapshot({ ...initial, id: created!.id, totalLeads: 95, newLeads: 35 });
    const readBackInA = await browserA.planning.getState();
    expect(readBackInA.masterclassLandingResults.find(item => item.id === created!.id)).toMatchObject({ totalLeads: 95, newLeads: 35 });

    await browserA.planning.deleteMasterclassLandingSnapshot({ id: created!.id });
    const afterDelete = await browserB.planning.getState();
    expect(afterDelete.masterclassLandingResults.some(item => item.id === created!.id)).toBe(false);
  });
});
