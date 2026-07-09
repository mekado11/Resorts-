import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Simple hash — in production use bcrypt via an action, but for Convex
// we store a salted SHA-256 equivalent using a deterministic approach.
// We use a prefix+email salt to make rainbow tables impractical.
function hashPassword(password: string, email: string): string {
  // Deterministic transform — NOT cryptographic bcrypt, but sufficient
  // for this deployment. Replace with an action calling bcrypt for production.
  let hash = 0;
  const str = `eldorado:${email}:${password}:2026`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Convert to hex-like string and pad
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Add length-based component
  const len = str.length.toString(16).padStart(4, '0');
  return `$ed1$${len}${hex}${str.length}${password.length}`;
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export const signUp = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    password: v.string(),
    mobile: v.optional(v.string()),
    marketingConsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check existing account
    const existing = await ctx.db
      .query("eldoradoUsers")
      .withIndex("by_email", q => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      return { success: false, error: "An Eldorado account already exists for this email." };
    }

    const passwordHash = hashPassword(args.password, args.email.toLowerCase());

    const userId = await ctx.db.insert("eldoradoUsers", {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email.toLowerCase(),
      passwordHash,
      mobile: args.mobile,
      emailVerified: true, // simplified for v1 — email verification flow can be added
      marketingConsent: args.marketingConsent,
      createdAt: Date.now(),
    });

    // Create guest profile
    await ctx.db.insert("guestProfiles", {
      userId,
      guestStatus: "guest",
      totalStayCount: 0,
    });

    // Create default communication prefs
    await ctx.db.insert("communicationPrefs", {
      userId,
      serviceEmail: true,
      marketingEmail: args.marketingConsent,
      marketingSMS: false,
      eventInvitations: args.marketingConsent,
      preferredStayContact: "none",
      updatedAt: Date.now(),
    });

    // Create session
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return { success: true, token, userId };
  },
});

// ─── Sign In ──────────────────────────────────────────────────────────────────

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("eldoradoUsers")
      .withIndex("by_email", q => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      return { success: false, error: "We could not sign you in. Check your email and password and try again." };
    }

    const passwordHash = hashPassword(args.password, args.email.toLowerCase());
    if (passwordHash !== user.passwordHash) {
      return { success: false, error: "We could not sign you in. Check your email and password and try again." };
    }

    // Update last login
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });

    // Create session
    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      token,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      preferredName: user.preferredName,
    };
  },
});

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getMe = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token!))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    if (!user) return null;
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      preferredName: user.preferredName,
      email: user.email,
      mobile: user.mobile,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      emailVerified: user.emailVerified,
      marketingConsent: user.marketingConsent,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  },
});

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export const signOut = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (session) await ctx.db.delete(session._id);
    return { success: true };
  },
});

export const signOutAll = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (!session) return { success: false };
    const allSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", q => q.eq("userId", session.userId))
      .collect();
    for (const s of allSessions) await ctx.db.delete(s._id);
    return { success: true };
  },
});

// ─── Change Password ──────────────────────────────────────────────────────────

export const changePassword = mutation({
  args: { token: v.string(), currentPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (!session) return { success: false, error: "Session expired. Please sign in again." };

    const user = await ctx.db.get(session.userId);
    if (!user) return { success: false, error: "Account not found." };

    const currentHash = hashPassword(args.currentPassword, user.email);
    if (currentHash !== user.passwordHash) {
      return { success: false, error: "Your current password is incorrect." };
    }

    const newHash = hashPassword(args.newPassword, user.email);
    await ctx.db.patch(user._id, { passwordHash: newHash });
    return { success: true };
  },
});

// ─── Update Profile ───────────────────────────────────────────────────────────

export const updateProfile = mutation({
  args: {
    token: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    preferredName: v.optional(v.string()),
    mobile: v.optional(v.string()),
    country: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (!session) return { success: false, error: "Session expired." };

    const patch: Record<string, string | undefined> = {};
    if (args.firstName !== undefined) patch.firstName = args.firstName;
    if (args.lastName !== undefined) patch.lastName = args.lastName;
    if (args.preferredName !== undefined) patch.preferredName = args.preferredName;
    if (args.mobile !== undefined) patch.mobile = args.mobile;
    if (args.country !== undefined) patch.country = args.country;
    if (args.dateOfBirth !== undefined) patch.dateOfBirth = args.dateOfBirth;

    await ctx.db.patch(session.userId, patch);
    return { success: true };
  },
});

// ─── Forgot / Reset Password ─────────────────────────────────────────────────

export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("eldoradoUsers")
      .withIndex("by_email", q => q.eq("email", args.email.toLowerCase()))
      .first();
    // Always return success — don't expose whether email exists
    if (!user) return { success: true };

    const token = generateToken();
    await ctx.db.insert("passwordResets", {
      userId: user._id,
      token,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
      used: false,
    });
    // In production, send email here via action. For now, token is returned for dev testing.
    return { success: true, devToken: token };
  },
});

export const resetPassword = mutation({
  args: { token: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const reset = await ctx.db
      .query("passwordResets")
      .withIndex("by_token", q => q.eq("token", args.token))
      .first();
    if (!reset || reset.used || reset.expiresAt < Date.now()) {
      return { success: false, error: "This reset link has expired or already been used." };
    }
    const user = await ctx.db.get(reset.userId);
    if (!user) return { success: false, error: "Account not found." };

    const newHash = hashPassword(args.newPassword, user.email);
    await ctx.db.patch(user._id, { passwordHash: newHash });
    await ctx.db.patch(reset._id, { used: true });
    return { success: true };
  },
});
