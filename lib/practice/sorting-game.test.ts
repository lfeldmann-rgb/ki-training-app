import { describe, expect, it } from "vitest";

import { SORTING_GAME_SUBJECT, publicCards, scoreSort } from "./sorting-game";

const ids = () => publicCards(SORTING_GAME_SUBJECT)!.cards.map((card) => card.id);
const allTo = (pile: string) => Object.fromEntries(ids().map((id) => [id, pile]));

describe("publicCards", () => {
  it("sends the cards and never their pile", () => {
    const sent = JSON.stringify(publicCards(SORTING_GAME_SUBJECT));
    expect(sent).not.toContain('"pile"');
    expect(sent).not.toMatch(/"(ki|du)"/);
    expect(ids().length).toBe(8);
  });

  it("answers null on any other lesson", () => {
    expect(publicCards("ki-telefonassistent")).toBeNull();
    expect(publicCards("__proto__")).toBeNull();
  });
});

describe("scoreSort", () => {
  it("has both piles in the key — sorting everything one way is never a full score", () => {
    const ki = scoreSort(SORTING_GAME_SUBJECT, allTo("ki"))!;
    const du = scoreSort(SORTING_GAME_SUBJECT, allTo("du"))!;
    expect(ki.complete && du.complete).toBe(true);
    expect(ki.score).toBeGreaterThan(0);
    expect(du.score).toBeGreaterThan(0);
    expect(ki.score + du.score).toBe(8);
  });

  it("is incomplete while a card is unsorted, and ignores piles that do not exist", () => {
    const sheet = allTo("ki");
    delete sheet.c1;
    expect(scoreSort(SORTING_GAME_SUBJECT, sheet)!.complete).toBe(false);
    expect(scoreSort(SORTING_GAME_SUBJECT, { ...allTo("ki"), c2: "vielleicht" })!.complete).toBe(false);
  });

  it("treats anything that is not a sorting as empty", () => {
    for (const junk of [null, "ki", 3, ["ki"]]) {
      expect(scoreSort(SORTING_GAME_SUBJECT, junk)).toEqual({ complete: false, score: 0, maxScore: 8 });
    }
  });

  it("answers null on any other lesson", () => {
    expect(scoreSort("ki-telefonassistent", allTo("ki"))).toBeNull();
  });
});
