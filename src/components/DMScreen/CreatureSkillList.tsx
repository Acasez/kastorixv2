import { useState } from "react";
import {
  getProficiency,
  signed,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import skills from "../../data/skills";
import armors from "../../data/armors";
import { useCreature } from "../../hooks/useCreature";
import { STRING_TO_STATKEY } from "../../types/StatKey";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import CreatureHeader from "./CreatureHeader";

const skillNames = skills.map(({ name }) => name);

type CreatureSkillListProps = {
  blockId: number;
};

export default function CreatureSkillList({ blockId }: CreatureSkillListProps) {
  const { creature, updateCreature } = useCreature(blockId);
  const selectedArmor = armors.find((armor) => armor.name === creature.armor);
  const armorPenalty = selectedArmor?.penalties ?? 0;
  const [isAdding, setIsAdding] = useState(false);
  const selectedSkills = skillNames.filter((name) => name in creature.skills);
  const availableSkills = skillNames.filter(
    (name) => !(name in creature.skills),
  );

  const addSkill = (skillName: string) => {
    if (!availableSkills.includes(skillName)) return;
    updateCreature({
      skills: { ...creature.skills, [skillName]: "Trained" },
    });
    setIsAdding(false);
  };

  const changeSkill = (currentName: string, nextName: string) => {
    if (currentName === nextName || nextName in creature.skills) return;
    const nextSkills = { ...creature.skills };
    const proficiency = nextSkills[currentName] ?? "Untrained";
    delete nextSkills[currentName];
    nextSkills[nextName] = proficiency;
    updateCreature({ skills: nextSkills });
  };

  const removeSkill = (skillName: string) => {
    const nextSkills = { ...creature.skills };
    delete nextSkills[skillName];
    updateCreature({ skills: nextSkills });
  };

  return (
    <section className="py-2">
      <div className="flex flex-row justify-center">
        <div className="w-full">
          <CreatureHeader title="Skills" />
        </div>
        <div className="relative">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
            onClick={() => setIsAdding((open) => !open)}
            disabled={availableSkills.length === 0}
            aria-label="Add skill"
            title={isAdding ? "Cancel adding skill" : "Add skill"}
            aria-expanded={isAdding}
          >
            +
          </button>
          {isAdding && (
            <div
              role="listbox"
              aria-label="Choose skill to add"
              className="absolute -left-20 top-full z-30 mt-1 max-h-[60vh] w-48 overflow-y-auto rounded-lg border border-gray-600 bg-gray-700 py-1 shadow-lg"
            >
              {availableSkills.map((skillName) => (
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  key={skillName}
                  onClick={() => addSkill(skillName)}
                  className="w-full px-4 py-2 text-left text-sm text-text-light hover:bg-gray-600 focus-visible:bg-gray-600 focus-visible:outline-none"
                >
                  {skillName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {selectedSkills.map((skillName) => {
          const skill = skills.find(({ name }) => name === skillName);
          if (!skill) return null;

          const stat = STRING_TO_STATKEY[skill.stat];
          const proficiency: ProficiencyTierName =
            creature.skills[skillName] ?? "Untrained";
          const tier = getProficiency(proficiency);
          const armorApplies =
            selectedArmor?.type === "Heavy"
              ? skill.armorPenalties === "Light" ||
                skill.armorPenalties === "Heavy"
              : skill.armorPenalties === selectedArmor?.type;
          const bonus =
            creature.stats[stat] +
            tier.bonus +
            (armorApplies ? armorPenalty : 0);

          return (
            <div
              className="relative inline-flex items-center gap-2 rounded border border-stone-600 bg-stone-800 p-2 pr-3"
              key={skillName}
            >
              <label>
                <span className="sr-only">Select skill</span>
                <select
                  aria-label="Select skill"
                  value={skillName}
                  onChange={(event) =>
                    changeSkill(skillName, event.target.value)
                  }
                  className="h-8 max-w-30 rounded border border-stone-500 bg-stone-900 px-1 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                >
                  {skillNames
                    .filter(
                      (name) =>
                        name === skillName || !(name in creature.skills),
                    )
                    .map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                </select>
              </label>
              <ProficiencyMarker
                skillName={skillName}
                proficiency={proficiency}
                onProficiencyChange={(nextProficiency) =>
                  updateCreature({
                    skills: {
                      ...creature.skills,
                      [skillName]: nextProficiency,
                    },
                  })
                }
              />
              <span
                className="min-w-5 text-center text-sm font-semibold text-white"
                aria-label={`${skillName} modifier ${signed(bonus)}`}
                title={`${skill.stat} ${creature.stats[stat]} + ${tier.fullName} ${tier.bonus}${armorApplies ? ` + ${creature.armor} ${armorPenalty}` : ""}`}
              >
                {signed(bonus)}
              </span>
              <button
                type="button"
                className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold leading-none text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                onClick={() => removeSkill(skillName)}
                aria-label={`Remove ${skillName} skill`}
                title={`Remove ${skillName} skill`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
