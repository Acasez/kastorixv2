import {
  getProficiency,
  signed,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import type { Creature } from "../../stores/useCreatureStore";
import type { Armor } from "../../types/Armor";
import type { Skill } from "../../types/Skills";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";
import ComponentDeleteButton from "../ComponentDeleteButton";

interface CreatureSkillComponentProps {
  skill: Skill;
  changeSkill: (currentName: string, nextName: string) => void;
  skillNames: string[];
  creature: Creature;
  updateCreature: (patch: Partial<Creature>) => void;
  removeSkill: (skillName: string) => void;
  selectedArmor: Armor | undefined;
}

export default function CreatureSkillComponent({
  skill,
  changeSkill,
  skillNames,
  creature,
  updateCreature,
  removeSkill,
  selectedArmor,
}: CreatureSkillComponentProps) {
  const stat = skill.stat;
  const proficiency: ProficiencyTierName =
    creature.skills[skill.name] ?? "Untrained";
  const tier = getProficiency(proficiency);
  const armorApplies =
    selectedArmor?.type === "Heavy"
      ? skill.armorPenalties === "Light" || skill.armorPenalties === "Heavy"
      : skill.armorPenalties === selectedArmor?.type;
  const armorPenalty = selectedArmor?.penalties ?? 0;
  const bonus =
    creature.stats[stat] + tier.bonus + (armorApplies ? armorPenalty : 0);
  return (
    <div
      className="relative inline-flex items-center gap-2 rounded border border-stone-600 bg-stone-800 p-2 pr-3"
      key={skill.name}
    >
      <label>
        <span className="sr-only">Select skill</span>
        <select
          aria-label="Select skill"
          value={skill.name}
          onChange={(event) => changeSkill(skill.name, event.target.value)}
          className="h-8 max-w-30 rounded border border-stone-500 bg-stone-900 px-1 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          {skillNames
            .filter((name) => name === skill.name || !(name in creature.skills))
            .map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </select>
      </label>
      <ProficiencyMarker
        skillName={skill.name}
        proficiency={proficiency}
        onProficiencyChange={(nextProficiency) =>
          updateCreature({
            skills: {
              ...creature.skills,
              [skill.name]: nextProficiency,
            },
          })
        }
      />
      <span
        className="min-w-5 text-center text-sm font-semibold text-white"
        aria-label={`${skill.name} modifier ${signed(bonus)}`}
        title={`${skill.stat} ${creature.stats[stat]} + ${tier.fullName} ${tier.bonus}${armorApplies ? ` + ${creature.armor} ${armorPenalty}` : ""}`}
      >
        {signed(bonus)}
      </span>
      <ComponentDeleteButton
        objectName={skill.name}
        onClick={removeSkill}
        objectClass="Skill"
      />
    </div>
  );
}
