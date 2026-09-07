import RulesBox from "./RulesBox";
import { useState } from "react";
import skills from "../json/skills.json";

interface Skill {
  name: string;
  description: string;
  stat: string;
}

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
