import "../CSS/RulesBox.css";

interface RuleItem {
  rule: string;
  ruleIcon?: string;
  description?: string; // For multi-line rules (e.g., mana recovery)
  isHeader?: boolean; // For section headers (e.g., "Physique (PHY)")
  color?: string; // For custom styling (e.g., attribute colors)
}

interface RulesProp {
  name?: string;
  rules: RuleItem[];
}

export default function RulesBox({ name, rules }: RulesProp) {
  return (
    <div className="rules-box">
      {name && <h2 className="rule-title">{name}</h2>}
      {rules.map(({ rule, ruleIcon, description, isHeader, color }) => (
        <div
          className={`rules-item ${isHeader ? "rules-item--header" : ""}`}
          style={{ color }}
          key={rule}
        >
          {ruleIcon && <img className="action-icon" src={ruleIcon} alt="" />}
          <div className="rules-item-content">
            <span className="rules-item-title">{rule}</span>
            {description && (
              <p className="rules-item-description">{description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
