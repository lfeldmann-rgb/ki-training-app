// The guided task's database half — the owner's business profile, their
// reports, and the lessons a task may hang on.
//
// 🚨 Every function takes the member id from its CALLER, and every caller is a
// server action or page that read it off the session (`requireActiveUser()`)
// or the companion's `load()`, which the companion module hands the session's
// id. None of them ever takes an id out of a form.
import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  coursesBlocks,
  coursesCourses,
  coursesUnits,
  practiceProfiles,
  practiceReports,
} from "@/db/schema";

import type { ProfileInput, ReportInput } from "./rules";

/** The course whose lessons are the guided task's topics. */
export const PRACTICE_COURSE_SLUG = "ki-praxis";

export interface PracticeTopic {
  slug: string;
  title: string;
}

/** The course's lessons in reading order — the topics a task can be about. */
export async function practiceTopics(): Promise<PracticeTopic[]> {
  return db
    .select({ slug: coursesUnits.slug, title: coursesUnits.title })
    .from(coursesUnits)
    .innerJoin(coursesBlocks, eq(coursesUnits.blockId, coursesBlocks.id))
    .innerJoin(coursesCourses, eq(coursesBlocks.courseId, coursesCourses.id))
    .where(eq(coursesCourses.slug, PRACTICE_COURSE_SLUG))
    .orderBy(asc(coursesBlocks.position), asc(coursesUnits.position));
}

export async function profileFor(memberId: string) {
  const [row] = await db
    .select({
      trade: practiceProfiles.trade,
      size: practiceProfiles.size,
      painPoint: practiceProfiles.painPoint,
    })
    .from(practiceProfiles)
    .where(eq(practiceProfiles.memberId, memberId));
  return row ?? null;
}

export async function saveProfile(memberId: string, input: ProfileInput): Promise<void> {
  await db
    .insert(practiceProfiles)
    .values({ memberId, ...input, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: practiceProfiles.memberId,
      set: { ...input, updatedAt: new Date() },
    });
}

export async function addReport(memberId: string, input: ReportInput): Promise<void> {
  await db.insert(practiceReports).values({ memberId, ...input });
}

/** This member's reports, newest first — on one topic, or all of them. */
export async function reportsFor(memberId: string, subject?: string, limit = 20) {
  return db
    .select({
      id: practiceReports.id,
      subject: practiceReports.subject,
      task: practiceReports.task,
      body: practiceReports.body,
      createdAt: practiceReports.createdAt,
    })
    .from(practiceReports)
    .where(
      subject
        ? and(eq(practiceReports.memberId, memberId), eq(practiceReports.subject, subject))
        : eq(practiceReports.memberId, memberId),
    )
    .orderBy(desc(practiceReports.createdAt))
    .limit(limit);
}
