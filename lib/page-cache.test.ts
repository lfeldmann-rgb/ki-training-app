// Copyright (c) 2026 Digistore24 Inc, St. Petersburg, USA
// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import {
  PAGE_CACHE_FILL_HEADER,
  pageCacheEnabled,
  pageCacheKey,
  storableHeaders,
  type PageCacheRequest,
} from "@/lib/page-cache";

function req(over: Partial<PageCacheRequest> = {}, headers: Record<string, string> = {}): PageCacheRequest {
  return {
    method: "GET",
    pathname: "/",
    search: "",
    headers: new Headers({ accept: "text/html,application/xhtml+xml", "accept-language": "de-DE,de;q=0.9", ...headers }),
    cookieNames: [],
    localeCookie: undefined,
    ...over,
  };
}

describe("pageCacheKey — which requests may get a shared copy", () => {
  it("caches a signed-out document request for / and /plans, keyed by locale", () => {
    expect(pageCacheKey(req())).toBe("/|de");
    expect(pageCacheKey(req({ pathname: "/plans" }))).toBe("/plans|de");
  });

  it("takes the locale cookie over the browser language, like i18n/locale.ts", () => {
    expect(pageCacheKey(req({ localeCookie: "fr" }))).toBe("/|fr");
    expect(pageCacheKey(req({ localeCookie: "xx" }))).toBe("/|de");
  });

  it("🚨 never shares a page with somebody who has a session — any session cookie, any name", () => {
    expect(pageCacheKey(req({ cookieNames: ["authjs.session-token"] }))).toBeNull();
    expect(pageCacheKey(req({ cookieNames: ["__Secure-authjs.session-token"] }))).toBeNull();
    expect(pageCacheKey(req({ cookieNames: ["authjs.session-token.1a2b3c4d.0"] }))).toBeNull();
  });

  it("renders every variant fresh: other paths, query strings, non-GET", () => {
    expect(pageCacheKey(req({ pathname: "/dashboard" }))).toBeNull();
    expect(pageCacheKey(req({ pathname: "/login" }))).toBeNull();
    expect(pageCacheKey(req({ search: "?preview=checkout" }))).toBeNull();
    expect(pageCacheKey(req({ method: "POST" }))).toBeNull();
    expect(pageCacheKey(req({ method: "HEAD" }))).toBeNull();
  });

  it("leaves client navigation and Server Actions alone", () => {
    for (const h of ["rsc", "next-action", "next-router-prefetch", "next-router-state-tree"]) {
      expect(pageCacheKey(req({}, { [h]: "1" })), h).toBeNull();
    }
    expect(pageCacheKey(req({}, { accept: "*/*" }))).toBeNull();
  });

  it("does not answer its own fill request from the cache", () => {
    expect(pageCacheKey(req({}, { [PAGE_CACHE_FILL_HEADER]: "1" }))).toBeNull();
  });
});

describe("storableHeaders — what a shared copy may carry", () => {
  it("🚨 drops Set-Cookie and the length/encoding of the original body", () => {
    const h = new Headers({ "content-type": "text/html; charset=utf-8", "content-length": "10", "content-encoding": "gzip" });
    h.append("set-cookie", "a=1");
    const kept = new Map(storableHeaders(h));
    expect(kept.get("content-type")).toBe("text/html; charset=utf-8");
    expect(kept.has("set-cookie")).toBe(false);
    expect(kept.has("content-length")).toBe(false);
    expect(kept.has("content-encoding")).toBe(false);
  });
});

describe("pageCacheEnabled", () => {
  it("is on in a production build and off in DEV, where checkout links carry the test-payment key", () => {
    expect(pageCacheEnabled({ NODE_ENV: "production" })).toBe(true);
    expect(pageCacheEnabled({ NODE_ENV: "development" })).toBe(false);
    expect(pageCacheEnabled({ NODE_ENV: "production", PAGE_CACHE: "off" })).toBe(false);
  });
});
