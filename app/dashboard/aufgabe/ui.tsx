"use client";

// The guided task's two forms. Pending state through useActionState, the
// result through useActionToast — the page's Callouts carry what must stay.
import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionToast, type ActionState } from "@/hooks/use-action-toast";
import {
  MAX_PROFILE_FIELD_CHARS,
  MAX_REPORT_BODY_CHARS,
  MAX_REPORT_TASK_CHARS,
} from "@/lib/practice/rules";

import { addReportAction, saveProfileAction } from "./actions";

const EMPTY: ActionState = { error: null, ok: null };

export function ProfileForm({
  initial,
}: {
  initial: { trade: string | null; size: string | null; painPoint: string | null } | null;
}) {
  const t = useTranslations("practice");
  const [state, action, pending] = useActionState(saveProfileAction, EMPTY);
  useActionToast(state);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="trade">{t("profileTrade")}</Label>
        <Input
          id="trade"
          name="trade"
          defaultValue={initial?.trade ?? ""}
          placeholder={t("profileTradeExample")}
          maxLength={MAX_PROFILE_FIELD_CHARS}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="size">{t("profileSize")}</Label>
        <Input
          id="size"
          name="size"
          defaultValue={initial?.size ?? ""}
          placeholder={t("profileSizeExample")}
          maxLength={MAX_PROFILE_FIELD_CHARS}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="painPoint">{t("profilePain")}</Label>
        <Input
          id="painPoint"
          name="painPoint"
          defaultValue={initial?.painPoint ?? ""}
          placeholder={t("profilePainExample")}
          maxLength={MAX_PROFILE_FIELD_CHARS}
        />
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {initial ? t("profileUpdate") : t("profileSave")}
        </Button>
      </div>
    </form>
  );
}

export function ReportForm({ subject }: { subject: string }) {
  const t = useTranslations("practice");
  const [state, action, pending] = useActionState(addReportAction, EMPTY);
  useActionToast(state);
  const form = useRef<HTMLFormElement>(null);
  // A saved report clears the form — the report itself is listed below.
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="flex flex-col gap-4">
      <input type="hidden" name="subject" value={subject} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="task">{t("reportTask")}</Label>
        <Input id="task" name="task" required maxLength={MAX_REPORT_TASK_CHARS} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="body">{t("reportBody")}</Label>
        <Textarea id="body" name="body" required rows={5} maxLength={MAX_REPORT_BODY_CHARS} />
        <p className="text-muted-foreground text-sm">{t("reportHint")}</p>
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {t("reportSave")}
        </Button>
      </div>
    </form>
  );
}
