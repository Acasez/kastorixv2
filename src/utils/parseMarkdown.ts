export function parseMarkdownByHeaders(
  markdown: string,
): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = markdown.split("\n");
  let currentSection = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Match headers like "#", "##", or "###" with optional leading/trailing whitespace
    const headerMatch = trimmedLine.match(/^#{1,3}\s+(.+)$/);

    if (headerMatch) {
      // Save the previous section (if it exists)
      if (currentSection) {
        sections[currentSection] = currentContent.join("\n").trim();
        currentContent = [];
      }
      // Start a new section
      currentSection = headerMatch[1].trim();
    } else if (currentSection) {
      // Add the line to the current section
      currentContent.push(line);
    }
  }

  // Save the last section
  if (currentSection) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  return sections;
}
