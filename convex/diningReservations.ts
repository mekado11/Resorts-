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

// Staff lookup for annual-spend reconciliation: every dining reservation
// linked to a Member ID, newest first. Spend itself is still entered manually
// into memberships.spendForYear via the Staff View — this is the source list.
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
    return {
      member: {
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        memberId: canonical,
      },
      reservations,
    };
  },
});
