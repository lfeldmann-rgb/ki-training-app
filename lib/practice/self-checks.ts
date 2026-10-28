// The self-check closing each block of the course — its questions, and the
// pure rules that judge an answer sheet.
//
// Content authored in code (docs/content-authority.md, case 1): the assistant
// drafts the questions, the vendor reviews them, a change is one sentence.
// They travel with every deploy, so there is nothing to apply.
//
// 🚨 **The answer key never leaves the server.** `publicQuestions()` is what
// `load()` may hand to the browser — the questions and their options, nothing
// else. `scoreAnswers()` is what `grade()` calls. Both are pure, so the rules
// are tested without a database (lib/practice/self-checks.test.ts).
//
// `subject` is the BLOCK's slug — the self-check closes a block, and block
// slugs are unique across the app (docs/courses.md).

export interface SelfCheckQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  /** The id of the right option. Server-only. */
  answer: string;
}

export interface SelfCheck {
  title: string;
  questions: SelfCheckQuestion[];
}

/** Three of four right is a pass. Read by the activity's `passMark`. */
export const SELF_CHECK_PASS_MARK = 0.75;

export const SELF_CHECKS: Readonly<Record<string, SelfCheck>> = {
  grundlagen: {
    title: "Selbsttest: Grundlagen",
    questions: [
      {
        id: "g1",
        text: "Wobei kann dir KI im Betrieb heute schon gut helfen?",
        options: [
          { id: "a", text: "Beim Schreiben von Antworten, Angeboten und Beiträgen" },
          { id: "b", text: "Beim Entscheiden, ob eine Arbeit fachlich richtig ausgeführt ist" },
          { id: "c", text: "Beim Übernehmen der Verantwortung für Zusagen an Kunden" },
        ],
        answer: "a",
      },
      {
        id: "g2",
        text: "Die KI nennt in einem Antwortentwurf einen Preis. Was tust du?",
        options: [
          { id: "a", text: "Ich schicke den Entwurf direkt ab – die KI klingt ja sicher" },
          { id: "b", text: "Ich prüfe den Preis selbst, bevor die Antwort rausgeht" },
          { id: "c", text: "Ich lösche den Preis und schicke nichts" },
        ],
        answer: "b",
      },
      {
        id: "g3",
        text: "Welche einfache Regel gilt für den Anfang?",
        options: [
          { id: "a", text: "Die KI entscheidet, ich setze um" },
          { id: "b", text: "Die KI bereitet vor, ich entscheide" },
          { id: "c", text: "KI nur nutzen, wenn ich gar keine Zeit habe" },
        ],
        answer: "b",
      },
      {
        id: "g4",
        text: "Welche Daten gehören eher nicht in ein KI-Werkzeug?",
        options: [
          { id: "a", text: "Die Öffnungszeiten deines Betriebs" },
          { id: "b", text: "Ein Entwurf für einen Social-Media-Beitrag" },
          { id: "c", text: "Bankdaten oder Gesundheitsangaben deiner Kunden" },
        ],
        answer: "c",
      },
    ],
  },
  "erreichbar-und-organisiert": {
    title: "Selbsttest: Erreichbar und organisiert",
    questions: [
      {
        id: "e1",
        text: "Was sollte ein KI-Telefonassistent einem Anrufer gleich zu Beginn sagen?",
        options: [
          { id: "a", text: "Dass der Anrufer mit einer KI spricht" },
          { id: "b", text: "Den Preis für die häufigste Leistung" },
          { id: "c", text: "Nichts – es soll wie ein Mensch wirken" },
        ],
        answer: "a",
      },
      {
        id: "e2",
        text: "Was sollte der Telefonassistent auf keinen Fall ohne dich tun?",
        options: [
          { id: "a", text: "Öffnungszeiten nennen" },
          { id: "b", text: "Aufträge annehmen oder Preise zusagen" },
          { id: "c", text: "Einen Rückrufwunsch aufnehmen" },
        ],
        answer: "b",
      },
      {
        id: "e3",
        text: "Was bereitest du vor, bevor du einen Telefonassistenten einrichtest?",
        options: [
          { id: "a", text: "Die häufigsten Fragen deiner Kunden mit deinen Antworten" },
          { id: "b", text: "Eine neue Telefonnummer" },
          { id: "c", text: "Nichts – der Assistent lernt alles von selbst" },
        ],
        answer: "a",
      },
      {
        id: "e4",
        text: "Du hast eine Bestellliste ins Handy gesprochen. Was prüfst du vor dem Bestellen?",
        options: [
          { id: "a", text: "Ob die Rechtschreibung stimmt" },
          { id: "b", text: "Mengen und Zahlen" },
          { id: "c", text: "Gar nichts, die KI hört genau zu" },
        ],
        answer: "b",
      },
    ],
  },
  "kunden-gewinnen-und-betreuen": {
    title: "Selbsttest: Kunden gewinnen und betreuen",
    questions: [
      {
        id: "k1",
        text: "Wie bekommst du von der KI bessere Social-Media-Texte?",
        options: [
          { id: "a", text: "Ich sage ihr, was mein Betrieb macht, für wen und in welchem Ton" },
          { id: "b", text: "Ich schreibe nur „Mach einen Beitrag“" },
          { id: "c", text: "Ich lasse sie Kundenstimmen erfinden" },
        ],
        answer: "a",
      },
      {
        id: "k2",
        text: "Was wirkt in deinen Beiträgen meist besser als ein KI-Bild?",
        options: [
          { id: "a", text: "Ein Foto aus deinem eigenen Betrieb" },
          { id: "b", text: "Ein Stockfoto" },
          { id: "c", text: "Gar kein Bild" },
        ],
        answer: "a",
      },
      {
        id: "k3",
        text: "Was ist der größte Hebel beim Beantworten von Anfragen?",
        options: [
          { id: "a", text: "Jede Antwort komplett neu schreiben" },
          { id: "b", text: "Eine Sammlung von Musterantworten für die häufigsten Anfragen" },
          { id: "c", text: "Anfragen erst am Wochenende beantworten" },
        ],
        answer: "b",
      },
      {
        id: "k4",
        text: "Braucht die KI für einen Antwortentwurf meistens den vollen Namen und die Adresse des Kunden?",
        options: [
          { id: "a", text: "Ja, sonst kann sie nicht antworten" },
          { id: "b", text: "Nein, die setze ich erst beim Abschicken ein" },
        ],
        answer: "b",
      },
    ],
  },
};

/** What the browser may see — questions and options, never the answer. `null` for an unknown block. */
export function publicQuestions(subject: string) {
  const check = Object.hasOwn(SELF_CHECKS, subject) ? SELF_CHECKS[subject] : undefined;
  if (!check) return null;
  return {
    title: check.title,
    questions: check.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options.map((o) => ({ id: o.id, text: o.text })),
    })),
  };
}

/**
 * Judge an answer sheet the browser sent. Untrusted data: anything that is not
 * a `{ [questionId]: optionId }` object of strings counts as unanswered.
 * `complete` is false while a question is left open — the caller treats that
 * as no verdict, so a half-filled sheet can never be scored.
 */
export function scoreAnswers(
  subject: string,
  submission: unknown,
): { complete: boolean; score: number; maxScore: number } | null {
  const check = Object.hasOwn(SELF_CHECKS, subject) ? SELF_CHECKS[subject] : undefined;
  if (!check) return null;
  const sheet =
    submission && typeof submission === "object" && !Array.isArray(submission)
      ? (submission as Record<string, unknown>)
      : {};
  let answered = 0;
  let score = 0;
  for (const q of check.questions) {
    const given = Object.hasOwn(sheet, q.id) ? sheet[q.id] : undefined;
    if (typeof given !== "string" || !q.options.some((o) => o.id === given)) continue;
    answered += 1;
    if (given === q.answer) score += 1;
  }
  return { complete: answered === check.questions.length, score, maxScore: check.questions.length };
}
