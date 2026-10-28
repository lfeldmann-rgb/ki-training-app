// The practice half of this app's course — what an owner tells the app about
// their business, and what they write down after trying a task in it.
//
// The course itself (blocks, lessons, completions) is the `courses` module's.
// These two tables are THIS app's: the guided task ("Meine Aufgabe im
// Betrieb") reads the profile to suggest tasks that fit, and the report is
// what the companion answers with feedback and a next step.
//
// ── Why `cascade` ──────────────────────────────────────────────────────────
// Both are the owner's own words about their own business, with no retention
// obligation behind them — the same decision as `activity_results` and
// `chat_messages`. Keeping them after a deletion request would be the
// violation, not the record.
//
// ── The activation event ───────────────────────────────────────────────────
// `practice_reports.created_at` of a member's FIRST row is the moment this app
// counts as "it delivered" (docs/plan.md): the owner put a task into practice
// and wrote down how. A one-off purchase has no cancellation to tell the
// vendor otherwise, so this date is the signal.
//
// ── `subject` ──────────────────────────────────────────────────────────────
// The lesson's slug, as an opaque key — the same string the companion and the
// activity on that lesson use (see modules/activity/schema.ts).
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

import { users } from "./schema-core";

// One row per member — their business, in their own words. Every field is
// optional free text: an owner who skips "where it hurts" still gets
// suggestions, just less pointed ones.
export const practiceProfiles = pgTable("practice_profiles", {
  memberId: text("member_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  // "Bäckerei", "Elektriker", "Modeboutique"
  trade: text("trade"),
  // "nur ich", "3 Mitarbeiter"
  size: text("size"),
  // "Telefon klingelt ständig während der Arbeit"
  painPoint: text("pain_point"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// What an owner wrote after putting a task into practice. Several per lesson
// are allowed — a second attempt is a second report, never an overwrite.
export const practiceReports = pgTable(
  "practice_reports",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    memberId: text("member_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    // The task they chose, in their words or the suggestion's.
    task: text("task").notNull(),
    // How they put it into practice.
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("practice_reports_member").on(t.memberId, t.createdAt)],
);
