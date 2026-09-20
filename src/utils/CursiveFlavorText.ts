export const cursiveFlavorText = (
  description: string,
): { flavor: string; mechanics: string } => {
  if (!description || typeof description !== "string") {
    return { flavor: "", mechanics: description || "" };
  }

  const trimmed = description.trim();
  if (trimmed === "") {
    return { flavor: "", mechanics: "" };
  }

  // Split on first period followed by space or end of string
  const firstPeriodIndex = trimmed.indexOf(".");
  if (firstPeriodIndex === -1) {
    return { flavor: trimmed, mechanics: "" };
  }

  const flavor = trimmed.substring(0, firstPeriodIndex + 1); // Include the period
  const mechanics = trimmed.substring(firstPeriodIndex + 1).trim();

  return { flavor, mechanics: mechanics === "" ? "" : mechanics };
};
