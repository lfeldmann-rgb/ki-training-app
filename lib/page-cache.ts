// Copyright (c) 2026 Digistore24 Inc, St. Petersburg, USA
// SPDX-License-Identifier: MIT

// A short-lived copy of the two public pages a launch crowd lands on.
//
// Why it exists: measured 2026-10-30/31, a page costs ~50 ms of framework
// render time, and the Render Starter instance (0.5 CPU) therefore tops out at
// ~12 pages a second — a launch mail that sends 100 people at once queued them
// for seconds and timed a third of the home pages out
// (docs/reports/performance-2026-10-30.md). `/` and `/plans` are the same
// document for every signed-out visitor of one language, so rendering them
// once a minute instead of once per visitor removes the queue where it forms.
//
// Why here and not as a static route: the root layout reads the locale from
// a cookie or Accept-Language (`i18n/locale.ts`), which makes EVERY page
// dynamic; making these two static would mean rebuilding how the whole app
// picks its language. The proxy already runs for both paths
// (`proxy.ts` → matcher), so it can answer from a copy without the app's
// rendering changing at all.
//
// ⚠️ What it must never do, and how each is held:
//   - serve one visitor's page to another: only requests with NO session
//     cookie are cached, the stored copy carries NO Set-Cookie, and the key
//     holds the locale — the only other input these pages read;
//   - cache a variant: any query string, any non-GET, any client-side
//     navigation (RSC) or Server Action request goes straight through;
//   - run in DEV: off unless NODE_ENV is production, because a DEV checkout
//     link carries the test-payment key (lib/digistore/testpay.ts), which is
//     never set in a production build.
// In memory and per process, like lib/rate-limit.ts: a second instance keeps
// its own copy, which is correct, only less effective.

import { LOCALE_COOKIE, isLocale, matchLocale, type Locale } from "@/i18n/config";

export const PAGE_CACHE_PATHS: ReadonlySet<string> = new Set(["/", "/plans"]);
/** How long a copy is served. A text or price change shows up after at most this. */
export const PAGE_CACHE_TTL_MS = 60_000;
/** Marks the proxy's own request that renders a fresh copy, so it is not answered from the cache. */
export const PAGE_CACHE_FILL_HEADER = "x-page-cache-fill";

export interface PageCacheRequest {
  method: string;
  pathname: string;
  search: string;
  headers: Headers;
  cookieNames: readonly string[];
  localeCookie: string | undefined;
}

/** Whether the cache is switched on in this process: production builds only, `PAGE_CACHE=off` disables it. */
export function pageCacheEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === "production" && env.PAGE_CACHE !== "off";
}

/** The locale these pages will render in — the same order as i18n/locale.ts. */
export function cacheLocale(req: Pick<PageCacheRequest, "headers" | "localeCookie">): Locale {
  return isLocale(req.localeCookie) ? req.localeCookie : matchLocale(req.headers.get("accept-language"));
}

/** The cache key for a request that may be answered from a copy, or null when it must be rendered. */
export function pageCacheKey(req: PageCacheRequest): string | null {
  if (req.method !== "GET") return null;
  if (!PAGE_CACHE_PATHS.has(req.pathname)) return null;
  if (req.search) return null;
  if (req.cookieNames.some((name) => name.includes("session-token"))) return null;
  const h = req.headers;
  if (h.has(PAGE_CACHE_FILL_HEADER)) return null;
  if (h.has("rsc") || h.has("next-action") || h.has("next-router-prefetch") || h.has("next-router-state-tree")) {
    return null;
  }
  if (!(h.get("accept") ?? "").includes("text/html")) return null;
  return `${req.pathname}|${cacheLocale(req)}`;
}

/** The headers a stored copy keeps: never a Set-Cookie, never a length that the body no longer matches. */
export function storableHeaders(headers: Headers): [string, string][] {
  const out: [string, string][] = [];
  headers.forEach((value, name) => {
    const n = name.toLowerCase();
    if (n === "set-cookie" || n === "content-length" || n === "content-encoding" || n === "transfer-encoding" || n === "connection") return;
    out.push([name, value]);
  });
  return out;
}

interface Entry {
  body: string;
  headers: [string, string][];
  expiresAt: number;
}

const entries = new Map<string, Entry>();
const filling = new Map<string, Promise<Entry | null>>();

async function fill(key: string, pathname: string, locale: Locale): Promise<Entry | null> {
  const origin = `http://127.0.0.1:${process.env.PORT ?? "3000"}`;
  const res = await fetch(origin + pathname, {
    headers: { accept: "text/html", cookie: `${LOCALE_COOKIE}=${locale}`, [PAGE_CACHE_FILL_HEADER]: "1" },
    redirect: "manual",
  });
  if (res.status !== 200 || !(res.headers.get("content-type") ?? "").includes("text/html")) {
    console.error(`[page-cache] filling ${key} got ${res.status} ${res.headers.get("content-type")} — not stored`);
    return null;
  }
  const entry = { body: await res.text(), headers: storableHeaders(res.headers), expiresAt: Date.now() + PAGE_CACHE_TTL_MS };
  entries.set(key, entry);
  return entry;
}

/**
 * The copy for this request, filled once when it is missing or stale. Null
 * means "render it the normal way" — also when filling failed, so a broken
 * fill never becomes a broken page.
 */
export async function cachedPage(req: PageCacheRequest): Promise<Response | null> {
  if (!pageCacheEnabled()) return null;
  const key = pageCacheKey(req);
  if (!key) return null;

  let entry = entries.get(key);
  let state = "HIT";
  if (!entry || entry.expiresAt <= Date.now()) {
    state = "MISS";
    let pending = filling.get(key);
    if (!pending) {
      pending = fill(key, req.pathname, cacheLocale(req))
        .catch((error: unknown) => {
          console.error(`[page-cache] filling ${key} failed — serving a fresh render instead:`, error);
          return null;
        })
        .finally(() => filling.delete(key));
      filling.set(key, pending);
    }
    entry = (await pending) ?? undefined;
  }
  if (!entry) return null;

  const headers = new Headers(entry.headers);
  headers.set("x-page-cache", state);
  return new Response(entry.body, { status: 200, headers });
}
