import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Qualification thresholds ─────────────────────────────────────────────────
const THRESHOLDS = {
  member:  { nights: 5,  spend: 1_250_000, stays: 2 },
  reserve: { nights: 12, spend: 3_500_000, stays: 3 },
  estate:  { nights: 25, spend: 8_000_000, stays: 5 },
  pinnacle: null, // invitation only
};

const TIER_ORDER = ["member", "reserve", "estate", "pinnacle"] as const;

function nextTier(current: string): string | null {
  const idx = TIER_ORDER.indexOf(current as typeof TIER_ORDER[number]);
  if (idx === -1 || idx >= TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

function closestPath(
  nights: number,
  spend: number,
  stays: number,
  tier: string
): string | null {
  const th = THRESHOLDS[tier as keyof typeof THRESHOLDS];
  if (!th) return null;
  const nightsLeft = Math.max(0, th.nights - nights);
  const spendLeft  = Math.max(0, th.spend  - spend);
  const staysLeft  = Math.max(0, th.stays  - stays);
  if (nightsLeft === 0 && spendLeft === 0 && staysLeft === 0) return "You qualify. Awaiting staff review.";
  const parts: string[] = [];
  if (nightsLeft > 0) parts.push(`${nightsLeft} more night${nightsLeft > 1 ? "s" : ""}`);
  if (staysLeft  > 0) parts.push(`${staysLeft} more stay${staysLeft  > 1 ? "s" : ""}`);
  // pick shortest path
  const nightPath = nightsLeft > 0 ? `${nightsLeft} more night${nightsLeft > 1 ? "s" : ""}` : null;
  const spendPath = spendLeft  > 0 ? `\u20a6${(spendLeft / 1_000_000).toFixed(2)}M more in eligible spend` : null;
  if (nightsLeft > 0 && spendLeft > 0) {
    return `Your closest path: ${nightsLeft} more night${nightsLeft > 1 ? "s" : ""} OR \u20a6${(spendLeft / 1_000_000).toFixed(2)}M more spend${staysLeft > 0 ? ` \u00b7 ${staysLeft} more stay${staysLeft > 1 ? "s" : ""}` : ""}.`;
  }
  if (nightsLeft > 0) return `Your closest path: ${nightsLeft} more night${nightsLeft > 1 ? "s" : ""}${staysLeft > 0 ? ` \u00b7 ${staysLeft} more stay${staysLeft > 1 ? "s" : ""}` : ""}.`;
  if (spendLeft  > 0) return `Your closest path: \u20a6${(spendLeft / 1_000_000).toFixed(2)}M more in eligible spend${staysLeft > 0 ? ` \u00b7 ${staysLeft} more stay${staysLeft > 1 ? "s" : ""}` : ""}.`;
  return staysLeft > 0 ? `Your closest path: ${staysLeft} more stay${staysLeft > 1 ? "s" : ""}.` : null;
}

// ─── Public: get current membership status for authenticated guest ─────────────
export const getMyStatus = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", token))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;

    const record = await ctx.db
      .query("memberships")
      .withIndex("by_user", q => q.eq("userId", session.userId))
      .filter(q => q.eq(q.field("status"), "active"))
      .first();

    if (!record) return null;

    const tier = record.tier;
    const nights = record.qualifyingNights ?? 0;
    const spend  = record.spendForYear     ?? 0;
    const stays  = record.separateStays    ?? 0;
    const th = THRESHOLDS[tier as keyof typeof THRESHOLDS];
    const next = nextTier(tier);

    if (tier === "pinnacle") {
      return {
        tier,
        isPinnacle: true,
        qualifyingNights: nights,
        spendForYear: spend,
        separateStays: stays,
        closestPath: null,
        nextTier: null,
        thresholds: null,
      };
    }

    const nextTh = next ? THRESHOLDS[next as keyof typeof THRESHOLDS] : null;
    return {
      tier,
      isPinnacle: false,
      qualifyingNights: nights,
      spendForYear: spend,
      separateStays: stays,
      closestPath: nextTh ? closestPath(nights, spend, stays, next!) : null,
      nextTier: next,
      thresholds: nextTh,
    };
  },
});

// ─── Public mutation: apply / express interest ────────────────────────────────
// Replaces the old `apply`. Pinnacle stores an enquiry, no progress data.
export const applyOrExpress = mutation({
  args: {
    name:         v.string(),
    email:        v.string(),
    phone:        v.string(),
    tier:         v.string(),
    organisation: v.optional(v.string()),
    notes:        v.optional(v.string()),
    token:        v.optional(v.string()),   // if signed in, link to account
  },
  handler: async (ctx, args) => {
    let userId = undefined;
    if (args.token) {
      const session = await ctx.db
        .query("sessions")
        .withIndex("by_token", q => q.eq("token", args.token!))
        .first();
      if (session && session.expiresAt > Date.now()) {
        userId = session.userId;
      }
    }

    return await ctx.db.insert("memberships", {
      name:         args.name,
      email:        args.email,
      phone:        args.phone,
      tier:         args.tier,
      organisation: args.organisation,
      notes:        args.notes,
      status:       "pending",
      createdAt:    Date.now(),
      userId,
      windowStart:     Date.now(),
      qualifyingNights: 0,
      separateStays:   0,
      spendForYear:    0,
    });
  },
});

// ─── Backward-compat alias ────────────────────────────────────────────────────
export const apply = mutation({
  args: {
    name:         v.string(),
    email:        v.string(),
    phone:        v.string(),
    tier:         v.string(),
    organisation: v.optional(v.string()),
    notes:        v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memberships", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// ─── Staff: grant / update membership status ──────────────────────────────────
export const adminGrant = mutation({
  args: {
    staffPin:        v.string(),
    membershipId:    v.id("memberships"),
    newTier:         v.string(),
    newStatus:       v.string(),           // "active" | "declined" | "expired"
    approvedBy:      v.string(),
    qualifyingNights: v.optional(v.number()),
    separateStays:   v.optional(v.number()),
    spendForYear:    v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.staffPin !== "ELDORADO2026") {
      throw new Error("Unauthorised");
    }
    const patch: Record<string, unknown> = {
      tier:       args.newTier,
      status:     args.newStatus,
      approvedBy: args.approvedBy,
      approvedAt: Date.now(),
    };
    if (args.qualifyingNights !== undefined) patch.qualifyingNights = args.qualifyingNights;
    if (args.separateStays    !== undefined) patch.separateStays    = args.separateStays;
    if (args.spendForYear     !== undefined) patch.spendForYear     = args.spendForYear;

    await ctx.db.patch(args.membershipId, patch);
    return { ok: true };
  },
});

// ─── Staff: list all applications ─────────────────────────────────────────────
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memberships").order("desc").collect();
  },
});

// ─── Staff: update qualification progress fields only ─────────────────────────
export const updateQualification = mutation({
  args: {
    staffPin:         v.string(),
    membershipId:     v.id("memberships"),
    qualifyingNights: v.number(),
    separateStays:    v.number(),
    spendForYear:     v.number(),
    updatedBy:        v.string(),
  },
  handler: async (ctx, args) => {
    if (args.staffPin !== "ELDORADO2026") throw new Error("Unauthorised");
    await ctx.db.patch(args.membershipId, {
      qualifyingNights: args.qualifyingNights,
      separateStays:    args.separateStays,
      spendForYear:     args.spendForYear,
      approvedBy:       args.updatedBy,
      approvedAt:       Date.now(),
    });
    return { ok: true };
  },
});

// ─── Public: get count of active (approved) members ──────────────────────────
export const getApprovedCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("memberships")
      .withIndex("by_status", q => q.eq("status", "active"))
      .collect();
    return all.length;
  },
});
