// src/components/ActionBox.tsx
import "../CSS/RulesBox.css";

interface Action {
  name: string;
  actions: string;
  trigger: string;
  description: string;
  traits: string;
}

interface ActionBoxProps {
  action: string;
  actionsList: Action[]; // Pass the full list of actions as a prop
}

export default function ActionBox({ action, actionsList }: ActionBoxProps) {
  // Find the action details from the passed list
  const actionDetails = actionsList.find((item) => item.name === action);

  if (!actionDetails) {
    return <div className="rules-box">Action not found: {action}</div>;
  }

  // Format the description (replace newlines with <br />)
  const formattedDescription = actionDetails.description
    .split("\n")
    .map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));

  return (
    <div className="rules-box">
      <h2 className="rule-title">{action}</h2>
      <div className="action-details">
        <p>{formattedDescription}</p>
        {actionDetails.traits && (
          <p className="traits">Traits: {actionDetails.traits}</p>
        )}
      </div>
    </div>
  );
}
