// Copyright (c) 2026 Digistore24 Inc, St. Petersburg, USA
// SPDX-License-Identifier: MIT

// GENERATED — do not edit. Run `node run.mjs module sync`.
//
// Every installed module's server entry, in the order they were installed.
// Its content is a function of config/modules.json and the manifests under
// modules/. `scripts/modules/generated.test.ts` fails the build when this
// file and those stop agreeing.

import type { ModuleEntry } from "./types";
import api_entry from "@/modules/api/module";
import courses_entry from "@/modules/courses/module";
import activity_entry from "@/modules/activity/module";

export const MODULES: readonly ModuleEntry[] = [
  api_entry,
  courses_entry,
  activity_entry,
];
