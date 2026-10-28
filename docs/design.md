# KI-Training (Feldmann Consult) — how it looks

_Chosen on 2026-10-28, direction "Feldmann Consult — own brand", via the skill
`design` (Branch A). Every page built since is expected to match this file
rather than invent its own look. Change it here first, then apply it — never
page by page. Nothing in here overrides CLAUDE.md § UI or docs/ux.md._

## Identity
- **Mood:** calm, practical, local craftsmanship
- **Taken from:** https://www.feldmannconsult.com — the green on every button,
  heading and link there: **#58876d** (`rgb(88 135 109)`, the site's
  `--theme-h1-color` / `--theme-link-color`). The stylesheet's first-ranked
  blue (#007cba) is WordPress's admin colour, not the brand — rejected.
  Contrast adjustments by `node run.mjs brand colors --hex "#58876d"`:
  - light: lightness 44% → 40% (**#517b64**) — white text on the original was
    3.8:1, under the 4.5:1 floor
  - dark: lightness 44% → 49% (**#63977a**) — same pair, same floor
  The hue is unchanged in both.
- **Not carried over:** the site's background grey #F5F5F5 and text #101010.
  Offered to the vendor on 2026-10-28; the shipped warm greys stay.

## Tokens — delta from the shipped defaults
(only what changed; everything unlisted keeps the shipped value)
- `--primary`: hsl(147 21% 40%) light / hsl(147 21% 49%) dark — "Feldmann-Grün"
- `--primary-foreground`: hsl(147 20% 97%) light / hsl(147 21% 13%) dark —
  near-white on the light button, near-black on the dark one, both tinted green
- `--ring`: follows `--primary` in both blocks
- `OG_ACCENT` (`lib/pwa/manifest.ts`) and `DEFAULT_ACCENT` (`lib/email.ts`):
  #517b64, the light `--primary` as hex

## Typography
- **Body:** Open Sans — `@fontsource-variable/open-sans`, `app/layout.tsx`
- **Headings:** Syne — `@fontsource-variable/syne`, its own `localFont()` on
  `--font-app-heading` (reaches `h1` only, as shipped)
  Both are the vendor's website faces, as Fontsource ships them.

## The mark
- **Logo:** none — the letter tile, in the accent. The website shows
  "Feldmann Consult" as a text wordmark; no logo file was handed over.
- **Dark variant:** not needed (the tile follows the tokens)
- **Icons generated:** not yet — the shipped icons stay until a logo exists.
  Then `node run.mjs brand icons --logo … --apply`, all five together.

## Page composition
- **Dashboard home:** the course card first — progress bar and "continue with
  lesson N" — then the guided task of the week
- **Lesson pages:** cover picture on top, text, then the self-check or the
  guided task; the AI feedback directly under what the owner wrote
- **The salespage (`/`):** calm and practical, owners in their own shop or
  workshop — the sections themselves are the skill `salespage`
- **Settings/account:** unchanged — the same on every app, on purpose

## Signature element
The progress bar in Feldmann-Grün — on the dashboard and above every lesson.

## Do / Don't
- Plain words for owners, no AI jargon in headings
- One green action per screen — the next step, never three equal buttons
