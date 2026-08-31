// src/components/ActionBox.tsx
import "../CSS/RulesBox.css";
import { getActionIcons } from "../utils/actionUtils";

interface Action {
  name: string;
  actions: string;
  trigger: string;
  description: string;
  traits: string;
}

interface ActionBoxProps {
  action: string;
  actionsList: Action[];
}

export default function ActionBox({ action, actionsList }: ActionBoxProps) {
  const actionDetails = actionsList.find((item) => item.name === action);
  if (!actionDetails) {
    return <div className="rules-box">Action not found: {action}</div>;
  }

  const actionIcons = getActionIcons(actionDetails.actions);

  const formattedDescription = actionDetails.description
    .split("\n")
    .map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));

  return (
    <div className="rules-box wide">
      <div className="action-header">
        <h2 className="rule-title">{action}</h2>
        <div className="action-icons">
          {actionIcons.map((icon, i) => (
            <img
              key={i}
              src={icon}
              alt={`${actionDetails.actions} action cost`}
              className="action-icon"
            />
          ))}
        </div>
      </div>
      <div className="action-details">
        <p>{formattedDescription}</p>
        {actionDetails.traits && (
          <p className="traits">Traits: {actionDetails.traits}</p>
        )}
      </div>
    </div>
  );
}
