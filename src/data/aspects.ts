// data/aspects.ts
import type { Aspect, AspectType } from "../types/Spells";
import rawAspects from "../JSON/aspects.json";

// Step 1: Create all aspect objects in a map (opposite is null for now)
const aspectObjects: Record<string, Aspect> = {};

for (const raw of rawAspects) {
  aspectObjects[raw.name] = {
    name: raw.name,
    type: raw.type as AspectType,
    attuneable: raw.attuneable,
    opposite: null,
    basicMagic: raw.basicMagic,
    aura: raw.aura,
    infusion: raw.infusion,
    elementalization: raw.elementalization,
  };
}

// Step 2: Now that all objects exist, resolve opposite references
for (const raw of rawAspects) {
  const aspect = aspectObjects[raw.name];
  if (raw.opposite) {
    aspect.opposite = aspectObjects[raw.opposite] || null;
  }
}

export const aspects: Aspect[] = Object.values(aspectObjects);
export const aspectsByName: Record<string, Aspect> = aspectObjects;
export default aspects;
