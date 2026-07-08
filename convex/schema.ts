import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Guest accounts
  guests: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    nationality: v.optional(v.string()),
    membershipTier: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Room catalogue (seed data)
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

  // Booking enquiries — now includes the Guest Arrival Profile
  bookings: defineTable({
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
    status: v.string(),     // "pending" | "confirmed" | "cancelled"

    // Guest Arrival Profile — 5 intentional fields
    occasion: v.optional(v.string()),         // What brings you to Eldorado?
    roomMood: v.optional(v.string()),         // How would you like your room to feel?
    arrivalWelcome: v.optional(v.string()),   // What should be waiting for you?
    welcomeStyle: v.optional(v.string()),     // How do you prefer to be welcomed?
    firstNightPriority: v.optional(v.string()), // What matters most for your first night?

    // Open field
    oneMoreThing: v.optional(v.string()),     // "One More Thing" free text

    // Operational — separate from preferences
    dietaryRequirements: v.optional(v.string()),
    accessibilityNeeds: v.optional(v.string()),

    // Prayer / faith
    prayerRoom: v.optional(v.string()),       // "No" | "Christian" | "Muslim" | "Other"

    // Legacy notes field (kept for backward compat)
    notes: v.optional(v.string()),

    createdAt: v.number(),
  })
    .index("by_email", ["guestEmail"])
    .index("by_status", ["status"])
    .index("by_room_tier", ["roomTier"]),

  // General enquiries
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

  // Newsletter & waiting list subscribers
  subscribers: defineTable({
    name: v.string(),
    email: v.string(),
    listType: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_list", ["listType"]),

  // Membership applications
  memberships: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    tier: v.string(),
    organisation: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_tier", ["tier"])
    .index("by_status", ["status"]),
});
