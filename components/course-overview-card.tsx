// The app's own card on /dashboard — the course, first (docs/ux.md § 0: a
// member came for the product, and on a phone the navigation sits behind a
// button).
//
// The numbers come from `courseStandingsFor()` — the same computation the
// course list renders — through the server-exports barrel, so "weiter mit"
// lands on the same lesson on both pages. A course the member does not hold
// shows its title and a way to unlock it, never its lesson count
// (modules/courses/standing.ts says why).
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseStandingsFor } from "@/lib/modules/server-exports";

export async function CourseOverviewCard({
  memberId,
  role,
}: {
  memberId: string;
  role: string | null;
}) {
  const [first] = await courseStandingsFor(memberId, role);
  // No course on this installation yet — the overview stays as it ships.
  if (!first) return null;

  const t = await getTranslations("dashboard");
  const tPractice = await getTranslations("practice");
  const { course, entitled, standing } = first;
  const courseHref = `/dashboard/course/${encodeURIComponent(course.slug)}`;
  const finished = standing !== null && standing.total > 0 && standing.done === standing.total;

  return (
    <Card className="mb-6">
      <CardHeader>
        <p className="text-muted-foreground text-sm font-medium">{t("courseCardLabel")}</p>
        <CardTitle level="h2">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {standing && standing.total > 0 ? (
          <div className="flex flex-col gap-2">
            <div
              role="progressbar"
              aria-valuenow={standing.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("courseProgressLabel")}
              className="bg-muted h-2 w-full overflow-hidden rounded-full"
            >
              <div className="bg-primary h-full" style={{ width: `${standing.percent}%` }} />
            </div>
            <p className="text-muted-foreground text-sm">
              {finished
                ? t("courseFinished")
                : t("courseProgress", { done: standing.done, total: standing.total })}
            </p>
          </div>
        ) : course.summary ? (
          <p className="text-muted-foreground text-sm">{course.summary}</p>
        ) : null}

        {!entitled ? (
          <Button asChild>
            <Link href={`/plans?course=${encodeURIComponent(course.slug)}`}>{t("courseUnlock")}</Link>
          </Button>
        ) : standing?.next && !finished ? (
          // The lesson title on its own line, the button short: a button does
          // not wrap, and a title as long as the first lesson's ran past the
          // card at 380 px.
          <div className="space-y-2">
            <p className="text-sm">{t("courseNext", { title: standing.next.title })}</p>
            <Button asChild>
              <Link href={`${courseHref}/${encodeURIComponent(standing.next.slug)}`}>
                {standing.done > 0 ? t("courseContinue") : t("courseStart")}
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild variant="outline">
            <Link href={courseHref}>{t("courseOpen")}</Link>
          </Button>
        )}

        {/* The guided task lives beside the course, and a buyer reaches it
            from here (docs/ux.md § 0, app/dashboard/overview-links.test.ts). */}
        {entitled ? (
          <div>
            <Button asChild variant="outline">
              <Link href="/dashboard/aufgabe">{tPractice("courseCardPractice")}</Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
