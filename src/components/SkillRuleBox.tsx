import RulesBox from "./TextPageComponents/RulesBox";
import { useState } from "react";
import skills from "../data/skills";
import { type Skill } from "../types/Skills";

export default function SkillRuleBox() {
  const [isExpanded, setIsExpanded] = useState(false); // Collapsible state

  const skillRules = skills.map((skill: Skill) => ({
    rule: `${skill.name} (${skill.stat})`,
    description: skill.description,
    isHeader: false,
  }));

  return (
    <div className="collapsible-skills">
      <button
        className="skills-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "▼ Hide Skills" : "▶ Show Skills"}
      </button>
      {isExpanded && (
        <RulesBox name="Skills" rules={skillRules} maxWidth={350} />
      )}
    </div>
  );
}
