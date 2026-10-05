// src/hooks/useCreature.ts
import { useCreatureStore, type Creature } from "../stores/useCreatureStore";

export function useCreature(blockId: number) {
  const { creatures, setCreature, updateCreature, resetCreature } =
    useCreatureStore();

  // Ensure creature exists for this blockId
  const creature =
    creatures[blockId] || useCreatureStore.getState().getCreature(blockId);

  return {
    creature,
    setCreature: (c: Creature) => setCreature(blockId, c),
    updateCreature: (patch: Partial<Creature>) =>
      updateCreature(blockId, patch),
    resetCreature: () => resetCreature(blockId),
  };
}
