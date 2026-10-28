// Copyright (c) 2026 Digistore24 Inc, St. Petersburg, USA
// SPDX-License-Identifier: MIT

// GENERATED — do not edit. Run `node run.mjs module sync`.
//
// What each installed module puts into the core's named page slots.
// Its content is a function of config/modules.json and the manifests under
// modules/. `scripts/modules/generated.test.ts` fails the build when this
// file and those stop agreeing.

import type { ModuleSlotEntry } from "./slots";
import api_account_slot from "@/modules/api/components/account-card";

export const MODULE_SLOTS: readonly ModuleSlotEntry[] = [
  { module: "api", slot: "account", Component: api_account_slot },
];
