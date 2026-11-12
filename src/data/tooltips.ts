// data/tooltips.ts
import rawTooltips from "../JSON/tooltips.json";
import type { Tooltip } from "../types/tooltip";

export const tooltips: Tooltip[] = rawTooltips.map((raw) => ({
  ...raw,
}));

export default tooltips;
