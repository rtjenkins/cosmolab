# Local App Test Results — Template Folder

Rename this folder to the actual test date (e.g., `2026-03-25`) when running tests.

## Folder Structure
```
YYYY-MM-DD/
  combo-1-discovery-sales-skincare/
    <document-title>.txt      ← paste document text here
    notes.md                  ← fill in from template in test-plan.md
  combo-2-cross-team-workflow-assessment/
    ...
  combo-3-it-assessment/
    ...                       ← this combo works on local app, no timeout
```

## How to start the local app
```bash
cd "/Users/rajeshtulsyani/Claude Apps/cosmolab"
pnpm install    # only needed if node_modules is missing
pnpm dev
```
Then open http://localhost:3000
