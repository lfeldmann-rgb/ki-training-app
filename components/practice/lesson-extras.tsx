// What KI-Praxis adds to a lesson page beyond the course module's own parts:
// the self-check at the end of each block (and, from stage 3, the guided
// task). The course module's lesson page renders this one component, so the
// app's own pieces have one place and the module stays unaware of them.
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityPanel } from "@/lib/modules/component-registry";
import { publicQuestions } from "@/lib/practice/self-checks";

import { SelfCheckForm } from "./self-check-form";

export async function LessonExtras({
  blockSlug,
  isLastInBlock,
}: {
  blockSlug: string;
  isLastInBlock: boolean;
}) {
  // The self-check closes its block, so it sits on the block's last lesson —
  // and only where a check for that block exists.
  const check = isLastInBlock ? publicQuestions(blockSlug) : null;
  if (!check) return null;

  const t = await getTranslations("practice");
  return (
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
  );
}
