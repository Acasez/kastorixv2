import { useState } from "react";
import {
  getProficiency,
  signed,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import skills from "../../data/skills";
import armors from "../../data/armors";
import { useCreature } from "../../hooks/useCreature";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import CreatureSectionHeader from "./CreatureSectionHeader";
import CreatureAddDropdown from "./CreatureAddDropdownProps";

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
      <CreatureSectionHeader
        title="Skills"
        onAdd={() => setIsAdding((open) => !open)}
        addLabel="Add skill"
        isAdding={isAdding}
      >
        {isAdding && (
          <CreatureAddDropdown
            availableTypes={availableSkills}
            itemLabel="Skill"
            onSelect={addSkill}
          />
        )}
      </CreatureSectionHeader>
      <div className="flex flex-wrap items-center gap-2 mt-1">
        {selectedSkills.map((skillName) => {
          const skill = skills.find(({ name }) => name === skillName);
          if (!skill) return null;

          const stat = skill.stat;
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
