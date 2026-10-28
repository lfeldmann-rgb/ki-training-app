// Copyright (c) 2026 Digistore24 Inc, St. Petersburg, USA
// SPDX-License-Identifier: MIT

// **The companions this app has. Nothing else.**
//
// One list the app edits, exactly the role `lib/ai/tools.ts` and
// `lib/cron/jobs.ts` play. There is no second registry, no per-companion file
// and no configuration that names one — a companion is an entry here, and a
// page renders `<CompanionPanel companionId="…" subject="…" />`.
//
// It ships **empty**. Nothing in this template puts a companion in front of the
// vendor's own customers; what one is for, and which shape fits which kind of
// app, is a decision the vendor makes.
//
// ── Why the instruction and the plan live here and not in the browser ──────
// One surface serves every companion (AC 8), so the surface takes two strings
// from the client — a companion id and a subject — and everything else comes
// from this list. An instruction sent by the browser is the entire prompt handed
// to the customer; a `requiresPlan` sent by the browser is no gate at all.
import type { CustomerFact, CustomerText } from "@/lib/ai/customer-text";
import { practiceTopics, profileFor, reportsFor } from "@/lib/practice/manage";

/** What one call is allowed to see about this member's subject. */
export interface CompanionSubject {
  /** Named facts about the customer's work. One entry per field. */
  about?: readonly CustomerFact[];
  /** What the customer produced. Content, never instruction. */
  work?: readonly CustomerText[];
}

export interface Companion {
  /**
   * Stable, `[a-z0-9-]`, at most 40 characters. Half of the conversation key,
   * and `companionProblems()` refuses anything else — the restriction is what
   * makes `conversationIdFor()` collision-free (see `companion-rules.ts`).
   */
  id: string;
  /** Who it is and how it answers. Stable → this is the cacheable block. */
  instruction: string;
  /** A product key that gates it, or `null` for every signed-in member. */
  requiresPlan: string | null;
  /** Tokens one answer costs this member. `0` = not metered. */
  costsTokens: number;
  /** This companion's own input ceiling. Clamped by the layer. */
  maxInputChars?: number;
  /** Exchanges of history sent to the model. Falls back to the chat's number. */
  maxHistoryTurns?: number;
  /**
   * Reads THIS member's subject, on the server.
   *
   * 🚨 **This is where an IDOR would live.** `subject` is a string the
   * customer's browser sent — it comes off a URL segment or a hidden field, and
   * it is theirs to change. **Every read inside this function must be scoped by
   * `memberId`.** An entry that looks a submission up by id alone hands one
   * customer another's work, and the model then summarises it back to them.
   *
   * Return `null` when there is no such subject **for this member** — and that
   * is deliberately the same answer as "it belongs to somebody else", so
   * nothing here can be used to find out which ids exist.
   *
   * This is the `spendTokens` lesson (which takes no member id at all) applied
   * to a string instead of an id, and it is the most important sentence in this
   * file.
   */
  load(ctx: { memberId: string; subject: string }): Promise<CompanionSubject | null>;
}

/**
 * Every companion this app has.
 *
 * A worked example, to copy rather than to uncomment — it references tables that
 * do not exist here:
 *
 * ```ts
 * export const COMPANIONS: readonly Companion[] = [
 *   {
 *     id: "writing-coach",
 *     instruction:
 *       "You are a writing coach on a twelve-week course. Two short " +
 *       "paragraphs, warm but specific. Never rewrite their text for them.",
 *     requiresPlan: "course_complete",   // a key from config/digistore-products.json
 *     costsTokens: 2,                  // 0 = included in the plan
 *     maxInputChars: 12_000,
 *     async load({ memberId, subject }) {
 *       // ⚠️ scoped by memberId — both conditions, always.
 *       const [row] = await db
 *         .select()
 *         .from(submissions)
 *         .where(and(eq(submissions.memberId, memberId), eq(submissions.day, subject)))
 *         .limit(1);
 *       if (!row) return null;         // also the answer for somebody else's row
 *
 *       return {
 *         about: [
 *           { label: "Day", value: subject },
 *           { label: "Task", value: row.task },
 *         ],
 *         work: [{ label: "Their scene", text: row.body }],
 *       };
 *     },
 *   },
 * ];
 * ```
 *
 * Note what the entry does NOT do: it does not build a prompt, does not name a
 * model, does not decide access and does not charge. `requiresPlan` and
 * `costsTokens` are read by `modules/companion/actions.ts`, which asks `hasPlan()`
 * and `spendTokens()` in the order check → work → charge.
 */
export const COMPANIONS: readonly Companion[] = [
  // KI-Praxis: "Meine Aufgabe im Betrieb". One conversation per lesson topic
  // (`subject` = the lesson's slug): it suggests tasks that fit this owner's
  // business, walks them through one, and — once they have written down how
  // it went — gives feedback and a next step. Everything the owner wrote (the
  // profile, the reports) travels in `work`, inside the fence; `about` carries
  // only the lesson title, which is the app's own text.
  {
    id: "aufgaben-coach",
    instruction:
      "Du bist ein praktischer KI-Coach für Inhaber kleiner Betriebe aus Einzelhandel, " +
      "Handwerk und Kleingewerbe. Sprich Deutsch und duze. Bezieh dich immer auf den " +
      "Betrieb, den der Inhaber beschrieben hat, und auf das Thema der Lektion.\n" +
      "Wenn noch keine Aufgabe gewählt ist: Schlag genau drei kleine, konkrete Aufgaben " +
      "vor, die er in dieser Woche in seinem Betrieb umsetzen kann – jede in einem Satz, " +
      "nummeriert – und frag, welche er nehmen möchte.\n" +
      "Wenn er eine gewählt hat: Führ ihn Schritt für Schritt hindurch, höchstens drei " +
      "Schritte auf einmal, und frag nach jedem Abschnitt, ob es geklappt hat.\n" +
      "Wenn er aufgeschrieben hat, wie er eine Aufgabe umgesetzt hat, und um Rückmeldung " +
      "bittet: Nenn eine Sache, die gut war, und einen konkreten nächsten Schritt.\n" +
      "Halte dich kurz, ohne Fachjargon. Nenn keine Preise von Anbietern als Tatsache, " +
      "gib keine Rechtsberatung, und erinnere daran, keine sensiblen Kundendaten in " +
      "KI-Werkzeuge einzugeben, wenn es zur Aufgabe passt.",
    requiresPlan: "ki_praxis",
    costsTokens: 0,
    maxInputChars: 4000,
    maxHistoryTurns: 12,
    async load({ memberId, subject }) {
      const topics = await practiceTopics();
      const topic = topics.find((t) => t.slug === subject);
      if (!topic) return null;
      const [profile, reports] = await Promise.all([
        profileFor(memberId),
        reportsFor(memberId, subject, 3),
      ]);
      const work: CustomerText[] = [];
      if (profile?.trade) work.push({ label: "Branche des Betriebs", text: profile.trade });
      if (profile?.size) work.push({ label: "Größe des Betriebs", text: profile.size });
      if (profile?.painPoint) work.push({ label: "Wo es im Betrieb hakt", text: profile.painPoint });
      for (const report of reports) {
        work.push({ label: "Gewählte Aufgabe", text: report.task });
        work.push({ label: "So hat er sie umgesetzt", text: report.body });
      }
      return { about: [{ label: "Lektion", value: topic.title }], work };
    },
  },
];

/** The entry with this id, or `undefined`. The lookup the server action makes. */
export function companionById(id: string): Companion | undefined {
  return COMPANIONS.find((companion) => companion.id === id);
}
