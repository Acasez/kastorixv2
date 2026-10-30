import { useEffect } from "react";
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

  return <GolemPanel golem={character.golem} golemModel={model} />;
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

  const golemHealth: Track = {
    current: Math.min(golem.health.current, maxGolemHealth),
    max: maxGolemHealth,
  };

  useEffect(() => {
    if (
      golem.health.max !== golemHealth.max ||
      golem.health.current !== golemHealth.current
    ) {
      updateCharacter({
        golem: {
          ...golem,
          health: golemHealth,
        },
      });
    }
  }, [golem, golemHealth, updateCharacter]);

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
            ["PHY", golemModel.phy],
            ["DEX", golemModel.dex],
            ["INT", golemModel.int],
            ["WIL", golemModel.wil],
            ["Physical Resistance", golemModel.resistances],
            ["Speed", golemModel.speeds],
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
        {weaponGroupSlots > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-300">
              Weapon groups ({character.golemWeaponGroups.length}/
              {weaponGroupSlots})
            </span>
            {character.golemWeaponGroups.map((group) => (
              <button
                type="button"
                key={group}
                title={`Remove ${group} proficiency`}
                onClick={() =>
                  updateCharacter({
                    golemWeaponGroups: character.golemWeaponGroups.filter(
                      (selectedGroup) => selectedGroup !== group,
                    ),
                    golemWeapons: character.golemWeapons.filter(
                      (weaponName) => {
                        const weapon = weapons.find(
                          (item) => item.name === weaponName,
                        );
                        return weapon?.weaponGroup !== group;
                      },
                    ),
                  })
                }
                className="rounded border border-gray-500 px-2 py-1 text-sm hover:border-gray-300"
              >
                {group} ×
              </button>
            ))}
            {character.golemWeaponGroups.length < weaponGroupSlots && (
              <select
                key={character.golemWeaponGroups.length}
                defaultValue=""
                aria-label="Add golem weapon group proficiency"
                onChange={(event) => {
                  const group = event.target.value;
                  if (group && !character.golemWeaponGroups.includes(group)) {
                    updateCharacter({
                      golemWeaponGroups: [
                        ...character.golemWeaponGroups,
                        group,
                      ],
                    });
                  }
                }}
                className="rounded border border-gray-400 bg-white px-2 py-1 text-sm text-gray-900"
              >
                <option value="">Add weapon group</option>
                {weaponGroups
                  .filter(
                    (group) => !character.golemWeaponGroups.includes(group),
                  )
                  .map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
              </select>
            )}
          </div>
        )}
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
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-lg font-semibold">Strikes & Attacks</h2>
            {(includedTypes.length > 0 || includedWeaponGroups.length > 0) && (
              <button
                type="button"
                className="rounded border border-white px-2 py-0.5 text-lg leading-none hover:bg-gray-600"
                onClick={() => openGolemWeaponModal()}
                aria-label="Add weapon to golem"
              >
                +
              </button>
            )}
          </div>
          {allGolemStrikes.map((weapon) => {
            const isAddedWeapon = character.golemWeapons.includes(weapon.name);
            return (
              <WeaponComponent
                key={weapon.name}
                weapon={weapon}
                fixedProficiency="Trained"
                creatureStats={modelStats}
                onReplaceWeapon={
                  isAddedWeapon ? openGolemWeaponModal : undefined
                }
                onRemoveWeapon={isAddedWeapon ? removeGolemWeapon : undefined}
              />
            );
          })}
          {allGolemStrikes.length === 0 && (
            <p className="text-gray-400">No strikes or attacks listed.</p>
          )}
          {golemActions.length > 0 && (
            <div className="mt-5 border-t border-gray-600 pt-4">
              <h3 className="mb-2 text-lg font-semibold">Golem Actions</h3>
              {golemActions.map((action) => (
                <ActionBox key={action} action={action} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
