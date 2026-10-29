"use client";

// The learning game's surface, inside <ActivityPanel>: one card at a time, two
// buttons, then the round goes to the server for its score
// (modules/activity/activities.ts, "ki-sortierspiel"). Keyboard first — the
// two choices are real buttons, and the card's text is announced through the
// panel's one live region (rule 2 in the panel header).
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useActivity } from "@/lib/modules/component-registry";

interface Loaded {
  cards: { id: string; text: string }[];
}

export function SortingGame() {
  const t = useTranslations("practice");
  const activity = useActivity();
  const { cards } = activity.data as Loaded;
  const [sorted, setSorted] = useState<Record<string, "ki" | "du">>({});
  const [round, setRound] = useState(0);

  const index = Object.keys(sorted).length;
  const card = cards[index];
  const judged = activity.score !== null && activity.maxScore !== null;

  const choose = (pile: "ki" | "du") => {
    if (!card || activity.pending) return;
    const next = { ...sorted, [card.id]: pile };
    setSorted(next);
    const following = cards[index + 1];
    if (following) {
      activity.announce(t("gameCardOf", { index: index + 2, total: cards.length }) + " " + following.text);
    } else {
      void activity.submit(next);
    }
  };

  if (!card) {
    return (
      <div className="flex flex-col gap-4">
        <p role="status" className="font-medium">
          {judged
            ? t("gameScore", { score: activity.score!, max: activity.maxScore! })
            : t("gameChecking")}
        </p>
        {judged ? <p className="text-muted-foreground text-sm">{t("gameExplain")}</p> : null}
        <div>
          <Button
            variant="outline"
            disabled={activity.pending}
            onClick={() => {
              setSorted({});
              setRound((n) => n + 1);
            }}
          >
            {t("gameAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div key={round} className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        {t("gameCardOf", { index: index + 1, total: cards.length })}
      </p>
      <p className="bg-muted rounded-md p-4 text-lg font-medium">{card.text}</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => choose("ki")} disabled={activity.pending}>
          {t("gamePileKi")}
        </Button>
        <Button variant="outline" onClick={() => choose("du")} disabled={activity.pending}>
          {t("gamePileDu")}
        </Button>
      </div>
    </div>
  );
}
