import { useState } from "react";
import skills from "../../data/skills";
import armors from "../../data/armors";
import { useCreature } from "../../hooks/useCreature";
import CreatureSectionHeader from "./CreatureSectionHeader";
import CreatureAddDropdown from "./CreatureAddDropdownProps";
import CreatureSkillComponent from "./CreatureSkillComponent";

const skillNames = skills.map(({ name }) => name);

type CreatureSkillListProps = {
  blockId: number;
};

export default function CreatureSkillList({ blockId }: CreatureSkillListProps) {
  const { creature, updateCreature } = useCreature(blockId);
  const selectedArmor = armors.find((armor) => armor.name === creature.armor);
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

          return (
            <CreatureSkillComponent
              key={skill.name}
              skill={skill}
              changeSkill={changeSkill}
              skillNames={skillNames}
              creature={creature}
              updateCreature={updateCreature}
              removeSkill={removeSkill}
              selectedArmor={selectedArmor}
            />
          );
        })}
      </div>
    </section>
  );
}
