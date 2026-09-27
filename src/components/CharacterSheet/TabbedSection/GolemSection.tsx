import { useEffect } from "react";
import { useCharacter } from "../../../contexts/CharacterContext";
import TrackBar from "../../TrackBar";
import golemModels from "../../../JSON/golem_models.json";
import golemUpgrades from "../../../JSON/golem_upgrades.json";
import weapons from "../../../JSON/weapons.json";

export default function GolemSection() {
  const { character, updateCharacter } = useCharacter();
  const model = golemModels.find(
    (golemModel) => golemModel.name === character.golemModel,
  );
  const selectedUpgrades = Object.entries(character.selections).flatMap(
    ([selectionKey, selectedName]) => {
      const upgrade = golemUpgrades.find((item) => item.name === selectedName);
      return upgrade ? [{ ...upgrade, selectionKey }] : [];
    },
  );
  const selectedUpgradeNames = new Set(
    selectedUpgrades.map((upgrade) => upgrade.name),
  );
  const healthMultiplier = selectedUpgradeNames.has("War Walker")
    ? 5
    : selectedUpgradeNames.has("Size-Up Golem")
      ? 4
      : 3;
  const modelPhy = Number(model?.phy ?? 0);
  const maxGolemHealth = Math.max(
    1,
    healthMultiplier * character.level +
      character.baseStats.INT +
      modelPhy +
      (selectedUpgradeNames.has("Reinforced Armor") ? modelPhy : 0),
  );

  useEffect(() => {
    if (!model) return;

    const current = Math.min(character.golemHealth.current, maxGolemHealth);
    if (
      character.golemHealth.max !== maxGolemHealth ||
      character.golemHealth.current !== current
    ) {
      updateCharacter({
        golemHealth: { current, max: maxGolemHealth },
      });
    }
  }, [character.golemHealth, maxGolemHealth, model, updateCharacter]);

  if (!model) {
    return null;
  }

  const golemHealth = {
    current: Math.min(character.golemHealth.current, maxGolemHealth),
    max: maxGolemHealth,
  };
  const naturalStrike = weapons.find(
    (weapon) => weapon.type === "Golem" && weapon.name === model.naturalWeapon,
  );
  const additionalStrikeUpgrades = selectedUpgrades.filter((upgrade) =>
    [
      "Ballista",
      "Battlefield Stomp",
      "Fire Capacitor",
      "Frost Capacitor",
      "Lightning Capacitor",
      "Tail Strike",
    ].includes(upgrade.name),
  );

  return (
    <div className="p-4 text-white">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-500 pb-3">
        <div>
          <h1 className="text-2xl font-bold">{model.name} Golem</h1>
          <p className="mt-1 text-gray-300">{model.description}</p>
        </div>
        <div className="min-w-64 flex-1 sm:max-w-md">
          <TrackBar
            label="Health"
            color="#dc2626"
            track={golemHealth}
            maxEditable={false}
            onChange={(golemHealth) => updateCharacter({ golemHealth })}
          />
        </div>
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Statistics</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-y border-gray-600 py-3 sm:grid-cols-4">
          {[
            ["PHY", model.phy],
            ["DEX", model.dex],
            ["INT", model.int],
            ["WIL", model.wil],
            ["Physical Resistance", model.resistances],
            ["Speed", model.speeds],
            ["Skills", model.skills],
            ["Saves", model.saves],
            ["Weapons", model.weapons],
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
          {model.featureOne && (
            <div className="border-b border-gray-600 py-2">
              <h3 className="font-semibold">{model.featureOne}</h3>
              <p className="whitespace-pre-line text-gray-300">
                {model.featureOneDesc}
              </p>
            </div>
          )}
          {selectedUpgrades.map((upgrade) => (
            <div
              key={upgrade.selectionKey}
              className="border-b border-gray-600 py-2"
            >
              <h3 className="font-semibold">{upgrade.name}</h3>
              <p className="whitespace-pre-line text-gray-300">
                {upgrade.description}
              </p>
            </div>
          ))}
          {!model.featureOne && selectedUpgrades.length === 0 && (
            <p className="text-gray-400">No model features or upgrades.</p>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Strikes & Attacks</h2>
          {naturalStrike && (
            <div className="border-b border-gray-600 py-2">
              <h3 className="font-semibold">{naturalStrike.name}</h3>
              <p className="text-gray-300">
                {naturalStrike.dice} {naturalStrike.damageType}, range{" "}
                {naturalStrike.range}
                {naturalStrike.traits && `, ${naturalStrike.traits}`}
              </p>
              {model.naturalWeaponDesc && (
                <p className="whitespace-pre-line text-gray-300">
                  {model.naturalWeaponDesc}
                </p>
              )}
            </div>
          )}
          {additionalStrikeUpgrades.map((upgrade) => (
            <div
              key={upgrade.selectionKey}
              className="border-b border-gray-600 py-2"
            >
              <h3 className="font-semibold">{upgrade.name}</h3>
              <p className="whitespace-pre-line text-gray-300">
                {upgrade.description}
              </p>
            </div>
          ))}
          {!naturalStrike && additionalStrikeUpgrades.length === 0 && (
            <p className="text-gray-400">No strikes or attacks listed.</p>
          )}
        </section>
      </div>
    </div>
  );
}
