"use client";

// The self-check's questions, inside <ActivityPanel>. It renders what `load()`
// sent — questions and options, never the answers — and hands the answer sheet
// to `submit()`; the verdict is the server's (modules/activity/activities.ts,
// "block-selbsttest"). Keyboard first: the radio groups are Radix, so arrow
// keys move within a question and Tab moves between them.
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useActivity } from "@/lib/modules/component-registry";

interface Loaded {
  title: string;
  questions: { id: string; text: string; options: { id: string; text: string }[] }[];
}

export function SelfCheckForm() {
  const t = useTranslations("practice");
  const activity = useActivity();
  const data = activity.data as Loaded;
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const open = data.questions.filter((q) => !answers[q.id]).length;
  const judged = activity.score !== null && activity.maxScore !== null;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        void activity.submit(answers);
      }}
    >
      <ol className="flex flex-col gap-6">
        {data.questions.map((question, index) => (
          <li key={question.id} className="flex flex-col gap-3">
            <p id={`frage-${question.id}`} className="font-medium">
              {index + 1}. {question.text}
            </p>
            <RadioGroup
              aria-labelledby={`frage-${question.id}`}
              value={answers[question.id] ?? ""}
              onValueChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
              disabled={activity.pending}
            >
              {question.options.map((option) => {
                const id = `antwort-${question.id}-${option.id}`;
                return (
                  <div key={option.id} className="flex items-start gap-3">
                    <RadioGroupItem id={id} value={option.id} className="mt-0.5" />
                    <Label htmlFor={id} className="leading-snug font-normal">
                      {option.text}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </li>
        ))}
      </ol>

      {judged ? (
        <p className="text-sm" role="status">
          {t("selfCheckScore", { score: activity.score!, max: activity.maxScore! })}
          {activity.passed === false ? ` ${t("selfCheckRetry")}` : ""}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={activity.pending || open > 0}>
          {judged ? t("selfCheckAgain") : t("selfCheckSubmit")}
        </Button>
        {open > 0 ? (
          <p className="text-muted-foreground text-sm">{t("selfCheckOpen", { count: open })}</p>
        ) : null}
      </div>
    </form>
  );
}
