---
description: Validation preferences for this workspace, including editor-managed ESLint checks
applyTo: "**/*"
---

# Validation preferences

- Do not run `npm run lint` or other ESLint commands automatically. ESLint runs in the editor on save, and the user will review those diagnostics there.
- Continue to run focused TypeScript compilation or behavior checks when they are relevant to the change and do not duplicate the editor-managed ESLint validation.
- Report validation commands that were intentionally skipped when summarizing the work.
