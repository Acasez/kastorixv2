import "../CSS/RulesRow.css";

interface RuleItem {
  rule: string;
  description?: string; // For multi-line rules (e.g., mana recovery)
  isHeader?: boolean; // For section headers (e.g., "Physique (PHY)")
}

interface RulesProp {
  name?: string;
  rules: RuleItem[];
}

export default function RulesBox({ name, rules }: RulesProp) {
  return (
    <div className="rules-row ml-4">
      {name && <h2 className="rule-title">{name}</h2>}
      {rules.map(({ rule, description, isHeader }) => (
        <div
          className={`rules-item ${isHeader ? "rules-item--header" : ""}`}
          key={rule}
        >
          <div className="rules-item-content">
            <p className="rules-item-description">
              <span className="rules-row-title">{rule}</span>
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
