---
trigger: always_on
description: Commit workflow.
---

# Commits

- Conventional commits (`feat(home): add hero section`). Scope = page or module.
- One logical change per commit; a section is usually one commit.
- `vp staged` pre-commit hook formats and lints.
- Never commit `src/generated/`, `.env*` (except `.env.example`), Apps Script secrets or customer data.
