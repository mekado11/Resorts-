import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Guest accounts
  guests: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    nationality: v.optional(v.string()),
    membershipTier: v.optional(v.string()), // "elite" | "commissioner" | "legacy" | "patrone"
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Room catalogue (seed data)
  rooms: defineTable({
    tier: v.number(),           // 1-6
    name: v.string(),           // "Comfort Room", "Deluxe Room" etc.
    pricePerNight: v.number(),  // in NGN
    capacity: v.number(),
    description: v.string(),
    amenities: v.string(),      // JSON array stored as string
    imageSlug: v.string(),      // maps to asset filename
    available: v.boolean(),
    totalUnits: v.number(),
  }),

  // Booking enquiries (pre-Paystack — collect interest, confirm manually)
  bookings: defineTable({
    guestId: v.optional(v.id("guests")),  // null for guest checkout
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    roomTier: v.number(),
    roomName: v.string(),
    checkIn: v.string(),    // ISO date string
    checkOut: v.string(),
    nights: v.number(),
    totalNGN: v.number(),
    status: v.string(),     // "pending" | "confirmed" | "cancelled"
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["guestEmail"])
    .index("by_status", ["status"])
    .index("by_room_tier", ["roomTier"]),

  // General enquiries (contact form, partnership, membership)
  enquiries: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    type: v.string(),       // "room" | "membership" | "partnership" | "wedding" | "general"
    status: v.string(),     // "new" | "read" | "replied"
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  // Membership applications
  memberships: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    tier: v.string(),       // "elite" | "commissioner" | "legacy" | "patrone"
    organisation: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.string(),     // "pending" | "approved" | "declined"
    createdAt: v.number(),
  }).index("by_tier", ["tier"])
    .index("by_status", ["status"]),
});
