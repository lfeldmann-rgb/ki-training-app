// The course's lesson covers, for a page that shows them OUTSIDE the course —
// the salespage. They are product imagery (`visibility: "public"` in
// content/media-manifest.json), found by their deterministic storage key,
// never by a media id (docs/content.md → Media).
//
// 🚨 `mayAccess()` before `mediaUrlFor()`, in this function — CLAUDE.md →
// Media. A cover somebody re-declared as `entitled` simply drops out here
// rather than leaking onto the public page.
import { inArray } from "drizzle-orm";

import { db } from "@/db";
import { media } from "@/db/schema";
import { mayAccess } from "@/lib/media/manage";
import { mediaUrlFor } from "@/lib/media/url";

/** The covers' path in the manifest is `ki-praxis/<lesson slug>.webp`. */
const coverKey = (slug: string) => `content/ki-praxis/${slug}.webp`;

/** Lesson slug → cover address and alt text, for the lessons that have one. */
export async function publicCovers(
  slugs: readonly string[],
): Promise<Map<string, { src: string; alt: string }>> {
  const covers = new Map<string, { src: string; alt: string }>();
  if (slugs.length === 0) return covers;
  const rows = await db.select().from(media).where(inArray(media.storageKey, slugs.map(coverKey)));
  for (const slug of slugs) {
    const row = rows.find((r) => r.storageKey === coverKey(slug));
    if (!row || !row.alt) continue;
    if (!(await mayAccess(row, { memberId: null, role: null }))) continue;
    covers.set(slug, { src: mediaUrlFor(row), alt: row.alt });
  }
  return covers;
}
