/* eslint-disable */
/**
 * Generated `api` utility.
 */
import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as bookings from "../bookings.js";
import type * as enquiries from "../enquiries.js";
import type * as memberships from "../memberships.js";
import type * as rooms from "../rooms.js";

type Mounts = {
  bookings: typeof bookings;
  enquiries: typeof enquiries;
  memberships: typeof memberships;
  rooms: typeof rooms;
};

export type API = ApiFromModules<Mounts>;
export declare const api: FilterApi<typeof anyApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof anyApi, FunctionReference<any, "internal">>;
declare const anyApi: API;
