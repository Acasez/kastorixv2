import RulesBox from "./RulesBox";
import { useState, useEffect } from "react";

interface Skill {
  name: string;
  description: string;
  stat: string;
}

export default function SkillRuleBox() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/json/skills.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load skills");
        }
        return response.json();
      })
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading skills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const skillRules = skills.map((skill: Skill) => ({
    rule: `${skill.name} (${skill.stat})`,
    description: skill.description,
    isHeader: false,
  }));

  return <RulesBox name="Skills" rules={skillRules} />;
}
