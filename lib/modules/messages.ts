// Copyright (c) 2026 Digistore24 Inc, St. Petersburg, USA
// SPDX-License-Identifier: MIT

// GENERATED — do not edit. Run `node run.mjs module sync`.
//
// Every installed module's texts, merged into the core catalogue per locale.
// Its content is a function of config/modules.json and the manifests under
// modules/. `scripts/modules/generated.test.ts` fails the build when this
// file and those stop agreeing.

import { mergeModuleMessages } from "./messages-merge";
import api_de from "@/modules/api/messages/de.json";
import api_en from "@/modules/api/messages/en.json";
import api_es from "@/modules/api/messages/es.json";
import api_fr from "@/modules/api/messages/fr.json";
import courses_de from "@/modules/courses/messages/de.json";
import courses_en from "@/modules/courses/messages/en.json";
import courses_es from "@/modules/courses/messages/es.json";
import courses_fr from "@/modules/courses/messages/fr.json";
import activity_de from "@/modules/activity/messages/de.json";
import activity_en from "@/modules/activity/messages/en.json";
import activity_es from "@/modules/activity/messages/es.json";
import activity_fr from "@/modules/activity/messages/fr.json";
import companion_de from "@/modules/companion/messages/de.json";
import companion_en from "@/modules/companion/messages/en.json";
import companion_es from "@/modules/companion/messages/es.json";
import companion_fr from "@/modules/companion/messages/fr.json";

export const MODULE_MESSAGES: Record<string, Record<string, unknown>> = {
  de: [api_de, courses_de, activity_de, companion_de].reduce(mergeModuleMessages, {}),
  en: [api_en, courses_en, activity_en, companion_en].reduce(mergeModuleMessages, {}),
  es: [api_es, courses_es, activity_es, companion_es].reduce(mergeModuleMessages, {}),
  fr: [api_fr, courses_fr, activity_fr, companion_fr].reduce(mergeModuleMessages, {}),
};
