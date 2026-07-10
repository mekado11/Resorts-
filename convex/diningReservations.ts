import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { normalizeMemberId } from "./auth";

const MEMBER_ID_NOT_FOUND =
  "We couldn't find that Member ID. Please check it in your My Eldorado dashboard, or leave the field blank to continue as a guest.";

export const create = mutation({
  args: {
    guestName:  v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    diningType: v.string(),
    venueName:  v.string(),
    date:       v.string(),
    time:       v.string(),
    partySize:  v.number(),

    occasion:        v.optional(v.string()),
    specialRequests: v.optional(v.string()),

    // Optional member linkage for annual spend tracking. Validated against
    // eldoradoUsers; the linked userId is resolved here, never client-supplied.
    memberId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { memberId: rawMemberId, ...reservation } = args;

    let memberFields: { memberId: string; userId: Id<"eldoradoUsers"> } | undefined;

    if (rawMemberId && rawMemberId.trim() !== "") {
      const canonical = normalizeMemberId(rawMemberId);
      // The same message covers bad format and unknown ID, so responses don't
      // reveal which member numbers exist.
      if (!canonical) {
        return { success: false as const, error: MEMBER_ID_NOT_FOUND };
      }
      const member = await ctx.db
        .query("eldoradoUsers")
        .withIndex("by_member_id", q => q.eq("memberId", canonical))
        .first();
      if (!member) {
        return { success: false as const, error: MEMBER_ID_NOT_FOUND };
      }
      memberFields = { memberId: canonical, userId: member._id };
    }

    const id = await ctx.db.insert("diningReservations", {
      ...reservation,
      ...memberFields,
      status: "pending",
      createdAt: Date.now(),
    });
    return { success: true as const, id };
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("diningReservations")
      .order("desc")
      .collect();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("diningReservations")
      .withIndex("by_email", q => q.eq("guestEmail", args.email))
      .collect();
  },
});

export const updateStatus = mutation({
  args: { id: v.id("diningReservations"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Staff lookup: every dining reservation linked to a Member ID, newest first,
// with the running total of recorded bills. Bills are recorded per reservation
// via recordSpend below, which auto-credits the member's spendForYear.
export const getByMemberId = query({
  args: { memberId: v.string(), staffPin: v.string() },
  handler: async (ctx, args) => {
    if (args.staffPin !== "ELDORADO2026") {
      return { error: "Incorrect staff PIN." };
    }
    const canonical = normalizeMemberId(args.memberId);
    if (!canonical) {
      return { error: "Invalid member ID format. Use ELD-NNNNN, e.g. ELD-00142." };
    }
    const member = await ctx.db
      .query("eldoradoUsers")
      .withIndex("by_member_id", q => q.eq("memberId", canonical))
      .first();
    if (!member) {
      return { error: `No member found with ID ${canonical}.` };
    }
    const reservations = await ctx.db
      .query("diningReservations")
      .withIndex("by_member_id", q => q.eq("memberId", canonical))
      .collect();
    reservations.sort((a, b) => b.createdAt - a.createdAt);
    const totalDiningSpendNGN = reservations.reduce((sum, r) => sum + (r.spendNGN ?? 0), 0);
    return {
      member: {
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        memberId: canonical,
      },
      reservations,
      totalDiningSpendNGN,
    };
  },
});

// ─── Member-facing: my dining reservations ────────────────────────────────────
// Mirrors account.getMyBookings: match by linked userId OR by the account's
// email, so reservations made with the member's email but no Member ID still
// appear on their page.
export const getMyReservations = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) return [];
    const user = await ctx.db.get(session.userId);
    if (!user) return [];

    const byUser = await ctx.db
      .query("diningReservations")
      .withIndex("by_user", q => q.eq("userId", session.userId))
      .collect();
    const byEmail = await ctx.db
      .query("diningReservations")
      .withIndex("by_email", q => q.eq("guestEmail", user.email))
      .collect();

    const all = [...byUser];
    for (const r of byEmail) {
      if (!all.find(x => x._id === r._id)) all.push(r);
    }
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ─── Staff: record the final dinner bill ──────────────────────────────────────
// Stores the bill on the reservation, marks it completed, and delta-credits
// the member's ACTIVE membership spendForYear. Delta (subtract the previously
// recorded amount first) makes re-recording a corrected bill safe — the
// membership is never double-credited.
export const recordSpend = mutation({
  args: {
    staffPin: v.string(),
    id: v.id("diningReservations"),
    spendNGN: v.number(),
    recordedBy: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.staffPin !== "ELDORADO2026") throw new Error("Unauthorised");
    if (args.spendNGN < 0) {
      return { success: false as const, error: "Spend must be zero or more." };
    }

    const reservation = await ctx.db.get(args.id);
    if (!reservation) {
      return { success: false as const, error: "Reservation not found." };
    }

    const previousSpend = reservation.spendNGN ?? 0;
    await ctx.db.patch(args.id, { spendNGN: args.spendNGN, status: "completed" });

    let creditedToMembership = false;
    let newSpendForYear: number | undefined;

    if (reservation.userId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user", q => q.eq("userId", reservation.userId))
        .filter(q => q.eq(q.field("status"), "active"))
        .first();
      if (membership) {
        newSpendForYear = (membership.spendForYear ?? 0) - previousSpend + args.spendNGN;
        await ctx.db.patch(membership._id, {
          spendForYear: newSpendForYear,
          approvedBy: args.recordedBy,
          approvedAt: Date.now(),
        });
        creditedToMembership = true;
      }
    }

    return { success: true as const, creditedToMembership, newSpendForYear };
  },
});
