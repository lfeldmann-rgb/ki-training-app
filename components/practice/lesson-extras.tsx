// What KI-Praxis adds to a lesson page beyond the course module's own parts:
// the way into the guided task on this lesson's topic, and the self-check at
// the end of each block. The course module's lesson page renders this one
// component, so the app's own pieces have one place and the module stays
// unaware of them.
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityPanel } from "@/lib/modules/component-registry";
import { publicQuestions } from "@/lib/practice/self-checks";

import { SelfCheckForm } from "./self-check-form";

export async function LessonExtras({
  unitSlug,
  blockSlug,
  isLastInBlock,
}: {
  unitSlug: string;
  blockSlug: string;
  isLastInBlock: boolean;
}) {
  const t = await getTranslations("practice");
  // The self-check closes its block, so it sits on the block's last lesson —
  // and only where a check for that block exists.
  const check = isLastInBlock ? publicQuestions(blockSlug) : null;

  return (
    <>
      <div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/aufgabe?thema=${encodeURIComponent(unitSlug)}`}>
            <Briefcase aria-hidden="true" />
            {t("lessonPracticeLink")}
          </Link>
        </Button>
      </div>

      {check ? (
        <Card>
          <CardHeader>
            <CardTitle>{check.title}</CardTitle>
            <p className="text-muted-foreground text-sm">{t("selfCheckIntro")}</p>
          </CardHeader>
          <CardContent>
            <ActivityPanel activityId="block-selbsttest" subject={blockSlug}>
              <SelfCheckForm />
            </ActivityPanel>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
