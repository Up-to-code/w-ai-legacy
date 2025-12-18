---
name: Convert JSON Inputs To TOON (Frontend Only)
overview: Modernize the Bot dashboard to convert all user-provided inputs and data from JSON to TOON format on save, removing advanced settings and improving code structure. Editing and viewing in the UI remains JSON, with TOON conversion and DB save handled transparently on the frontend. No backend modifications required.
todos:
  - id: remove-advanced-settings
    content: Remove or hide all advanced settings from the bot dashboard UI components.
    status: pending
  - id: extract-prompt-fn
    content: Refactor and centralize prompt creation and logic into a reusable function.
    status: pending
  - id: convert-json-to-toon
    content: Ensure all data sent to backend is converted from JSON to TOON format on the frontend (using package or utility).
    status: pending
  - id: refactor-actions-hooks
    content: Refactor actions, hooks, and components to ensure consistent data handling and error handling.
    status: pending
  - id: add-toon-util
    content: Add or implement a utility for converting JSON to TOON if not already available.
    status: pending
  - id: todo-1766083038386-h4vx8uq73
    content: ""
    status: pending
---

- Remove advanced settings from all components within [app/dashboard/bot](app/dashboard/bot).
- Centralize the prompt creation and handling logic into a reusable function, ensuring it can accept JSON and outputs TOON for DB saves.
- Refactor all code for AI-related actions, prompts, and knowledge inputs to ensure JSON is converted to TOON (using a TOON serialization library or utility) upon save/submit to the backend/database.
- Ensure consistency and code organization across actions/components/hooks in [app/dashboard/bot/components](app/dashboard/bot/components) and [app/dashboard/bot/hooks](app/dashboard/bot/hooks).
- All user interaction, editing, and visualization continue using JSON for familiarity; conversion to TOON is handled automatically before data is sent to the backend/database.
- Add utility (if not present) for safe JSON→TOON conversion according to spec at [TOON website](https://toonformat.dev/).
- Add robust error handling for failed conversions; fallback to storing the original JSON string as a last resort.

If a suitable TOON npm package is available, add it as a dependency. Otherwise, implement a minimal converter utility as needed.Main files to focus on:

- [app/dashboard/bot/page.tsx](app/dashboard/bot/page.tsx)
- [app/dashboard/bot/components/](app/dashboard/bot/components/)