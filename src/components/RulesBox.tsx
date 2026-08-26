import "../CSS/RulesBox.css";

interface RulesProp {
  name?: string;
  rules: { rule: string; ruleIcon?: string }[];
}

export default function RulesBox({ name, rules }: RulesProp) {
  return (
    <>
      <div className="rules-box">
        <h2 className="rule-title">{name}</h2>
        {rules.map(({ rule, ruleIcon }) => (
          <div className="rules-item">
            <img className="action-icon" src={ruleIcon} alt="1 Action" />
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </>
  );
}
