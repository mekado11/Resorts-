import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Authentication ────────────────────────────────────────────────────────

  eldoradoUsers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    preferredName: v.optional(v.string()),
    email: v.string(),
    passwordHash: v.string(),
    mobile: v.optional(v.string()),
    country: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    emailVerified: v.boolean(),
    marketingConsent: v.boolean(),
    // Human-facing member number, "ELD-NNNNN". Optional: rows created before
    // the backfill ran don't have one yet. ELD-00001–00099 are reserved for
    // manual VIP assignment; auto-assignment starts at ELD-00100.
    memberId: v.optional(v.string()),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_member_id", ["memberId"]),

  sessions: defineTable({
    userId: v.id("eldoradoUsers"),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  passwordResets: defineTable({
    userId: v.id("eldoradoUsers"),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
  })
    .index("by_token", ["token"]),

  // ─── Guest Profile ─────────────────────────────────────────────────────────

  guestProfiles: defineTable({
    userId: v.id("eldoradoUsers"),
    guestStatus: v.string(),       // "guest" | "returning" | "member"
    totalStayCount: v.number(),
    firstStayDate: v.optional(v.string()),
    lastStayDate: v.optional(v.string()),
    favouriteRoomCategory: v.optional(v.string()),
  })
    .index("by_user", ["userId"]),

  // ─── Preferences ──────────────────────────────────────────────────────────

  guestPreferences: defineTable({
    userId: v.id("eldoradoUsers"),
    category: v.string(),          // "room" | "food" | "arrival" | "travelStyle" | "communication"
    preferenceType: v.string(),    // e.g. "pillowPreference", "morningDrink"
    value: v.string(),             // JSON string for multi-select, plain string for single
    persistent: v.boolean(),       // true = remember across stays, false = this stay only
    source: v.string(),            // "guest_profile" | "during_booking" | "staff_confirmed"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "category"]),

  // ─── Occasions ────────────────────────────────────────────────────────────

  occasions: defineTable({
    userId: v.id("eldoradoUsers"),
    occasionType: v.string(),      // "birthday" | "anniversary" | "other"
    occasionDate: v.string(),      // MM-DD format
    label: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // ─── Saved Experiences ────────────────────────────────────────────────────

  savedExperiences: defineTable({
    userId: v.id("eldoradoUsers"),
    experienceName: v.string(),
    experienceCategory: v.string(),
    experienceDesc: v.optional(v.string()),
    savedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // ─── Communication Preferences ────────────────────────────────────────────

  communicationPrefs: defineTable({
    userId: v.id("eldoradoUsers"),
    serviceEmail: v.boolean(),
    marketingEmail: v.boolean(),
    marketingSMS: v.boolean(),
    eventInvitations: v.boolean(),
    preferredStayContact: v.string(), // "whatsapp" | "sms" | "email" | "phone" | "none"
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  // ─── Bookings (updated to support account linking) ─────────────────────────

  bookings: defineTable({
    userId: v.optional(v.id("eldoradoUsers")),   // linked account (optional)
    guestId: v.optional(v.id("guests")),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    roomTier: v.number(),
    roomName: v.string(),
    checkIn: v.string(),
    checkOut: v.string(),
    nights: v.number(),
    totalNGN: v.number(),
    status: v.string(),

    // Membership credit tracking
    bookingSource: v.optional(v.string()),      // "direct" | "third_party"
    eligibleSpendNGN: v.optional(v.number()),   // spend credited toward membership (post-source rules)
    courtesyNight: v.optional(v.boolean()),     // true = 3rd-party courtesy night (counts as 1 qualifying night)

    // Guest Arrival Profile
    occasion: v.optional(v.string()),
    roomMood: v.optional(v.string()),
    arrivalWelcome: v.optional(v.string()),
    welcomeStyle: v.optional(v.string()),
    firstNightPriority: v.optional(v.string()),
    oneMoreThing: v.optional(v.string()),

    // Operational
    dietaryRequirements: v.optional(v.string()),
    accessibilityNeeds: v.optional(v.string()),
    prayerRoom: v.optional(v.string()),
    notes: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_email", ["guestEmail"])
    .index("by_status", ["status"])
    .index("by_room_tier", ["roomTier"])
    .index("by_user", ["userId"]),

  // ─── Dining Reservations ─────────────────────────────────────────────────

  diningReservations: defineTable({
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    diningType: v.string(),      // "casual" | "fine" | "tea"
    venueName: v.string(),       // "The Table" | "Oro Lounge & Gaffer's Grill" | "Tea at Eldorado"
    date: v.string(),            // ISO yyyy-mm-dd
    time: v.string(),            // 24h value, e.g. "19:30"
    partySize: v.number(),       // 1–10 (parties larger than 10 route through enquiries)
    occasion: v.optional(v.string()),
    specialRequests: v.optional(v.string()),
    // Member linkage for annual spend tracking. memberId is the canonical
    // "ELD-NNNNN" string validated at creation; userId is resolved server-side
    // from that lookup — never accepted from the client.
    memberId: v.optional(v.string()),
    userId: v.optional(v.id("eldoradoUsers")),
    // Final bill (NGN) recorded by staff after the dinner; absent until then.
    // Recording it also delta-credits the member's active membership
    // spendForYear (see diningReservations.recordSpend).
    spendNGN: v.optional(v.number()),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["guestEmail"])
    .index("by_status", ["status"])
    .index("by_date", ["date"])
    .index("by_member_id", ["memberId"])
    .index("by_user", ["userId"]),

  // ─── Legacy tables (kept for backward compat) ─────────────────────────────

  guests: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    nationality: v.optional(v.string()),
    membershipTier: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  rooms: defineTable({
    tier: v.number(),
    name: v.string(),
    pricePerNight: v.number(),
    capacity: v.number(),
    description: v.string(),
    amenities: v.string(),
    imageSlug: v.string(),
    available: v.boolean(),
    totalUnits: v.number(),
  }),

  enquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    type: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  subscribers: defineTable({
    name: v.string(),
    email: v.string(),
    listType: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_list", ["listType"]),

  memberships: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    tier: v.string(),                             // "member" | "reserve" | "estate" | "pinnacle"
    organisation: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.string(),                           // "pending" | "active" | "declined" | "expired"
    createdAt: v.number(),

    // Linked account
    userId: v.optional(v.id("eldoradoUsers")),

    // Rolling qualification window (12 months for Member/Reserve/Estate; 24 for Pinnacle)
    windowStart: v.optional(v.number()),          // timestamp of rolling window start
    qualifyingNights: v.optional(v.number()),     // nights credited in current window
    separateStays: v.optional(v.number()),        // distinct stay count in current window
    spendForYear: v.optional(v.number()),         // eligible spend (NGN) in current window

    // Staff approval
    approvedBy: v.optional(v.string()),           // staff name or ID
    approvedAt: v.optional(v.number()),           // timestamp
  })
    .index("by_tier", ["tier"])
    .index("by_status", ["status"])
    .index("by_email", ["email"])
    .index("by_user", ["userId"]),

  // ─── Counters (sequential ID issuance) ─────────────────────────────────────
  // Convex has no auto-increment; mutations are OCC-serialized, so a
  // read-increment-write on a single row is race-safe. For "memberId":
  // value = last-issued number; an absent row is treated as 99, so the
  // first auto-issued Member ID is ELD-00100 (1–99 reserved for VIPs).

  counters: defineTable({
    name: v.string(),
    value: v.number(),
  }).index("by_name", ["name"]),
});
