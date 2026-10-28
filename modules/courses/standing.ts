// Copyright (c) 2026 Digistore24 Inc, St. Petersburg, USA
// SPDX-License-Identifier: MIT

// Where a member stands in each course — the one computation behind the course
// list and the app's own overview card.
//
// 🚨 **One computation, two pages.** `/dashboard/course` built this inline; the
// overview (`app/dashboard/page.tsx`) needs the same "4 of 5, next: …" answer,
// and two copies are two places for the shape argument to `unitRefs()` to be
// forgotten (rules.ts says what that costs). It reaches the overview through
// `lib/modules/server-exports.ts`, never by an import from `@/modules/…`.
//
// 🚨 `standing` is null for a course the member does NOT hold, and the outline
// query never runs for it — the list page's header says why: a lesson count on
// an unbought course is inside knowledge.
import type { Course } from "./lib/courses";
import { courseAccessFor } from "./lib/access";
import { usableCourses } from "./lib/courses";
import { completedSlugsFor, courseOutline } from "./lib/manage";
import { nextUnit, progress, unitRefs, type UnitRef } from "./rules";

export interface CourseStanding {
  course: Course;
  entitled: boolean;
  asOperator: boolean;
  // `percent` is rules.ts → progress(), so a page outside the module never
  // re-derives it.
  standing: { done: number; total: number; percent: number; next: UnitRef | null } | null;
}

export async function courseStandingsFor(
  memberId: string,
  role: string | null,
): Promise<CourseStanding[]> {
  const courses = await usableCourses();
  const completed = await completedSlugsFor(memberId);
  const now = new Date();
  return Promise.all(
    courses.map(async (course) => {
      const access = await courseAccessFor(memberId, role, course);
      if (!access.entitled) {
        return { course, entitled: false, asOperator: access.asOperator, standing: null };
      }
      const blocks = await courseOutline(course.id);
      const units = unitRefs(blocks, access.startedAt, course.shape!, now);
      const done = units.filter((unit) => completed.has(unit.slug)).length;
      return {
        course,
        entitled: true,
        asOperator: access.asOperator,
        standing: {
          done,
          total: units.length,
          percent: progress(done, units.length),
          next: nextUnit(units, completed),
        },
      };
    }),
  );
}
