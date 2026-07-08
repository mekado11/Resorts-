import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memberships").order("desc").collect();
  },
});
