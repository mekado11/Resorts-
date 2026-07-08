import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    guestName:  v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    roomTier:   v.number(),
    roomName:   v.string(),
    checkIn:    v.string(),
    checkOut:   v.string(),
    nights:     v.number(),
    totalNGN:   v.number(),
    notes:      v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookings")
      .order("desc")
      .collect();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("bookings")
      .withIndex("by_email", q => q.eq("guestEmail", args.email))
      .collect();
  },
});

export const updateStatus = mutation({
  args: { id: v.id("bookings"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
