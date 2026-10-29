// The learning game on the course's hardest question — which tasks in a
// business AI can prepare, and which stay with the owner. Eight cards, two
// piles, played on the first lesson ("was-ki-kann").
//
// Content authored in code, like the self-checks (lib/practice/self-checks.ts).
// 🚨 The answer key stays on the server: `publicCards()` is what `load()` may
// send, `scoreSort()` is what `grade()` calls. Both pure, tested without a
// database (lib/practice/sorting-game.test.ts).

export type Pile = "ki" | "du";

export const PILES: readonly Pile[] = ["ki", "du"];

/** The lesson the game sits on — its `subject`. */
export const SORTING_GAME_SUBJECT = "was-ki-kann";

interface Card {
  id: string;
  text: string;
  /** Server-only. */
  pile: Pile;
}

// Mixed on purpose: the order a learner sees is the order here, so the two
// piles alternate irregularly rather than in two blocks.
const CARDS: readonly Card[] = [
  { id: "c1", text: "Einen Entwurf für die Antwort auf eine Kundenanfrage schreiben", pile: "ki" },
  { id: "c2", text: "Entscheiden, welchen Preis du einem Kunden zusagst", pile: "du" },
  { id: "c3", text: "Aus einer Sprachnotiz eine ordentliche Bestellliste machen", pile: "ki" },
  { id: "c4", text: "Ideen für einen Instagram-Beitrag zur neuen Saison sammeln", pile: "ki" },
  { id: "c5", text: "Prüfen, ob eine Arbeit fachlich richtig ausgeführt ist", pile: "du" },
  { id: "c6", text: "Eine lange E-Mail in drei Sätzen zusammenfassen", pile: "ki" },
  { id: "c7", text: "Die Verantwortung für eine Zusage an einen Kunden übernehmen", pile: "du" },
  { id: "c8", text: "Anrufern die Öffnungszeiten nennen, wenn du nicht rangehen kannst", pile: "ki" },
];

/** What the browser may see — the cards, never which pile they belong to. `null` for any other subject. */
export function publicCards(subject: string) {
  if (subject !== SORTING_GAME_SUBJECT) return null;
  return { cards: CARDS.map(({ id, text }) => ({ id, text })) };
}

/**
 * Judge a sorting the browser sent — `{ [cardId]: "ki" | "du" }`, untrusted.
 * Anything else counts as unsorted; `complete` is false while a card is left,
 * so a half-played round is never scored.
 */
export function scoreSort(
  subject: string,
  submission: unknown,
): { complete: boolean; score: number; maxScore: number } | null {
  if (subject !== SORTING_GAME_SUBJECT) return null;
  const sheet =
    submission && typeof submission === "object" && !Array.isArray(submission)
      ? (submission as Record<string, unknown>)
      : {};
  let sorted = 0;
  let score = 0;
  for (const card of CARDS) {
    const given = Object.hasOwn(sheet, card.id) ? sheet[card.id] : undefined;
    if (!PILES.includes(given as Pile)) continue;
    sorted += 1;
    if (given === card.pile) score += 1;
  }
  return { complete: sorted === CARDS.length, score, maxScore: CARDS.length };
}
