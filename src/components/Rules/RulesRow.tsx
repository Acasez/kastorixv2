interface RuleItem {
  rule: string;
  description?: string; // For multi-line rules (e.g., mana recovery)
}

interface RulesProp {
  name?: string;
  rules: RuleItem[];
}

export default function RulesBox({ name, rules }: RulesProp) {
  return (
    <div className="bg-bg-rules border-l-4 border-bg-redwood rounded-md mt-2 p-2 pr-5 mx-auto">
      {name && <h2 className="text-text-rule text-2xl">{name}</h2>}
      {rules.map(({ rule, description }) => (
        <div className="text-xl">
          <p className="">
            <span className="underline m-2 text-text-rule">{rule}</span>
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}
