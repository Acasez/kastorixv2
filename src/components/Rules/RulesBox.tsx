import ActionIcon from "../Actions/ActionIcon";

interface RuleItem {
  rule: string;
  ruleIcon?: string;
  description?: string;
}

interface RulesProp {
  name?: string;
  rules: RuleItem[];
  maxWidth?: number;
}

export default function RulesBox({ name, rules, maxWidth }: RulesProp) {
  return (
    <div
      className="border bg-bg-rules border-bg-redwood min-w-50 m-2 text-center"
      style={{ width: maxWidth ? `${maxWidth}px` : undefined }}
    >
      {name && (
        <h2 className="text-center underline text-2xl text-text-black my-2">
          {name}
        </h2>
      )}
      {rules.map(({ rule, ruleIcon, description }) => (
        <div
          className="flex flex-row gap-1 text-lg justify-center"
          key={rule + description}
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
