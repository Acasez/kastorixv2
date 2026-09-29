// SkillsTable.tsx
import { useState } from "react";
import skills from "../../json/skills.json";
import { useCharacter } from "../../contexts/CharacterContext";
import { getProficiency, signed } from "../../constants/Proficiency";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import { STAT_COLORS } from "../../constants/Stats";
import { STRING_TO_STATKEY } from "../../types/StatKey";
import Tooltip from "../Tooltip";
import armors from "../../JSON/armors.json";

export default function SkillsTable() {
  const { character, updateCharacter } = useCharacter();
  const [isAddingLoreSkill, setIsAddingLoreSkill] = useState(false);
  const [newLoreSkillName, setNewLoreSkillName] = useState("");
  const loreSkills = character.loreSkills ?? [];

  const addLoreSkill = (event: React.FormEvent<HTMLFormElement>) => {
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
          {skills.map((skill, i) => {
            const tierName =
              character.skillProficiencies[skill.name] ?? "Untrained";
            const tier = getProficiency(tierName);
            const statValue =
              character.baseStats[STRING_TO_STATKEY[skill.stat]] ?? 0;
            const selectedArmor = armors.find(
              (armor) => armor.name === character.armor,
            );
            const armorPenalty = Number(selectedArmor?.penalties ?? 0);
            const armorApplies =
              selectedArmor?.type === "Heavy"
                ? skill.armorPenalties === "Light" ||
                  skill.armorPenalties === "Heavy"
                : skill.armorPenalties === selectedArmor?.type;
            const total =
              statValue + tier.bonus + (armorApplies ? armorPenalty : 0);

            return (
              <tr
                key={skill.name}
                className={i % 2 === 0 ? "bg-sky-100" : "bg-gray-800"}
              >
                <td
                  className={`px-2 ${i % 2 === 0 ? "text-gray-700" : "text-gray-200"}`}
                >
                  {skill.name}
                </td>
                <td
                  className={`px-2 py-2 font-semibold ${STAT_COLORS[skill.stat] ?? ""}`}
                >
                  {skill.stat}
                </td>
                <td className="w-20 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <ProficiencyMarker skillName={skill.name} />
                    <Tooltip
                      align="center"
                      content={`${skill.stat} ${statValue} + ${tier.fullName} ${tier.bonus}${armorApplies ? ` + ${character.armor} ${armorPenalty}` : ""}`}
                    >
                      <span
                        className={
                          i % 2 === 0 ? "text-gray-700" : "text-gray-200"
                        }
                      >
                        {signed(total)}
                      </span>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            );
          })}
          {loreSkills.map((skillName, index) => {
            const tierName =
              character.skillProficiencies[skillName] ?? "Trained";
            const tier = getProficiency(tierName);
            const statValue = character.baseStats.INT ?? 0;
            const total = statValue + tier.bonus;
            const rowIndex = skills.length + index;

            return (
              <tr
                key={skillName}
                className={rowIndex % 2 === 0 ? "bg-sky-100" : "bg-gray-800"}
                onContextMenu={(event) => {
                  if (
                    event.target instanceof HTMLElement &&
                    event.target.closest("button")
                  ) {
                    return;
                  }
                  event.preventDefault();
                  removeLoreSkill(skillName);
                }}
              >
                <td
                  className={`px-2 ${rowIndex % 2 === 0 ? "text-gray-700" : "text-gray-200"}`}
                  title="Right-click to remove this Lore skill"
                >
                  {skillName}
                </td>
                <td className="px-2 py-2 font-semibold text-blue-500">INT</td>
                <td className="w-20 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <ProficiencyMarker
                      skillName={skillName}
                      defaultTier="Trained"
                    />
                    <Tooltip
                      align="center"
                      content={`INT ${statValue} + ${tier.fullName} ${tier.bonus}`}
                    >
                      <span
                        className={
                          rowIndex % 2 === 0 ? "text-gray-700" : "text-gray-200"
                        }
                      >
                        {signed(total)}
                      </span>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
