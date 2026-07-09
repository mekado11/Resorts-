import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ─── Helper: resolve userId from token ───────────────────────────────────────

async function getUserIdFromToken(ctx: any, token: string): Promise<Id<"eldoradoUsers"> | null> {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();
  if (!session || session.expiresAt < Date.now()) return null;
  return session.userId;
}

// ─── Guest Profile ────────────────────────────────────────────────────────────

export const getProfile = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return null;
    return await ctx.db
      .query("guestProfiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
  },
});

// ─── Preferences ─────────────────────────────────────────────────────────────

export const getPreferences = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return [];
    return await ctx.db
      .query("guestPreferences")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
  },
});

export const upsertPreference = mutation({
  args: {
    token: v.string(),
    category: v.string(),
    preferenceType: v.string(),
    value: v.string(),
    persistent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false, error: "Session expired." };

    // Check if preference already exists
    const existing = await ctx.db
      .query("guestPreferences")
      .withIndex("by_user_category", q =>
        q.eq("userId", userId).eq("category", args.category)
      )
      .collect();

    const match = existing.find(p => p.preferenceType === args.preferenceType);

    if (match) {
      await ctx.db.patch(match._id, {
        value: args.value,
        persistent: args.persistent,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("guestPreferences", {
        userId,
        category: args.category,
        preferenceType: args.preferenceType,
        value: args.value,
        persistent: args.persistent,
        source: "guest_profile",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});

export const deletePreference = mutation({
  args: { token: v.string(), preferenceType: v.string(), category: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false };
    const existing = await ctx.db
      .query("guestPreferences")
      .withIndex("by_user_category", q =>
        q.eq("userId", userId).eq("category", args.category)
      )
      .collect();
    const match = existing.find(p => p.preferenceType === args.preferenceType);
    if (match) await ctx.db.delete(match._id);
    return { success: true };
  },
});

// ─── Saved Experiences ────────────────────────────────────────────────────────

export const getSavedExperiences = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return [];
    return await ctx.db
      .query("savedExperiences")
      .withIndex("by_user", q => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const saveExperience = mutation({
  args: {
    token: v.string(),
    experienceName: v.string(),
    experienceCategory: v.string(),
    experienceDesc: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false, error: "Please sign in to save experiences." };

    // Prevent duplicates
    const existing = await ctx.db
      .query("savedExperiences")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const dupe = existing.find(e => e.experienceName === args.experienceName);
    if (dupe) return { success: false, error: "already_saved" };

    await ctx.db.insert("savedExperiences", {
      userId,
      experienceName: args.experienceName,
      experienceCategory: args.experienceCategory,
      experienceDesc: args.experienceDesc,
      savedAt: Date.now(),
    });
    return { success: true };
  },
});

export const removeSavedExperience = mutation({
  args: { token: v.string(), experienceName: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false };
    const existing = await ctx.db
      .query("savedExperiences")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const match = existing.find(e => e.experienceName === args.experienceName);
    if (match) await ctx.db.delete(match._id);
    return { success: true };
  },
});

// ─── Occasions ────────────────────────────────────────────────────────────────

export const getOccasions = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return [];
    return await ctx.db
      .query("occasions")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
  },
});

export const addOccasion = mutation({
  args: {
    token: v.string(),
    occasionType: v.string(),
    occasionDate: v.string(),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false };
    await ctx.db.insert("occasions", {
      userId,
      occasionType: args.occasionType,
      occasionDate: args.occasionDate,
      label: args.label,
      createdAt: Date.now(),
    });
    return { success: true };
  },
});

export const deleteOccasion = mutation({
  args: { token: v.string(), occasionId: v.id("occasions") },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false };
    const occ = await ctx.db.get(args.occasionId);
    if (occ && occ.userId === userId) await ctx.db.delete(args.occasionId);
    return { success: true };
  },
});

// ─── Communication Preferences ────────────────────────────────────────────────

export const getCommPrefs = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return null;
    return await ctx.db
      .query("communicationPrefs")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
  },
});

export const updateCommPrefs = mutation({
  args: {
    token: v.string(),
    marketingEmail: v.boolean(),
    marketingSMS: v.boolean(),
    eventInvitations: v.boolean(),
    preferredStayContact: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false };
    const existing = await ctx.db
      .query("communicationPrefs")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        marketingEmail: args.marketingEmail,
        marketingSMS: args.marketingSMS,
        eventInvitations: args.eventInvitations,
        preferredStayContact: args.preferredStayContact,
        updatedAt: Date.now(),
      });
    }
    return { success: true };
  },
});

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const getMyBookings = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (!user) return [];
    // Get bookings by userId OR by email
    const byUser = await ctx.db
      .query("bookings")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();
    const byEmail = await ctx.db
      .query("bookings")
      .withIndex("by_email", q => q.eq("guestEmail", user.email))
      .collect();
    // Merge + deduplicate
    const all = [...byUser];
    for (const b of byEmail) {
      if (!all.find(x => x._id === b._id)) all.push(b);
    }
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const linkBooking = mutation({
  args: {
    token: v.string(),
    confirmationRef: v.string(),
    lastName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromToken(ctx, args.token);
    if (!userId) return { success: false, error: "Session expired." };

    // Find booking by email + name match
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_email", q => q.eq("guestEmail", args.email.toLowerCase()))
      .collect();

    const match = bookings.find(b =>
      b.guestName.toLowerCase().includes(args.lastName.toLowerCase())
    );

    if (!match) {
      return { success: false, error: "We could not find that stay. Please check your confirmation number and booking details." };
    }

    if (match.userId) {
      return { success: false, error: "This booking is already linked to an account." };
    }

    await ctx.db.patch(match._id, { userId });

    // Update guest profile stay count
    const profile = await ctx.db
      .query("guestProfiles")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    if (profile) {
      await ctx.db.patch(profile._id, {
        totalStayCount: profile.totalStayCount + 1,
        guestStatus: profile.totalStayCount >= 1 ? "returning" : "guest",
      });
    }

    return { success: true };
  },
});

// ─── Staff View ───────────────────────────────────────────────────────────────

export const getGuestForStaff = query({
  args: { searchEmail: v.string(), staffPin: v.string() },
  handler: async (ctx, args) => {
    // Simple PIN auth for staff — replace with proper role system in Phase Two
    if (args.staffPin !== "ELDORADO2026") return { error: "Incorrect staff PIN." };

    const user = await ctx.db
      .query("eldoradoUsers")
      .withIndex("by_email", q => q.eq("email", args.searchEmail.toLowerCase()))
      .first();
    if (!user) return { error: "No guest found with that email." };

    const profile = await ctx.db
      .query("guestProfiles")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .first();

    const preferences = await ctx.db
      .query("guestPreferences")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();

    const occasions = await ctx.db
      .query("occasions")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();

    const now = Date.now();
    const upcoming = bookings.filter(b => new Date(b.checkIn).getTime() > now);
    const past = bookings.filter(b => new Date(b.checkOut).getTime() < now);

    return {
      guest: {
        name: `${user.firstName} ${user.lastName}`,
        preferredName: user.preferredName,
        email: user.email,
        mobile: user.mobile,
      },
      profile,
      preferences: preferences.filter(p => p.persistent),
      upcomingBookings: upcoming,
      pastBookings: past,
      occasions,
    };
  },
});
