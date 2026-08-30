// src/utils/actionUtils.ts
export const getActionIcons = (actionCost: string): string[] => {
  const cost = actionCost.trim().toLowerCase();
  const icons: string[] = [];

  if (cost.includes("-")) {
    // Handle ranges like "1-2" or "2-3"
    const [min, max] = cost.split("-").map((s) => s.trim());
    if (min === "1") icons.push("/images/Icons/OneAction.png");
    if (min === "2" || max === "2") icons.push("/images/Icons/TwoActions.png");
    if (min === "3" || max === "3")
      icons.push("/images/Icons/ThreeActions.png");
  } else {
    // Handle single costs
    if (cost === "1") icons.push("/images/Icons/OneAction.png");
    if (cost === "2") icons.push("/images/Icons/TwoActions.png");
    if (cost === "3") icons.push("/images/Icons/ThreeActions.png");
    if (cost === "free") icons.push("/images/Icons/FreeAction.png");
    if (cost.includes("reaction")) icons.push("/images/Icons/Reaction.png");
  }

  return icons;
};
