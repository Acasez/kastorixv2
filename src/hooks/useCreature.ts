import { useCreatureStore } from "../stores/useCreatureStore";

export function useCreature() {
  const { creature, setCreature, updateCreature } = useCreatureStore();
  return { creature, setCreature, updateCreature };
}
