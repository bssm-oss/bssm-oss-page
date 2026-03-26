# AGENTS.md

Repository-specific instructions for coding agents working in `bssm-oss-page`.

This file is meant to remove ambiguity. Treat it as the operating manual for this repo.

## 1. Product intent

This repository currently ships a frontend-only v1.

The product is not yet an editor, runtime, or backend-integrated system. Right now it does two things:

1. Introduce the `bssm-oss` GitHub organization through a designed landing page.
2. Show the intended shape of two future workspaces:
   - `AI Mode`: describe a change in natural language and let an agent propose/apply it.
   - `Code Mode`: inspect the code for a selected UI region and edit it directly.

Do not present unfinished future capabilities as if they are already implemented.

## 2. Current scope boundaries

As of this stage, the following are intentionally out of scope:

- backend services
- authentication
- real-time GitHub synchronization
- live agent execution
- direct file mutation from the browser
- PR-less runtime editing
- persistence beyond the static frontend app

If a task asks for those capabilities, either:

- implement only the frontend shell/state/placeholder experience, or
- explicitly add scaffolding without claiming the feature is functional.

## 3. Stack and package manager

Primary stack:

- React 19
- Vite
- TypeScript
- React Router
- Vitest
- Testing Library

Package manager policy:

- Use `pnpm install` for dependency installation.
- `npm run build`, `npm run test`, and `npm run lint` are fine for running scripts.
- There was a local npm arborist/version issue during setup, so do not switch lockfile strategy casually.
- Keep `pnpm-lock.yaml` authoritative.

## 4. Repo map

Use this mental model when making changes:

- `src/App.tsx`
  App routing and route registration.
- `src/components/AppShell.tsx`
  Shared shell: header, brand, external GitHub link, mode toggle.
- `src/routes/HomePage.tsx`
  Landing page.
- `src/routes/AiModePage.tsx`
  AI Mode shell.
- `src/routes/CodeModePage.tsx`
  Code Mode shell.
- `src/data/orgSnapshot.ts`
  Static organization snapshot and repo list.
- `src/types.ts`
  Shared data contracts.
- `src/index.css`
  Design tokens and page-level styling.
- `src/App.test.tsx`
  High-signal route tests.
- `src/test/setup.ts`
  Vitest setup.
- `docs/overview.md`
  What the app is and how it is structured.
- `docs/content-snapshot.md`
  Data-source assumptions for the organization snapshot.
- `docs/mode-roadmap.md`
  Current vs future meaning of AI/Code Mode.
- `docs/development.md`
  Setup, validation, and documentation maintenance rules.
- `.interface-design/system.md`
  Visual system notes.

## 5. UI and design rules

This repo is not supposed to look like a generic SaaS template.

Preserve the established direction:

- bright lab-like background
- electric blue as primary accent
- orange as signal accent
- lime as secondary highlight
- soft elevation with visible framing
- Space Grotesk + IBM Plex Mono pairing
- bold, high-contrast hero typography

Do not quietly revert the UI to:

- flat grayscale cards
- default system font stacks
- generic purple gradients
- dark-mode-first styling
- random component-library defaults

When editing styles:

- modify tokens first when a change is systemic
- preserve the current spacing scale and radius language unless there is a strong reason not to
- keep interactive targets at least 44px tall
- preserve visible `:focus-visible` behavior
- maintain responsive behavior at mobile and desktop widths

If you add new UI, it should feel like the same product family as the existing landing.

## 6. Content rules

The landing page intentionally mixes:

- factual snapshot data from GitHub
- manually written descriptive copy

Keep those separate in your head.

Facts belong to:

- org name
- follower count
- public repo count
- repo names
- repo URLs
- repo language
- star count
- update timestamps

Interpretation belongs to:

- category labels
- short helper descriptions for repos with missing descriptions
- featured project selection
- landing copy and section framing

Do not invent or distort factual metadata.

## 7. Snapshot update rules

If you update `src/data/orgSnapshot.ts`, you must also review and usually update:

- `README.md`
- `docs/content-snapshot.md`
- `docs/overview.md` if structure or meaning changed

At minimum, verify:

1. snapshot date
2. public repo count
3. follower count
4. featured repo list
5. any helper descriptions added for empty GitHub descriptions

If the GitHub data changed materially, mention the exact snapshot date in docs.

## 8. AI Mode and Code Mode rules

These pages are shells, not fake implementations.

When working on `AI Mode`:

- keep the experience framed as a future workflow unless you actually wire execution
- do not imply an agent is running if it is not
- use explanatory placeholders, wireframes, or static states
- preserve the three-step logic:
  - pick target
  - prompt agent
  - review output

When working on `Code Mode`:

- keep the mapping between UI region and code as the central concept
- do not imply a full browser IDE exists if it does not
- preserve the three-step logic:
  - select section
  - inspect code
  - reflect changes

If you add richer interactions later, update `docs/mode-roadmap.md`.

## 9. Routing rules

Current canonical routes:

- `/`
- `/ai`
- `/code`

If you add a new route:

- wire it in `src/App.tsx`
- decide whether it belongs inside the shared `AppShell`
- add or update tests if the route is user-facing
- update `README.md` and `docs/overview.md`

Do not add dead routes without a user-visible reason.

## 10. Testing expectations

Before finishing code changes, prefer this validation sequence:

1. `git diff --check`
2. `npm run test`
3. `npm run lint`
4. `npm run build`

For documentation-only changes:

- `git diff --check` is still expected
- `npm run test` is preferred

If your change affects routes, copy, or shell navigation, update or add tests in `src/App.test.tsx`.

Good test targets in this repo:

- route rendering
- navigation via toggle
- brand link behavior
- presence of key page content

Avoid overfitting tests to brittle style details.

## 11. Documentation expectations

Treat docs as part of the product, not an afterthought.

When behavior changes:

- update `README.md` for entry-level understanding
- update `docs/overview.md` for structure/intent changes
- update `docs/content-snapshot.md` for snapshot/data policy changes
- update `docs/mode-roadmap.md` for AI/Code mode meaning changes
- update `docs/development.md` if setup, validation, or workflow changes

Do not leave docs in a state where they describe a product that no longer matches the code.

## 12. Commit and PR behavior

If the user asks for commits or PRs, prefer small, meaningful commits grouped by concern.

Good commit grouping in this repo:

- tooling/scaffold
- routes and data shape
- visual system
- tests
- docs

Avoid mixing unrelated changes in one commit.

Commit messages should be explicit, for example:

- `chore: ...`
- `feat: ...`
- `fix: ...`
- `test: ...`
- `docs: ...`

If a PR is requested:

- include a short summary
- list the commit breakdown when helpful
- list validation commands actually run

If the repo is empty and a PR is required, it is acceptable to first establish `main` as a base branch, then create a feature branch for reviewable work.

## 13. File creation and deletion rules

Safe to create:

- docs under `docs/`
- tests under `src/test/` or alongside app files if consistent
- additional components under `src/components/`
- additional route files under `src/routes/`

Be careful when deleting:

- shared shell files
- static snapshot data
- docs files already linked from README

If you remove a file, clean up all references.

## 14. Accessibility and UX guardrails

Every user-facing change should preserve:

- keyboard navigability
- visible focus states
- readable color contrast
- responsive layout at narrow widths
- clear primary action hierarchy

Do not trade readability for visual novelty.

## 15. What to avoid

Do not:

- add backend assumptions into frontend copy
- silently swap package managers
- replace handcrafted copy with generic marketing filler
- treat placeholder mode pages as shipped functionality
- change snapshot facts without updating docs
- introduce heavy abstractions without a clear need
- add large dependencies for trivial UI work

## 16. Good default workflow for agents

When modifying this repo, the default order is:

1. read `README.md`
2. read the most relevant file in `docs/`
3. inspect the target source file
4. implement the smallest coherent change
5. run validation
6. sync docs if behavior changed

If the task touches organization content, inspect `src/data/orgSnapshot.ts` early.

If the task touches visual style, inspect `.interface-design/system.md` and `src/index.css` early.

## 17. If you need to extend the product

Preferred extension order:

1. make the shell/state believable
2. make the information architecture clear
3. add local interactivity
4. add real integrations only when the product intent is explicit

For future feature work, prefer progressive enhancement over pretending the final system already exists.
