import { describe, expect, it } from "vitest";

import {
  MAX_PROFILE_FIELD_CHARS,
  MAX_REPORT_BODY_CHARS,
  PracticeError,
  checkProfile,
  checkReport,
} from "./rules";

const code = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return error instanceof PracticeError ? error.code : String(error);
  }
  return "no error";
};

describe("checkProfile", () => {
  it("keeps what was written, trimmed, and turns blanks into null", () => {
    expect(checkProfile({ trade: "  Bäckerei ", size: "", painPoint: undefined })).toEqual({
      trade: "Bäckerei",
      size: null,
      painPoint: null,
    });
  });

  it("refuses a profile with nothing in it", () => {
    expect(code(() => checkProfile({ trade: " ", size: null, painPoint: 3 }))).toBe("practiceProfileEmpty");
  });

  it("refuses a field over the limit", () => {
    const long = "x".repeat(MAX_PROFILE_FIELD_CHARS + 1);
    expect(code(() => checkProfile({ trade: long, size: null, painPoint: null }))).toBe("practiceFieldTooLong");
  });
});

describe("checkReport", () => {
  const topics = new Set(["was-ki-kann", "ki-telefonassistent"]);
  const ok = { subject: "was-ki-kann", task: "Antwortvorlagen", body: "Ich habe fünf Vorlagen angelegt." };

  it("accepts a report on a known lesson", () => {
    expect(checkReport(ok, topics)).toEqual(ok);
  });

  it("refuses a topic that is not a lesson — the subject is the browser's to change", () => {
    expect(code(() => checkReport({ ...ok, subject: "fremd" }, topics))).toBe("practiceUnknownTopic");
    expect(code(() => checkReport({ ...ok, subject: null }, topics))).toBe("practiceUnknownTopic");
  });

  it("needs both the task and how it went", () => {
    expect(code(() => checkReport({ ...ok, task: " " }, topics))).toBe("practiceTaskMissing");
    expect(code(() => checkReport({ ...ok, body: "" }, topics))).toBe("practiceBodyMissing");
  });

  it("refuses a report over the limit", () => {
    const body = "x".repeat(MAX_REPORT_BODY_CHARS + 1);
    expect(code(() => checkReport({ ...ok, body }, topics))).toBe("practiceBodyTooLong");
  });
});
