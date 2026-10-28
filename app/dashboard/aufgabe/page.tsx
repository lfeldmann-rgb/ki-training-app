// "Meine Aufgabe im Betrieb" — the guided task.
//
// Three steps on one page, in the order an owner takes them: describe the
// business, pick a lesson's topic and work through a task with the companion
// ("aufgaben-coach", modules/companion/companions.ts), then write down how it
// went — the first report is the app's activation event (docs/app.md) — and
// ask the same conversation for feedback.
//
// Access: `hasPlan(memberId, "ki_praxis")`, else the plans page. The topic
// comes off the URL (`?thema=<lesson slug>`) and is only ever used after it
// was found among the course's lessons.
import Link from "next/link";
import { redirect } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Briefcase } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireActiveUser } from "@/lib/authz";
import { hasPlan } from "@/lib/entitlements/manage";
import { CompanionPanel } from "@/lib/modules/component-registry";
import { practiceTopics, profileFor, reportsFor } from "@/lib/practice/manage";

import { ProfileForm, ReportForm } from "./ui";

export async function generateMetadata() {
  const t = await getTranslations("practice");
  return { title: t("title") };
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ thema?: string }>;
}) {
  const session = await requireActiveUser();
  const memberId = session.user.id;
  if (!(await hasPlan(memberId, "ki_praxis"))) redirect("/plans?needs=ki_praxis");

  const t = await getTranslations("practice");
  const format = await getFormatter();
  const { thema } = await searchParams;
  const [topics, profile] = await Promise.all([practiceTopics(), profileFor(memberId)]);
  const topic = topics.find((entry) => entry.slug === thema) ?? null;
  const reports = topic ? await reportsFor(memberId, topic.slug) : [];

  return (
    <>
      <PageHeader title={t("title")} description={t("intro")} />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle level="h2">{t("profileTitle")}</CardTitle>
            <p className="text-muted-foreground text-sm">{t("profileIntro")}</p>
          </CardHeader>
          <CardContent>
            {/* Keyed on what is saved: React resets a form after its action
                to the defaults it was MOUNTED with, so without a fresh mount
                the fields went blank right after a successful save. */}
            <ProfileForm key={JSON.stringify(profile)} initial={profile} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle level="h2">{t("topicTitle")}</CardTitle>
            <p className="text-muted-foreground text-sm">{t("topicIntro")}</p>
          </CardHeader>
          <CardContent>
            {topics.length === 0 ? (
              <EmptyState icon={Briefcase} title={t("noTopicsTitle")} description={t("noTopicsBody")} />
            ) : (
              <ul className="flex flex-wrap gap-2">
                {topics.map((entry) => (
                  <li key={entry.slug}>
                    {/* Lesson titles are long, and a button does not wrap by
                        itself — at 380 px it ran past the card. */}
                    <Button
                      asChild
                      variant={entry.slug === topic?.slug ? "default" : "outline"}
                      size="sm"
                      className="h-auto py-2 text-left whitespace-normal"
                    >
                      <Link
                        href={`/dashboard/aufgabe?thema=${encodeURIComponent(entry.slug)}`}
                        aria-current={entry.slug === topic?.slug ? "page" : undefined}
                      >
                        {entry.title}
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {topic ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle level="h2">{t("coachTitle", { topic: topic.title })}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {profile ? t("coachIntro") : t("coachIntroNoProfile")}
                </p>
              </CardHeader>
              <CardContent>
                <CompanionPanel companionId="aufgaben-coach" subject={topic.slug} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle level="h2">{t("reportTitle")}</CardTitle>
                <p className="text-muted-foreground text-sm">{t("reportIntro")}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <ReportForm subject={topic.slug} />
                {reports.length > 0 ? (
                  <div className="flex flex-col gap-4 border-t pt-4">
                    <h3 className="text-sm font-medium">{t("reportsTitle")}</h3>
                    <ul className="flex flex-col gap-4">
                      {reports.map((report) => (
                        <li key={report.id} className="flex flex-col gap-1">
                          <p className="font-medium">{report.task}</p>
                          <p className="text-sm whitespace-pre-line">{report.body}</p>
                          <p className="text-muted-foreground text-xs">
                            {format.dateTime(report.createdAt, { dateStyle: "long" })}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </>
        ) : (
          <EmptyState icon={Briefcase} title={t("pickTitle")} description={t("pickBody")} />
        )}
      </div>
    </>
  );
}
