import { useCallback, useEffect, useMemo } from "react";
import { useCharacter } from "../../../hooks/useCharacter";
import golemModels from "../../../data/golemModels";
import golemUpgrades from "../../../data/golemUpgrades";
import TrackBar from "../../CommonCreatureComponents/TrackBar";
import type { Golem, Track } from "../../../stores/useCharacterStore";
import type { GolemModel } from "../../../types/Golems";

export default function GolemSection() {
  const { character } = useCharacter();

  const golem = character.golem;

  if (!golem) return null;

  const model = golemModels.find(
    (golemModel) => golemModel.name === golem.model,
  );

  if (!model) return null;

  return <GolemPanel initialGolem={golem} golemModel={model} />;
}

interface GolemPanelProps {
  initialGolem: Golem;
  golemModel: GolemModel;
}

function GolemPanel({ initialGolem, golemModel }: GolemPanelProps) {
  const { character, updateCharacter } = useCharacter();
  const golem = character.golem ?? initialGolem;

  const selectedUpgrades = golemUpgrades.filter((upgrade) =>
    golem.upgrades.includes(upgrade.name),
  );

  const healthMultiplier = Math.max(
    3,
    ...selectedUpgrades.map((upgrade) => Number(upgrade.healthBase) || 0),
  );

  const healthIncreaseValues: Record<string, number> = {
    PHY: golem.baseStats.PHY,
    INT: character.baseStats.INT,
    LEVEL: character.level,
  };
  const healthIncrease = selectedUpgrades.reduce((total, upgrade) => {
    const value = upgrade.healthIncrease.trim().toUpperCase();
    const increase = healthIncreaseValues[value] ?? Number(value);
    return total + (Number.isFinite(increase) ? increase : 0);
  }, 0);

  const maxGolemHealth = Math.max(
    1,
    healthMultiplier * character.level +
      character.baseStats.INT +
      golem.baseStats.PHY +
      healthIncrease,
  );

  const updateGolem = useCallback(
    (patch: Partial<Golem>) =>
      updateCharacter({ golem: { ...golem, ...patch } }),
    [golem, updateCharacter],
  );

  const golemHealth: Track = useMemo(
    () => ({
      current: Math.min(golem.health.current, maxGolemHealth),
      max: maxGolemHealth,
    }),
    [golem.health, maxGolemHealth],
  );

  useEffect(() => {
    if (
      golem.health.max !== golemHealth.max ||
      golem.health.current !== golemHealth.current
    ) {
      updateGolem({ health: golemHealth });
    }
  }, [golem, golemHealth, updateGolem]);

  return (
    <div className="p-4 text-white">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-500 pb-3">
        <div>
          <h1 className="text-2xl font-bold">{golemModel.name} Golem</h1>
          <p className="mt-1 text-gray-300">{golemModel.description}</p>
        </div>
        <div className="min-w-64 flex-1 sm:max-w-md">
          <TrackBar
            label="Health"
            color="bg-health"
            track={golemHealth}
            maxEditable={false}
            onChange={(newHealth) => updateGolem({ health: newHealth })}
          />
        </div>
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Statistics</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-y border-gray-600 py-3 sm:grid-cols-4">
          {[
            ["PHY", golemModel.phy],
            ["DEX", golemModel.dex],
            ["INT", golemModel.int],
            ["WIL", golemModel.wil],
            ["Skills", golemModel.skills],
            ["Saves", golemModel.saves],
            ["Weapon Proficiencies", golemModel.weaponsProfs],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-gray-400">{label}</dt>
              <dd className="font-medium">{value || "-"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Features & Upgrades</h2>
          {golemModel.featureOne && (
            <div className="border-b border-gray-600 py-2">
              <h3 className="font-semibold">{golemModel.featureOne}</h3>
              <p className="whitespace-pre-line text-gray-300">
                {golemModel.featureOneDesc}
              </p>
            </div>
          )}
          {selectedUpgrades.map((upgrade) => (
            <div key={upgrade.name} className="border-b border-gray-600 py-2">
              <h3 className="font-semibold">{upgrade.name}</h3>
              <p className="whitespace-pre-line text-gray-300">
                {upgrade.description}
              </p>
            </div>
          ))}
          {!golemModel.featureOne && selectedUpgrades.length === 0 && (
            <p className="text-gray-400">No model features or upgrades.</p>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-lg font-semibold">Strikes & Attacks</h2>
          </div>
        </section>
      </div>
    </div>
  );
}
