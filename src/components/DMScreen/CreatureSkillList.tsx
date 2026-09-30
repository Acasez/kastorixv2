import {
  getProficiency,
  signed,
  type ProficiencyTierName,
} from "../../constants/Proficiency";
import skills from "../../json/skills.json";
import { useCreature } from "../../contexts/CreatureContext";
import { STRING_TO_STATKEY } from "../../types/StatKey";
import ProficiencyMarker from "../Buttons/ProficiencyMarker";

const skillNames = skills.map(({ name }) => name);

export default function CreatureSkillList() {
  const { creature, updateCreature } = useCreature();
  const selectedSkills = skillNames.filter((name) => name in creature.skills);
  const availableSkills = skillNames.filter(
    (name) => !(name in creature.skills),
  );

  const addSkill = () => {
    const skillName = availableSkills[0];
    if (!skillName) return;
    updateCreature({
      skills: { ...creature.skills, [skillName]: "Trained" },
    });
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
    <section>
      <h2 className="creature-section-title mb-1">Skills</h2>
      <div className="flex flex-wrap items-center gap-2">
        {selectedSkills.map((skillName) => {
          const skill = skills.find(({ name }) => name === skillName);
          if (!skill) return null;

          const stat = STRING_TO_STATKEY[skill.stat];
          const proficiency: ProficiencyTierName =
            creature.skills[skillName] ?? "Untrained";
          const tier = getProficiency(proficiency);
          const bonus = creature.stats[stat] + tier.bonus;

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
                title={`${skill.stat} ${creature.stats[stat]} + ${tier.fullName} ${tier.bonus}`}
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
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded bg-bg-wood text-lg text-white hover:bg-bg-redwood disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          onClick={addSkill}
          disabled={availableSkills.length === 0}
          aria-label="Add skill"
          title="Add skill"
        >
          +
        </button>
      </div>
    </section>
  );
}
