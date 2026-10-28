"use server";

// The guided task's two writes: the owner's business profile and a report on
// how they put a task into practice.
//
// 🚨 Both open with `requireActiveUser()`, take the member id off the session
// and never out of the form, and ask `hasPlan()` before they write — a server
// action is a public HTTP endpoint (app/action-guard-presence.test.ts).
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

import type { ActionState } from "@/hooks/use-action-toast";
import { requireActiveUser } from "@/lib/authz";
import { hasPlan } from "@/lib/entitlements/manage";
import { addReport, practiceTopics, saveProfile } from "@/lib/practice/manage";
import { PracticeError, checkProfile, checkReport } from "@/lib/practice/rules";

const PAGE = "/dashboard/aufgabe";
const PLAN = "ki_praxis";

async function toState(error: unknown): Promise<ActionState> {
  const t = await getTranslations("practice");
  if (error instanceof PracticeError) return { error: t(`errors.${error.code}`), ok: null };
  throw error;
}

export async function saveProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireActiveUser();
  const t = await getTranslations("practice");
  if (!(await hasPlan(session.user.id, PLAN))) return { error: t("errors.practiceNoAccess"), ok: null };
  try {
    const profile = checkProfile({
      trade: formData.get("trade"),
      size: formData.get("size"),
      painPoint: formData.get("painPoint"),
    });
    await saveProfile(session.user.id, profile);
    revalidatePath(PAGE);
    return { error: null, ok: t("profileSaved") };
  } catch (error) {
    return toState(error);
  }
}

export async function addReportAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireActiveUser();
  const t = await getTranslations("practice");
  if (!(await hasPlan(session.user.id, PLAN))) return { error: t("errors.practiceNoAccess"), ok: null };
  try {
    const topics = new Set((await practiceTopics()).map((topic) => topic.slug));
    const report = checkReport(
      { subject: formData.get("subject"), task: formData.get("task"), body: formData.get("body") },
      topics,
    );
    await addReport(session.user.id, report);
    revalidatePath(PAGE);
    return { error: null, ok: t("reportSaved") };
  } catch (error) {
    return toState(error);
  }
}
