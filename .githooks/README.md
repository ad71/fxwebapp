# Git Hooks

This repo uses a local hooks directory to enforce token generation.

Enable hooks:

  git config core.hooksPath .githooks

What it enforces
- `pre-commit` runs `npm run tokens:check` to ensure generated CSS/TS tokens match `tokens/tokens.json`.

