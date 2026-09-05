export function parseMarkdownByHeaders(
  markdown: string,
): Record<string, string> {
  const sections: Record<string, string> = {};
  // Split by `---` or any other delimiter you prefer
  const parts = markdown.split("---");

  // Assign each part to a key (e.g., "Overview", "Actions")
  // You can hardcode the keys or use a different delimiter strategy
  sections.Overview = parts[0].trim();
  sections.Actions = parts[1]?.trim() || "";
  sections.Stats = parts[2]?.trim() || "";
  sections.Skills = parts[3]?.trim() || "";
  sections.MageRanks = parts[4]?.trim() || "";

  return sections;
}
