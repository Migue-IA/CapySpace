import { createDojoConfig } from "@dojoengine/core";

import manifest from "../new/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
