// The guided task's rules, pure — what an owner may write about their business
// and about how they put a task into practice. Codes, never sentences: the page
// translates them (CLAUDE.md → Languages).

export const MAX_PROFILE_FIELD_CHARS = 200;
export const MAX_REPORT_TASK_CHARS = 300;
export const MAX_REPORT_BODY_CHARS = 4000;

export type PracticeErrorCode =
  | "practiceProfileEmpty"
  | "practiceFieldTooLong"
  | "practiceTaskMissing"
  | "practiceBodyMissing"
  | "practiceTaskTooLong"
  | "practiceBodyTooLong"
  | "practiceUnknownTopic";

export class PracticeError extends Error {
  constructor(public readonly code: PracticeErrorCode) {
    super(code);
  }
}

export interface ProfileInput {
  trade: string | null;
  size: string | null;
  painPoint: string | null;
}

const clean = (value: unknown): string | null => {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? null : text;
};

/** Every field optional, but not all three empty — an empty profile is no profile. */
export function checkProfile(raw: { trade: unknown; size: unknown; painPoint: unknown }): ProfileInput {
  const profile = { trade: clean(raw.trade), size: clean(raw.size), painPoint: clean(raw.painPoint) };
  if (!profile.trade && !profile.size && !profile.painPoint) throw new PracticeError("practiceProfileEmpty");
  for (const value of Object.values(profile)) {
    if (value && value.length > MAX_PROFILE_FIELD_CHARS) throw new PracticeError("practiceFieldTooLong");
  }
  return profile;
}

export interface ReportInput {
  subject: string;
  task: string;
  body: string;
}

/** `topics` is the set of lesson slugs a report may hang on. */
export function checkReport(
  raw: { subject: unknown; task: unknown; body: unknown },
  topics: ReadonlySet<string>,
): ReportInput {
  const subject = clean(raw.subject);
  if (!subject || !topics.has(subject)) throw new PracticeError("practiceUnknownTopic");
  const task = clean(raw.task);
  const body = clean(raw.body);
  if (!task) throw new PracticeError("practiceTaskMissing");
  if (!body) throw new PracticeError("practiceBodyMissing");
  if (task.length > MAX_REPORT_TASK_CHARS) throw new PracticeError("practiceTaskTooLong");
  if (body.length > MAX_REPORT_BODY_CHARS) throw new PracticeError("practiceBodyTooLong");
  return { subject, task, body };
}
