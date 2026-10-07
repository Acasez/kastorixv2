// data/gadgets.ts
import type { Gadget, GadgetType } from "../types/Gadgets";
import rawGadgets from "../JSON/gadgets.json";

export const gadgets: Gadget[] = rawGadgets.map((raw) => ({
  ...raw,
  level: Number(raw.level),
  type: raw.type as GadgetType,
}));

export default gadgets;
