import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    listType: v.string(), // "waitlist" | "newsletter" | "both"
  },
  handler: async (ctx, args) => {
    // Check for duplicate email
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      // Upgrade to "both" if they previously signed up for just one
      if (existing.listType !== "both" && existing.listType !== args.listType) {
        await ctx.db.patch(existing._id, { listType: "both" });
      }
      return { success: true, duplicate: true };
    }

    await ctx.db.insert("subscribers", {
      name: args.name.trim(),
      email: args.email.toLowerCase().trim(),
      listType: args.listType,
      createdAt: Date.now(),
    });

    return { success: true, duplicate: false };
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});
