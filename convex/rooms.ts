import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});

export const getByTier = query({
  args: { tier: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("rooms")
      .filter(q => q.eq(q.field("tier"), args.tier))
      .first();
  },
});

// Seed rooms on first run
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("rooms").collect();
    if (existing.length > 0) return "already seeded";

    const roomData = [
      { tier: 1, name: "Comfort Room",        pricePerNight: 150000, capacity: 2, description: "Our entry suite sets a standard most hotels reserve for their finest offering. Intimate scale, extraordinary finish — key-card sensor lighting, bladeless climate fan, and premium Egyptian cotton linens.", amenities: JSON.stringify(["King Bed","En-suite Bathroom","LED Smart TV","Mini Bar","Key-card Sensor Lighting","Bladeless Fan","Gas Water Heater","City View"]), imageSlug: "room-comfort-new", available: true, totalUnits: 20 },
      { tier: 2, name: "Deluxe Room",         pricePerNight: 250000, capacity: 2, description: "Elevated above the standard in every dimension. Richer finishes, a larger footprint, and a workspace designed for the discerning traveller who refuses to compromise.", amenities: JSON.stringify(["King Bed","Rainfall Shower","Work Desk","Nespresso Machine","Smart Lighting","Bladeless Fan","Coastal View","Premium Minibar"]), imageSlug: "room-deluxe", available: true, totalUnits: 25 },
      { tier: 3, name: "Superior Room",       pricePerNight: 350000, capacity: 2, description: "Where space becomes a statement. The Superior Room commands a full coastal panorama through floor-to-ceiling glass, furnished in hand-selected West African hardwood and imported stone.", amenities: JSON.stringify(["King Bed","Deep Soaking Tub","Walk-in Shower","Private Balcony","Floor-to-Ceiling Windows","Butler Service","Coastal Panorama","Premium Bar"]), imageSlug: "room-superior", available: true, totalUnits: 20 },
      { tier: 4, name: "Executive Suite",     pricePerNight: 450000, capacity: 3, description: "A complete residence above the city. Separate living room, dedicated workspace, and master bedroom — all appointed with custom Ibibio-inspired furnishings and 24-hour butler service.", amenities: JSON.stringify(["Separate Living Room","Dedicated Workspace","Master Bedroom","24hr Butler","Dining for 4","Premium Sound System","Panoramic View","Airport Transfer"]), imageSlug: "room-governor", available: true, totalUnits: 15 },
      { tier: 5, name: "Grand Suite",         pricePerNight: 650000, capacity: 4, description: "Designed for those who define luxury on their own terms. The Grand Suite occupies a corner position with wraparound coastal views, private plunge pool access, and a personal sommelier on call.", amenities: JSON.stringify(["Corner Position","Wraparound Views","Plunge Pool Access","Personal Sommelier","Two Bedrooms","Full Kitchen","Private Dining","VIP Arrival"]), imageSlug: "room-governor", available: true, totalUnits: 8 },
      { tier: 6, name: "Eldorado Flagship Suite", pricePerNight: 900000, capacity: 6, description: "The singular standard of Eldorado — an entire private floor. Five rooms, a private rooftop terrace, dedicated concierge team, chef on request, and a level of privacy befitting heads of state.", amenities: JSON.stringify(["Private Floor","Rooftop Terrace","Dedicated Concierge Team","Private Chef on Request","Five Rooms","Helicopter Pad Access","Full Spa Access","State Protocol Service"]), imageSlug: "hero-suite", available: true, totalUnits: 2 },
    ];

    for (const room of roomData) {
      await ctx.db.insert("rooms", room);
    }
    return "seeded";
  },
});
