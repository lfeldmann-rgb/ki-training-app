# KI-Praxis — what this app is

_What was built on top of the template. The template's own rules are in
CLAUDE.md; this file is only what came after. One entry per feature, written the
moment the feature works. Written down by your assistant, from the conversation
— read back to you, a line here is a note to check, not a promise you made._

## The product

- **Sells:** "KI-Praxis für deinen Betrieb" — a self-study course, one-off
  purchase (product key `ki_praxis`); docs/product-brief.md has it in full
- **For:** owners of small retail, trade (Handwerk) and small businesses,
  sold by Feldmann Consult, Pfungstadt
- **Language:** German (Deutsch) — every line the vendor reads is German;
  the app speaks all four `LOCALES`, its course content is German
- **Archetype:** Content-Access — unlocks the course after a single purchase;
  course shape 1, self-study, everything open at once
- **Content authority:** agent-drafted — the lessons are files in
  `content/course/ki-praxis/`, written by the assistant, reviewed by the
  vendor; a change is one sentence to the assistant
- **Output artifact:** the owner knows the AI use cases for their business and
  can put them into practice themselves; each lesson carries an AI-generated
  cover picture (not yet generated — needs an image provider key)
- **Alongside the customer:** suggests tasks that fit the owner's business and
  walks them through one; reads what they write about how they did it and
  answers with feedback and a next step (planned — docs/plan.md, line 3)
- **Activation:** has put a first task into practice and written it down — the
  first `practice_reports` row (`created_at`)
- **Return:** — one-off, nothing recurs

## Features

### The course — `/dashboard/course`, `/dashboard/course/ki-praxis/<lesson>`

- **Does:** the course list, the course outline and every lesson, from the
  `courses` module; a member marks a lesson done and sees "x von 5". Five
  lessons in three blocks, `content/course/ki-praxis/*.json`, applied with
  `node run.mjs content-apply`.
- **Done when:** an owner who bought the course signs in, opens "Mein Kurs",
  reads a lesson and marks it done — checked 2026-10-28 as the test owner in
  the browser ("Erledigt.", the next lesson's button, progress on the list)
- **Access:** the module's gate — `planKeys: ["ki_praxis"]` in
  `content/course/ki-praxis/course.json`, i.e. `hasPlan(memberId, "ki_praxis")`
- **Data:** `courses_*` (module), lessons by `origin = 'content'`
- **Tests:** the module's own (`modules/courses/**/*.test.ts`);
  `node run.mjs courses-check` green

### The course card on the overview — `/dashboard`

- **Does:** the first card after the checklist: "Dein Kurs", progress bar,
  "x von 5 Lektionen abgeschlossen", the next lesson and a button to it — or
  "Kurs freischalten" for a member who has not bought it (title only, no
  lesson count).
- **Done when:** the overview's first card is the course, with its state and
  a button — checked 2026-10-28 in light, dark and at 380 px
- **Access:** the same `courseAccessFor()` the course list uses, through
  `courseStandingsFor()` (`modules/courses/standing.ts`, reached via
  `lib/modules/server-exports.ts`) — one computation for both pages
- **Data:** none of its own
- **Tests:** covered by the module's rules tests (`nextUnit`, `progress`,
  `unitRefs`); `app/dashboard/overview-links.test.ts`

### The self-check closing each block — on the block's last lesson

- **Does:** four multiple-choice questions per block (three blocks), shown
  under the last lesson of the block. The owner answers all four, presses
  "Auswerten" and sees "x von 4 richtig." — three of four is "Bestanden!".
  Unlimited, free.
- **Done when:** an owner at the end of a block answers the self-check and
  sees how many were right — checked 2026-10-28 as the test owner: "3 von 4
  richtig.", "Bestanden!", dark mode
- **Access:** activity `block-selbsttest`, `requiresPlan: "ki_praxis"`
  (`modules/activity/activities.ts`); `subject` is the block slug
- **Data:** `activity_results` (module); questions and answer key in code,
  `lib/practice/self-checks.ts`
- **Where:** `components/practice/lesson-extras.tsx`, rendered by the course
  module's lesson page — the one place the app adds to a lesson
- **Tests:** `lib/practice/self-checks.test.ts` (answer key never sent,
  half-filled sheets never scored, unknown blocks null)

### Practice data — no page yet

- **Data:** `practice_profiles`, `practice_reports` (`db/schema-practice.ts`),
  created in the first stage so the guided task needs no second migration.
  Both in `docs/data-protection.md` §8d and in both exports.

## Decisions worth remembering

- **No lesson videos.** Decided on 2026-10-28 by the vendor in build-app 1b.
- **No downloadable workbook (PDF).** Decided on 2026-10-28 by the vendor in
  build-app 1b.
- **No look back over the course (companion row 3).** Decided on 2026-10-28 by
  the vendor in build-app 1c.
- **One product, `ki_praxis`, `one_time`, 199 € as a PLACEHOLDER.** The vendor
  has not named a price yet (2026-10-28); `setup-digistore` asks it before any
  Digistore24 product exists. The template's examples `basic` and `starter`
  are parked (`"sell": false`), `billingMode` is `subscriptions`.
- **"KI-Praxis" is a working title** set by the assistant on 2026-10-28; the
  vendor is unsure about the name.
- **The overview card reads the course module through a server export**,
  rather than a new dashboard slot in the core: one app, one course, and the
  module's own list page uses the same function. If the course module is ever
  removed, `components/course-overview-card.tsx` goes with it.
- **The self-check tells the score, never which answer was wrong.** Decided
  2026-10-28 by the assistant: the panel exposes score and pass, and putting
  per-question verdicts into the stored state would make it a free answer
  key (`modules/activity/activities.ts`, rule 3). If the vendor wants
  explanations per question, they belong in the lesson text.
- ⚠️ **Fernunterricht (FernUSG) is open**: AI feedback on what an owner hands
  in may count as monitoring the learning outcome. Not decided here —
  `compliance-check` before the first sale.
