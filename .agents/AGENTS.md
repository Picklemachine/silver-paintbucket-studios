# Project Rules

- After running any task that requires solving a problem, always provide the user with a short explanation detailing the issue, the logic behind the solution, and what was changed so that they can learn along with the agent.

- When troubleshooting visual rendering bugs (e.g., modals or sidebars failing to show up when triggered):
  - Do not rely solely on Javascript class lists or DOM console checks returning success.
  - Always inspect the raw HTML tag hierarchy and verify DOM ancestry to check for unclosed tag structures (such as unclosed parent `div` elements) that might nest the target element inside off-screen or hidden container elements.

- **Image Sizing Constraints**: Always ask the user for the preferred image sizes and layout dimensions before employing or inserting new visual assets on the page. Do not make default layout size assumptions.
