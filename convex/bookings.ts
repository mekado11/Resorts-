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

    // Guest Arrival Profile
    occasion:             v.optional(v.string()),
    roomMood:             v.optional(v.string()),
    arrivalWelcome:       v.optional(v.string()),
    welcomeStyle:         v.optional(v.string()),
    firstNightPriority:   v.optional(v.string()),
    oneMoreThing:         v.optional(v.string()),

    // Operational
    dietaryRequirements:  v.optional(v.string()),
    accessibilityNeeds:   v.optional(v.string()),
    prayerRoom:           v.optional(v.string()),

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
