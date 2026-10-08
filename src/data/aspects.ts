// data/aspects.ts
import type { Aspect, AspectType } from "../types/Spells";
import rawAspects from "../JSON/aspects.json";

export const aspects: Aspect[] = rawAspects.map((raw) => ({
  ...raw,
  type: raw.type as AspectType,
  opposite: raw.opposite ? aspectsByName[raw.opposite] || null : null,
}));

export default aspects;

export const aspectsByName: Record<string, Aspect> = Object.fromEntries(
  aspects.map((a) => [a.name, a]),
);
