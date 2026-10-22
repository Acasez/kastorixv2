/* import "../../CSS/RulesBox.css"; */
import ActionIcon from "../Actions/ActionIcon";

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
      className="border bg-bg-rules border-bg-redwood min-w-50 max-w-120 m-2 text-center"
      style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
    >
      {name && (
        <h2 className="text-center underline text-2xl text-text-black my-2">
          {name}
        </h2>
      )}
      {rules.map(({ rule, ruleIcon, description, isHeader }) => (
        <div
          className={`flex flex-row gap-1 text-lg justify-center ${isHeader ? "" : ""}`}
          key={rule}
        >
          {ruleIcon && <ActionIcon icon={ruleIcon} />}
          <div className="">
            {rule && <span className="text-text-rule underline">{rule}</span>}
            {description && <p className="m-1 text-center">{description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
