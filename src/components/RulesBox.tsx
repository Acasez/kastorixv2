import "../CSS/RulesBox.css";

interface RuleItem {
  rule: string;
  ruleIcon?: string;
  description?: string; // For multi-line rules (e.g., mana recovery)
  isHeader?: boolean; // For section headers (e.g., "Physique (PHY)")
}

interface RulesProp {
  name?: string;
  rules: RuleItem[];
  maxWidth?: number;
}

export default function RulesBox({ name, rules, maxWidth }: RulesProp) {
  return (
    <div
      className="rules-box"
      style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
    >
      {name && <h2 className="rule-title text-center">{name}</h2>}
      {rules.map(({ rule, ruleIcon, description, isHeader }) => (
        <div
          className={`rules-item ${isHeader ? "rules-item--header" : ""}`}
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
