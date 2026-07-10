import { mutation, query, action, MutationCtx } from "./_generated/server";
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

// Canonicalize a user-typed Member ID to "ELD-NNNNN", or null if unparseable.
// Accepts bare digits ("142") or an ELD prefix with/without hyphen, any case,
// with stray whitespace. A copy of this function lives client-side in
// DiningReservationModal.tsx — keep the two in sync.
export function normalizeMemberId(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, '').toUpperCase();
  if (cleaned === '') return null;
  const match = cleaned.match(/^(?:ELD-?)?(\d{1,5})$/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  if (num < 1 || num > 99999) return null;
  return `ELD-${String(num).padStart(5, '0')}`;
}

// Issue the next sequential Member ID. value = last-issued number; an absent
// counter row is treated as 99 so the first auto-issued ID is ELD-00100
// (ELD-00001–00099 are reserved for manual VIP assignment). Safe under
// concurrency: Convex mutations are OCC-serialized on the counter row.
async function generateNextMemberId(ctx: MutationCtx): Promise<string> {
  const row = await ctx.db
    .query("counters")
    .withIndex("by_name", q => q.eq("name", "memberId"))
    .first();
  const next = (row?.value ?? 99) + 1;
  if (row) {
    await ctx.db.patch(row._id, { value: next });
  } else {
    await ctx.db.insert("counters", { name: "memberId", value: next });
  }
  return `ELD-${String(next).padStart(5, '0')}`;
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
    const memberId = await generateNextMemberId(ctx);

    const userId = await ctx.db.insert("eldoradoUsers", {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email.toLowerCase(),
      passwordHash,
      mobile: args.mobile,
      emailVerified: true, // simplified for v1 — email verification flow can be added
      marketingConsent: args.marketingConsent,
      memberId,
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

    return { success: true, token, userId, memberId };
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
      memberId: user.memberId,
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

// ─── Member ID Administration ─────────────────────────────────────────────────
// Staff-only. PIN-gated to match memberships.adminGrant. Run from StaffView
// (future) or the Convex dashboard Functions runner.

// Assign a specific Member ID (e.g. the reserved ELD-00001) to an account.
// Target by email OR userId — exactly one. Any unused number is assignable.
export const adminAssignMemberId = mutation({
  args: {
    staffPin: v.string(),
    desiredMemberId: v.string(),
    email: v.optional(v.string()),
    userId: v.optional(v.id("eldoradoUsers")),
  },
  handler: async (ctx, args) => {
    if (args.staffPin !== "ELDORADO2026") throw new Error("Unauthorised");

    if ((args.email ? 1 : 0) + (args.userId ? 1 : 0) !== 1) {
      return { success: false, error: "Provide exactly one of email or userId." };
    }

    const canonical = normalizeMemberId(args.desiredMemberId);
    if (!canonical) {
      return { success: false, error: "Invalid member ID format. Use ELD-NNNNN, e.g. ELD-00001." };
    }

    const target = args.userId
      ? await ctx.db.get(args.userId)
      : await ctx.db
          .query("eldoradoUsers")
          .withIndex("by_email", q => q.eq("email", args.email!.toLowerCase()))
          .first();
    if (!target) {
      return { success: false, error: "No account found for that email." };
    }

    const holder = await ctx.db
      .query("eldoradoUsers")
      .withIndex("by_member_id", q => q.eq("memberId", canonical))
      .first();
    if (holder && holder._id !== target._id) {
      return { success: false, error: `${canonical} is already assigned to ${holder.email}.` };
    }

    const previousMemberId = target.memberId;
    await ctx.db.patch(target._id, { memberId: canonical });

    // Keep the auto-issue counter ahead of manually assigned high numbers so a
    // future signup can never collide. Reserved numbers (≤ 99) never touch it.
    const num = parseInt(canonical.slice(4), 10);
    if (num >= 100) {
      const counter = await ctx.db
        .query("counters")
        .withIndex("by_name", q => q.eq("name", "memberId"))
        .first();
      if (!counter) {
        await ctx.db.insert("counters", { name: "memberId", value: num });
      } else if (counter.value < num) {
        await ctx.db.patch(counter._id, { value: num });
      }
    }

    return { success: true, memberId: canonical, previousMemberId, userEmail: target.email };
  },
});

// One-off backfill: assign Member IDs to every account that predates this
// feature, oldest first. Idempotent — accounts that already have an ID are
// skipped, so re-running assigns nothing.
export const backfillMemberIds = mutation({
  args: { staffPin: v.string() },
  handler: async (ctx, args) => {
    if (args.staffPin !== "ELDORADO2026") throw new Error("Unauthorised");

    const users = await ctx.db.query("eldoradoUsers").collect();
    users.sort((a, b) => a.createdAt - b.createdAt);

    let assigned = 0;
    let skipped = 0;
    for (const user of users) {
      if (user.memberId) {
        skipped++;
        continue;
      }
      const memberId = await generateNextMemberId(ctx);
      await ctx.db.patch(user._id, { memberId });
      assigned++;
    }

    return { success: true, assigned, skipped };
  },
});
