// SkillsTable.tsx
import { useState, useMemo } from "react";
import type { Skill } from "../../types/Skills"; // Make sure this type exists
import skills from "../../data/skills";
import { useCharacter } from "../../hooks/useCharacter";
import { getProficiency, signed } from "../../constants/Proficiency";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import { STAT_COLORS } from "../../constants/Stats";
import { STRING_TO_STATKEY } from "../../types/StatKey";
import Tooltip from "../Tooltip";
import armors from "../../data/armors";

export default function SkillsTable() {
  const { character, updateCharacter } = useCharacter();
  const [isAddingLoreSkill, setIsAddingLoreSkill] = useState(false);
  const [newLoreSkillName, setNewLoreSkillName] = useState("");

  // Memoize armor lookup
  const selectedArmor = useMemo(
    () => armors.find((armor) => armor.name === character.armor),
    [character.armor],
  );
  const armorPenalty = selectedArmor?.penalties ?? 0;

  const loreSkills = useMemo(() => {
    return character.loreSkills ?? [];
  }, [character]);

  // ========== HANDLERS (unchanged) ==========
  const addLoreSkill = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const baseName = newLoreSkillName
      .trim()
      .replace(/\s+Lore$/i, "")
      .trim();
    if (!baseName) return;

    const skillName = `${baseName} Lore`;
    if (
      loreSkills.some((name) => name.toLowerCase() === skillName.toLowerCase())
    ) {
      return;
    }

    updateCharacter({
      loreSkills: [...loreSkills, skillName],
      skillProficiencies: {
        ...character.skillProficiencies,
        [skillName]: character.skillProficiencies[skillName] ?? "Trained",
      },
    });
    setNewLoreSkillName("");
    setIsAddingLoreSkill(false);
  };

  const removeLoreSkill = (skillName: string) => {
    const skillProficiencies = { ...character.skillProficiencies };
    delete skillProficiencies[skillName];
    updateCharacter({
      loreSkills: loreSkills.filter((name) => name !== skillName),
      skillProficiencies,
    });
  };

  // ========== MEMOIZED DATA ==========
  // Normalize all skills into a consistent format
  const allSkillsData = useMemo(() => {
    return [
      // Regular skills (from JSON)
      ...skills.map((skill: Skill) => ({
        type: "regular" as const,
        name: skill.name,
        stat: skill.stat,
        armorPenalties: skill.armorPenalties,
      })),
      // Lore skills (strings)
      ...loreSkills.map((name: string) => ({
        type: "lore" as const,
        name,
        stat: "INT",
        armorPenalties: "None",
      })),
    ];
  }, [loreSkills]);

  // Calculate all row data
  const skillRows = useMemo(() => {
    return allSkillsData.map((skill, index) => {
      const isLoreSkill = skill.type === "lore";
      const statKey = STRING_TO_STATKEY[
        skill.stat
      ] as keyof typeof character.baseStats;

      const tierName =
        character.skillProficiencies[skill.name] ??
        (isLoreSkill ? "Trained" : "Untrained");
      const tier = getProficiency(tierName);
      const statValue = character.baseStats[statKey] ?? 0;

      // Armor only applies to regular skills
      const armorApplies =
        !isLoreSkill &&
        selectedArmor &&
        (selectedArmor.type === "Heavy"
          ? skill.armorPenalties === "Light" || skill.armorPenalties === "Heavy"
          : skill.armorPenalties === selectedArmor.type);

      const total = statValue + tier.bonus + (armorApplies ? armorPenalty : 0);

      return {
        skillName: skill.name,
        stat: skill.stat,
        statValue,
        tier,
        total,
        armorApplies,
        armorPenalty,
        index,
        isLoreSkill,
      };
    });
  }, [character, allSkillsData, selectedArmor, armorPenalty]);

  // ========== RENDER ==========
  return (
    <div>
      <table className="w-70 -mt-2 border-collapse rounded-lg">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="px-3 py-2 text-left">Skill</th>
            <th className="px-2 py-2 text-left">Stat</th>
            <th className="px-3 py-2 text-left">Mod</th>
          </tr>
        </thead>
        <tbody>
          {/* ONLY render skillRows - removed the duplicate skills/loreSkills maps */}
          {skillRows.map((row) => (
            <tr
              key={row.skillName}
              className={row.index % 2 === 0 ? "bg-sky-100" : "bg-gray-800"}
              onContextMenu={
                row.isLoreSkill
                  ? (event) => {
                      if (
                        event.target instanceof HTMLElement &&
                        event.target.closest("button")
                      ) {
                        return;
                      }
                      event.preventDefault();
                      removeLoreSkill(row.skillName);
                    }
                  : undefined
              }
            >
              <td
                className={`px-2 ${row.index % 2 === 0 ? "text-gray-700" : "text-gray-200"}`}
                title={
                  row.isLoreSkill
                    ? "Right-click to remove this Lore skill"
                    : undefined
                }
              >
                {row.skillName}
              </td>
              <td
                className={`px-2 py-2 font-semibold ${STAT_COLORS[row.stat] ?? ""}`}
              >
                {row.stat}
              </td>
              <td className="w-20 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ProficiencyMarker
                    skillName={row.skillName}
                    defaultTier={row.isLoreSkill ? "Trained" : undefined}
                  />
                  <Tooltip
                    align="center"
                    content={`${row.stat} ${row.statValue} + ${row.tier.fullName} ${row.tier.bonus}${
                      row.armorApplies
                        ? ` + ${character.armor} ${row.armorPenalty}`
                        : ""
                    }`}
                  >
                    <span
                      className={
                        row.index % 2 === 0 ? "text-gray-700" : "text-gray-200"
                      }
                    >
                      {signed(row.total)}
                    </span>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Lore Skill Form (unchanged) */}
      {isAddingLoreSkill ? (
        <form
          className="mt-3 flex flex-wrap items-center gap-2"
          onSubmit={addLoreSkill}
        >
          <input
            autoFocus
            type="text"
            value={newLoreSkillName}
            onChange={(event) => setNewLoreSkillName(event.target.value)}
            placeholder="Lore skill name"
            aria-label="Lore skill name"
            className="rounded border border-gray-400 px-2 py-1 text-text-black"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1 text-white"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setNewLoreSkillName("");
              setIsAddingLoreSkill(false);
            }}
            className="rounded bg-gray-600 px-3 py-1 text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingLoreSkill(true)}
          className="mt-3 rounded bg-blue-600 px-3 py-1 text-white"
        >
          + Add Lore Skill
        </button>
      )}
    </div>
  );
}
