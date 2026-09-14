export const splitTraitDescription = (
  description: string,
): { flavor: string; mechanics: string } => {
  const sentences = description.split(".");
  if (sentences.length <= 1) {
    return { flavor: description, mechanics: "" };
  }

  const flavor = sentences[0];
  const mechanics = sentences.slice(1).join(". ");

  return { flavor, mechanics };
};
