import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name:    v.string(),
    email:   v.string(),
    phone:   v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    type:    v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("enquiries", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("enquiries").order("desc").collect();
  },
});
