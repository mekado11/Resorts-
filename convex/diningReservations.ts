import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("diningReservations", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
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
