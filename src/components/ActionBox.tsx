import "../CSS/RulesBox.css";
import { useEffect, useState } from "react";

interface Action {
  name: string;
  actions: string;
  trigger: string;
  description: string;
  traits: string;
}

interface ActionProp {
  action: string;
}

export default function ActionBox({ action }: ActionProp) {
  const [actionDetails, setActionDetails] = useState<Action | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActionDetails = async () => {
      try {
        const response = await fetch("/json/actions.json");
        if (!response.ok) {
          throw new Error("Failed to fetch actions.json");
        }
        const data: Action[] = await response.json();
        const matchedAction = data.find((item) => item.name === action);
        if (matchedAction) {
          setActionDetails(matchedAction);
        } else {
          setError("Action not found");
        }
      } catch (err) {
        setError("Failed to load action details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActionDetails();
  }, [action]);

  if (loading) {
    return <div className="rules-box">Loading...</div>;
  }

  if (error) {
    return <div className="rules-box">{error}</div>;
  }

  if (!actionDetails) {
    return <div className="rules-box">No details found</div>;
  }

  // Replace newlines with <br /> for proper rendering
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
