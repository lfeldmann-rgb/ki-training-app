import { describe, expect, it } from "vitest";

import { SELF_CHECKS, SELF_CHECK_PASS_MARK, publicQuestions, scoreAnswers } from "./self-checks";

const allRight = (subject: string) =>
  Object.fromEntries(SELF_CHECKS[subject]!.questions.map((q) => [q.id, q.answer]));

describe("the self-checks' content", () => {
  it("has one check per block of the course, each with a right answer among its options", () => {
    expect(Object.keys(SELF_CHECKS)).toEqual([
      "grundlagen",
      "erreichbar-und-organisiert",
      "kunden-gewinnen-und-betreuen",
    ]);
    for (const check of Object.values(SELF_CHECKS)) {
      expect(check.questions.length).toBeGreaterThanOrEqual(3);
      for (const q of check.questions) {
        expect(q.options.map((o) => o.id)).toContain(q.answer);
      }
    }
  });
});

describe("publicQuestions", () => {
  it("never hands the answer key to the browser", () => {
    for (const subject of Object.keys(SELF_CHECKS)) {
      const sent = JSON.stringify(publicQuestions(subject));
      expect(sent).not.toContain('"answer"');
    }
  });

  it("answers null for a block that has no check — the same as one that does not exist", () => {
    expect(publicQuestions("no-such-block")).toBeNull();
    expect(publicQuestions("__proto__")).toBeNull();
    expect(publicQuestions("toString")).toBeNull();
  });
});

describe("scoreAnswers", () => {
  it("counts every right answer", () => {
    expect(scoreAnswers("grundlagen", allRight("grundlagen"))).toEqual({
      complete: true,
      score: 4,
      maxScore: 4,
    });
  });

  it("is incomplete while a question is unanswered, so a half sheet is never scored", () => {
    const sheet = allRight("grundlagen");
    delete sheet.g4;
    expect(scoreAnswers("grundlagen", sheet)?.complete).toBe(false);
  });

  it("treats an option that does not exist as unanswered", () => {
    expect(scoreAnswers("grundlagen", { ...allRight("grundlagen"), g1: "z" })?.complete).toBe(false);
  });

  it("treats anything that is not an answer sheet as empty", () => {
    for (const junk of [null, "a", 42, ["a"], { g1: 1 }]) {
      expect(scoreAnswers("grundlagen", junk)?.score).toBe(0);
    }
  });

  it("answers null for an unknown block", () => {
    expect(scoreAnswers("no-such-block", {})).toBeNull();
  });

  it("passes at three of four, not at two", () => {
    expect(3 / 4).toBeGreaterThanOrEqual(SELF_CHECK_PASS_MARK);
    expect(2 / 4).toBeLessThan(SELF_CHECK_PASS_MARK);
  });
});
