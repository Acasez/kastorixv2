// Add after the imports (around line 7)
import { golemModels } from "../../../data/golemModels";
import type { Golem } from "../../../stores/useCharacterStore";

/**
 * Creates a golem object based on the selected model name
 */
export function createGolemFromModel(modelName: string): Golem | null {
  const selectedModel = golemModels.find((model) => model.name === modelName);

  if (!selectedModel) return null;

  return {
    model: selectedModel.name,
    weapons: selectedModel.naturalWeapons.map((w) => w.name),
    weaponGroups: selectedModel.weaponsProfs
      ? selectedModel.weaponsProfs
          .split(",")
          .map((wg) => wg.trim())
          .filter(Boolean)
      : [],
    health: { current: 10, max: 10 },
    actions: [],
    upgrades: [],
    baseStats: {
      PHY: selectedModel.phy,
      DEX: selectedModel.dex,
      INT: selectedModel.int,
      WIL: selectedModel.wil,
    },
  };
}
