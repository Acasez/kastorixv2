import rawGolemModels from "../JSON/golem_models.json";
import type { GolemModel } from "../types/Golems";
import { parseResistances, parseSpeeds } from "../utils/parseNamedUtils";
import { lookupWeapons } from "./weapons";

export const golemModels: GolemModel[] = rawGolemModels.map((raw) => {
  return {
    ...raw,
    phy: Number(raw.phy),
    dex: Number(raw.dex),
    int: Number(raw.int),
    wil: Number(raw.wil),
    resistances: parseResistances(raw.resistances),
    speeds: parseSpeeds(raw.speeds),
    naturalWeapons: lookupWeapons(raw.naturalWeapons),
  };
});

export default golemModels;
