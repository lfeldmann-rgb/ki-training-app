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
  cover picture
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

### The learning game — "Wer macht was?", on lesson 1

- **Does:** eight cards from everyday business, one at a time; the owner
  sorts each into "Kann KI vorbereiten" or "Bleibt bei dir" and sees
  "x von 8 richtig zugeordnet" plus the rule of thumb. Unlimited, free, no
  pass mark — practice, not an exam.
- **Done when:** an owner on lesson 1 sorts all eight cards and sees their
  score — checked 2026-10-29 as the test owner: two deliberate mistakes gave
  "6 von 8 richtig zugeordnet.", "Noch einmal spielen" starts at card 1;
  test result deleted
- **Access:** activity `ki-sortierspiel`, `requiresPlan: "ki_praxis"`,
  `subject: "was-ki-kann"` (`modules/activity/activities.ts`)
- **Data:** `activity_results` (module); cards and key in code,
  `lib/practice/sorting-game.ts`
- **Where:** `components/practice/lesson-extras.tsx` → `sorting-game.tsx`
- **Tests:** `lib/practice/sorting-game.test.ts` (key never sent, half rounds
  never scored, both piles in the key)

### Lisa, the assistant — `/dashboard/chat` and the launcher

- **Does:** answers buyers' questions from her handbook (`content/knowledge/`,
  10 pages: start, course, self-check, game, guided task, purchase and access,
  account, "bought but not unlocked", when she sends you to support,
  glossary) and from the course lessons (the courses content source).
- **Done when:** a buyer asks Lisa about the app and gets the handbook's answer,
  an honest "no" for what is not there, and the support address for money —
  checked 2026-10-29 with three questions (self-check: correct; bookkeeping:
  "Nein … Support"; refund: support address + order number); cache hit from
  the second message (cached=5034 tokens), ~0.55 cents per answer
- **Access:** `requiresPlan: "ki_praxis"` in `config/ai-chat.json`
- **Data:** `chat_messages` (core)
- **Tests:** `node run.mjs kb-check` (10 pages, in order)

### First steps — "Deine ersten Schritte" on `/dashboard`

- **Does:** four steps from the purchase to the activation event, each with
  its link; the list disappears once all four are done.
  1. `plan` — Kurs freischalten → `/plans` · done: `owned.length > 0`
     (`entitlementsFor()`)
  2. `lesson` — Lektion 1 lesen → the first lesson · done: a
     `courses_completions` row for the course's first lesson
  3. `profile` — Deinen Betrieb beschreiben → `/dashboard/aufgabe` · done: a
     `practice_profiles` row
  4. `report` — Deine erste Aufgabe umsetzen → `/dashboard/aufgabe?thema=…` ·
     done: a `practice_reports` row (= Activation)
  Steps 2–4 are asked only for a member who holds the course
  (`lib/practice/milestones.ts`, all read from state, no stored tick).
- **Done when:** a new buyer sees "1 von 4 erledigt" and the next step, and a
  step ticks itself when it happens — checked 2026-10-29 as
  kundin@example.test: 1/4 after the grant, 2/4 after lesson 1 was marked done
  (test completion removed afterwards)
- **Tests:** `lib/onboarding/rules.test.ts` (the checklist's rules),
  `i18n/messages.test.ts`

### The salespage — `/`

- **Does:** the home page sells KI-Praxis — hero with the lesson-1 cover,
  problem → promise, three benefits, every feature by its app name (#inside)
  with the five lessons and their covers, the founder line, ONE offer block
  (#offer: price via `formatPrice()`, value stack, 14-day withdrawal right,
  who charges, what happens after the purchase, buy button), six FAQ, final
  CTA. Buy button: signed out `checkoutLinksFor()`, signed in
  `startCheckoutAction`, a blocker sentence otherwise (same split as /plans).
- **Done when:** a stranger can say within one scroll what it is, for whom,
  what it costs, why believe it and what to click — checked 2026-10-29 in
  dark, light and at 380 px; the buy button reaches the Digistore24 order
  form (HTTP 200) with the DEV test-payment parameter
- **Copy:** `docs/marketing/salespage-de.md` (approved deck with its
  Lektorat, 2 rounds, read by the writer — no subagent could be started),
  voice `docs/marketing/voice.md`; en/es/fr translated from the approved deck
- **Access:** public by design (the route `/`)
- **Data:** none of its own; covers via `lib/practice/covers.ts`
  (`mayAccess()` → `mediaUrlFor()`), lessons via `practiceTopics()`
- **Tests:** `node run.mjs ux-check` (no placeholder, no long badge),
  `legal-check` (no access-duration wording)

### Lesson covers — on every lesson page

- **Does:** one AI-drawn illustration per lesson, same style (flat, sage
  green, no text), on top of the lesson.
- **Done when:** every lesson shows its cover — checked 2026-10-28 by fetching
  all lesson pages as the test owner (img with alt text, `/api/media/…` 200,
  image/webp)
- **Access:** `visibility: "public"` in `content/media-manifest.json` — they
  may also serve the salespage
- **Data:** files `content/media/ki-praxis/<lesson>.webp` (1280×853, ~50–75 KB,
  drawn with gpt-image-2 at 1536×1024, ~5.3 cents each, recorded in
  `ai_usage`), referenced by path as `cover` in `content/course/ki-praxis/*.json`;
  `content-apply` puts them in the store in every environment
- **Tests:** `node run.mjs courses-check` (5 media paths, all declared)

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

### The guided task — `/dashboard/aufgabe` ("Meine Aufgabe im Betrieb")

- **Does:** three steps on one page. 1. the owner describes their business
  (trade, size, where it hurts); 2. picks a lesson's topic and talks to the
  companion, which suggests three tasks for this business and walks them
  through one; 3. writes down which task they did and how it went, then asks
  the same conversation for feedback and a next step. Reached from the menu,
  from the course card on `/dashboard` and from every lesson
  (`?thema=<lesson slug>`).
- **Done when:** an owner describes their bakery, gets three tasks on the
  phone-assistant topic, saves how they did one and gets feedback that refers
  to it — checked 2026-10-28 as the test owner with real calls to OpenAI
  (gpt-5.6-luna); test rows deleted afterwards
- **Access:** page `hasPlan(memberId, "ki_praxis")` else
  `/plans?needs=ki_praxis`; both actions `requireActiveUser()` +
  `hasPlan(…, "ki_praxis")`; companion `aufgaben-coach`,
  `requiresPlan: "ki_praxis"`, `costsTokens: 0`
- **Data:** `practice_profiles`, `practice_reports` (`db/schema-practice.ts`),
  `chat_messages` for the conversation (`aufgaben-coach:<lesson slug>`). All in
  `docs/data-protection.md` §8a/§8d and both exports.
- **AI:** task `companion` on "auto" → OpenAI; ~0.4 cents per turn
  (`node run.mjs ai-check`). What the owner wrote travels in `work`, fenced;
  `about` is the lesson title only.
- **Tests:** `lib/practice/rules.test.ts`; the companion module's own tests
  (fence, gate, guard order)

## Decisions worth remembering

- **No lesson videos.** Decided on 2026-10-28 by the vendor in build-app 1b.
- **No downloadable workbook (PDF).** Decided on 2026-10-28 by the vendor in
  build-app 1b.
- **No look back over the course (companion row 3).** Decided on 2026-10-28 by
  the vendor in build-app 1c.
- **One product, `ki_praxis`, `one_time`, 149 €** — named by the vendor
  2026-10-29. The template's examples `basic` and `starter` are parked
  (`"sell": false`), `billingMode` is `subscriptions`.
- **German order form only.** Decided by the vendor 2026-10-29: the course is
  German, so `productIds` carries `de` alone and en/es/fr visitors get the
  German form. `ds24-sync` warns about the three missing languages on every
  run — that warning is this decision, not a gap.
- **Digistore24 account:** the vendor's (lf@feldmannconsult.com), connected
  2026-10-29 with `ds24-connect`. DEV product 756657 in product group
  "KI-Praxis" (71963). The PROD product is a go-live step.
- **IPN in DEV not registered yet** (2026-10-29): it needs a Cloudflare Quick
  Tunnel, and the assistant's own safety check refuses to open a public
  tunnel from the vendor's machine. `cloudflared` is installed
  (`C:\Program Files (x86)\cloudflared`); the vendor runs `node run.mjs
  ds24-sync` once in a NEW terminal, or it waits for the real domain at
  go-live.
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
- **Feedback comes when the owner asks for it, in the same conversation** —
  not as an automatic reply when a report is saved. Decided 2026-10-28 by the
  assistant: one companion surface per topic (never a second panel), and the
  report reaches it through `load()`. An automatic one-shot reply would need a
  server action of its own beside the panel's guards.
- **OpenAI is the provider** (key in `.env`, set by the vendor 2026-10-28),
  because one key covers text and the lesson cover pictures. The template sent
  OpenAI `max_tokens`, which its current models refuse; fixed in
  `lib/ai/providers/openai-compat.ts` (`maxTokensField`).
- **The assistant is called Lisa and answers buyers only** (vendor,
  2026-10-29): `config/ai-chat.json` → `name: "Lisa"`,
  `requiresPlan: "ki_praxis"`. Support address she names:
  lf@feldmannconsult.com. She does not answer refunds, withdrawal, invoices,
  legal advice, third-party prices or firm promises (handbook
  `20-howto/wann-support.md`).
- **OpenAI refuses function tools with reasoning on /chat/completions** —
  Lisa failed on every message until the adapter sent
  `reasoning_effort: "none"` with tools (2026-10-29,
  `lib/ai/providers/openai-compat.ts`, `toolsNeedNoReasoning`).
- **No social proof with quotes or numbers on the salespage** — there are none
  yet (vendor, 2026-10-29); the founder line from feldmannconsult.com stands
  in. Lisa joined the page on 2026-10-29, once her handbook existed.
- **No guarantee beyond the statutory withdrawal right** (vendor, 2026-10-29).
- **No welcome survey** (user-onboarding, 2026-10-29): the business profile in
  step 3 already is the question whose answer changes something — the
  companion's suggestions. A second survey would drive nothing.
- **No reminder mail for buyers who never start — not now** (2026-10-29): it
  is a marketing-adjacent mail, and whether one service reminder is fine
  without consent belongs to `compliance-check`. The recipe is
  `docs/onboarding.md` §9 if it comes back.
- **No product tour / overlay** (2026-10-29): the checklist with links does
  the job (`docs/onboarding.md` §6).
- `npx shadcn add accordion` wrote `import { cn } from "cn"` into
  `components/ui/accordion.tsx` and installed an unrelated npm package `cn`
  (2026-10-29) — fixed to `@/lib/utils`, package removed. Its `npm install`
  also pruned the embedded Postgres mid-run; `node run.mjs start` puts it
  back by itself.
- ⚠️ **Fernunterricht (FernUSG) is open**: AI feedback on what an owner hands
  in may count as monitoring the learning outcome. Not decided here —
  `compliance-check` before the first sale.
- **Go-live setup, chosen by the vendor 2026-10-29:** the app lives at
  `https://kurs.feldmannconsult.com` (a subdomain of the vendor's own
  domain, DNS at IONOS — no new domain bought), sign-in mails go out from
  `kurs@feldmannconsult.com` through **Brevo** (EU-hosted, free tier),
  hosting is **Render** (Starter web service + Basic Postgres, region
  Frankfurt — switched from Railway the same day, which accepted no new
  sign-up for the vendor), files (the lesson
  covers) go to **Cloudflare R2**. Rejected: SMTP over IONOS (Brevo's API works on
  every host, SMTP not), a separate domain (costs a year's fee and a second
  DNS account for nothing). STAGING, if ever, goes on
  `test.feldmannconsult.com`. ⚠️ The domain also carries the vendor's own
  mail: Brevo's records join the existing SPF record, MX stays untouched.
- **Live since 2026-10-30** at `https://kurs.feldmannconsult.com` (Render
  service `ki-training-app`, Node 24 via `.nvmrc`, Postgres `ki_praxis_db` in
  Frankfurt). Done: owner `lf@feldmannconsult.com` (`user-create` in the Render
  shell), smoke member, course + covers via `content-apply --env prod`,
  `health`, `smoke` (22 pages, 15 signed in) and `errors` against the live URL
  green. The first builds failed on a `DATABASE_URL` that held only the
  database's host name, not on the code. PROD product `757175` + IPN (domain
  `kurs-feldmannconsult-com-prod-…`) created 2026-10-30, passphrase and domain id
  set at Render, testpay key rotated; a Digistore24 test purchase (Testpay,
  vendor's "Testkauf durchführen") reached `/api/ipn` at 09:29 UTC with no error
  in the live log. Open: live gateways (ux, security, performance), product
  approval — **not before the FernUSG answer**. The setup surface stays OFF, so
  `content-check --env prod` cannot answer; `courses-check` against the prod
  database stood in for it.
- **Planned: go-live** (2026-10-29) — vendor creates Brevo, Render and
  Cloudflare accounts and Brevo's DNS records at IONOS; then `mail-setup`,
  R2 bucket + `media-check`, Render deploy, `user-create --role owner`,
  `content-publish --env prod`, PROD product + IPN via `ds24-sync --env prod`,
  a real test purchase. **No sale before the FernUSG question is answered by
  a lawyer** (`docs/reports/compliance-2026-10-29.md`).
