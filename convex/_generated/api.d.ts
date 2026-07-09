/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as account from "../account.js";
import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as enquiries from "../enquiries.js";
import type * as memberships from "../memberships.js";
import type * as rooms from "../rooms.js";
import type * as subscribers from "../subscribers.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  account: typeof account;
  auth: typeof auth;
  bookings: typeof bookings;
  enquiries: typeof enquiries;
  memberships: typeof memberships;
  rooms: typeof rooms;
  subscribers: typeof subscribers;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
