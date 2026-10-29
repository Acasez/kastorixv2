import type { Background } from "../types/Feats";
import rawBackgrounds from "../JSON/backgrounds.json";
import { lookupGeneralFeat } from "./generalFeats";

export const backgrounds: Background[] = rawBackgrounds.map((raw) => {
  return {
    ...raw,
    generalFeat: lookupGeneralFeat(raw.generalFeat) ?? null,
  };
});

export default backgrounds;
