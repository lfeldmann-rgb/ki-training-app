// The milestones on the way to KI-Praxis's activation event — read for the
// dashboard's "Deine ersten Schritte" (docs/onboarding.md §2).
//
// Every answer is a QUERY against real state, never a stored tick
// (lib/onboarding/rules.ts says why): a deleted profile or report opens its
// step again by itself.
//
// The order is the path to the event: lesson 1 done → the business described →
// the first task put into practice and written down. The last one IS the
// activation event (docs/app.md → Activation).
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { coursesCompletions, practiceProfiles, practiceReports } from "@/db/schema";

import { practiceTopics } from "./manage";

export interface PracticeMilestones {
  /** The course's first lesson, for the step's link — null with no course content. */
  firstLesson: { slug: string; title: string } | null;
  firstLessonDone: boolean;
  profileSaved: boolean;
  firstReportSaved: boolean;
}

export async function practiceMilestones(memberId: string): Promise<PracticeMilestones> {
  const [topics, profile, report] = await Promise.all([
    practiceTopics(),
    db
      .select({ memberId: practiceProfiles.memberId })
      .from(practiceProfiles)
      .where(eq(practiceProfiles.memberId, memberId))
      .limit(1),
    db
      .select({ id: practiceReports.id })
      .from(practiceReports)
      .where(eq(practiceReports.memberId, memberId))
      .limit(1),
  ]);
  const firstLesson = topics[0] ?? null;
  const done = firstLesson
    ? await db
        .select({ slug: coursesCompletions.unitSlug })
        .from(coursesCompletions)
        .where(
          and(eq(coursesCompletions.memberId, memberId), eq(coursesCompletions.unitSlug, firstLesson.slug)),
        )
        .limit(1)
    : [];
  return {
    firstLesson,
    firstLessonDone: done.length > 0,
    profileSaved: profile.length > 0,
    firstReportSaved: report.length > 0,
  };
}
