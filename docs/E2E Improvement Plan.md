# E2E Improvement Plan

Scope: Strengthen Playwright E2E coverage, clarity, determinism, and CI usability for the posts/comments flows, keeping mocked backend and POM.

## Current Snapshot
- Tests: `tests/e2e/posts/*.spec.ts` using POM in `tests/pom/`.
- POM: `HomePage`, `PostCard` with stable `data-testid` selectors.
- Mocked data/API: `src/mocks/` in-memory, no network layer to intercept.
- Config: `playwright.config.ts` (list reporter, headful, retries=0, trace on-first-retry).

## Goals
- Improve reliability (retries, artifacts, headless by default).
- Cover negative/error/slow states deterministically.
- Validate more UI states (empty comments, loading, errors).
- Keep test intent readable via POM and selectors.
- Provide clear docs and coverage matrix.

## Step-by-Step Plan

### 1) Configuration & Reliability
- Update `playwright.config.ts` (no code change now; to be applied later):
  - use.baseURL: keep `http://localhost:5173`.
  - headless: true by default; allow override via env locally.
  - retries: 2 in CI, 0–1 locally.
  - artifacts: `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`.
  - reporters: `[['list'], ['html', { outputFolder: 'test-results/html' }]]`.
  - projects: keep Chromium & WebKit; optionally add Firefox; add one mobile viewport for smoke.
- POM navigation: change `HomePage.goto()` to `page.goto('/')` (rely on baseURL) to avoid env drift.

### 2) Deterministic Data & Test Setup
- Seed faker once in tests setup:
  - Add a lightweight global setup (e.g., `tests/setup.ts`) that calls `faker.seed(42)`.
  - Reference from Playwright config via `globalSetup` or import in specs.

### 3) Mock API Flags for E2E Scenarios
- Extend `src/mocks/api.ts` (later change) to read flags from `window` (via optional `globalThis` access):
  - `window.__e2eFailGetPostsOnce` → first `getPosts()` throws Error.
  - `window.__e2eDelayMs` → apply extra delay to `getPosts()`/`addComment()`.
  - `window.__e2eFailAddComment` → `addComment()` rejects with Error.
- Add a small helper in tests: `tests/e2e/utils/runtimeFlags.ts` with `setRuntimeFlag(page, key, value)` to set flags before actions.

### 4) New Test Coverage (add under `tests/e2e/`)
- Loading & error states (new file `app-states.spec.ts`):
  - Simulate slow `getPosts` → assert `Loading posts…` visible then posts.
  - Simulate error `getPosts` → assert `Error: ...` rendered.
- Comments error state (extend `comments.spec.ts` or new `comments-error.spec.ts`):
  - Simulate `addComment` rejection → assert inline error `data-testid="comment-error"` and no new comment added.
- Empty state (extend `page-load.spec.ts` or new `comments-empty.spec.ts`):
  - For second post, assert `data-testid="no-comments"` is visible.

### 5) Structure & Tags
- Keep `testDir: 'tests/e2e'` (optional adjustment later). Subfolders remain `posts/`.
- Tag fast tests with `@smoke` (already used) and ensure CI uses `--grep @smoke` for PRs, full run on `main`.

### 6) POM Enhancements (optional)
- Add `CommentsSection` POM (if needed) exposing:
  - `addComment(text, author?)`, `expectCommentVisible(text)`, `expectError(text)`.
- Keep assertions mostly in tests; POM returns locators for explicit `expect(...)` where clarity helps.

### 7) CI Integration
- Ensure CI job:
  - Installs browsers (`npx playwright install --with-deps`).
  - Runs smoke on PRs; full matrix (Chromium/WebKit/Firefox) on main.
  - Uploads HTML report and failure artifacts (trace/video/screenshots).

### 8) Documentation & Visibility
- Add `tests/README.md` with:
  - How to run (local & CI), env knobs (headless, grep).
  - Conventions: selectors (`data-testid`), POM patterns, test organization, tags.
  - Mock flags usage and examples.
- Create `docs/E2E Coverage Matrix.md` showing features × scenarios (checked/unchecked) to track progress.

## Acceptance Criteria
- Config updated with retries, artifacts, headless default, reporters.
- Faker seeding applied; tests remain stable.
- New tests cover: slow load, error load, addComment error, empty comments state.
- POM keeps readable intent; selectors remain `data-testid`-driven.
- CI publishes HTML report and artifacts; smoke/full split operational.
- Docs and coverage matrix present and up to date.

## Out-of-Scope / Later Enhancements
- Accessibility checks (`@axe-core/playwright`) on key screens.
- Lightweight visual regression on `PostCard` and `CommentList`.
- Mobile-specific interaction tests if UI diverges.

## Effort Estimate
- Step 1–2: 1–2 hours.
- Step 3–4: 2–3 hours.
- Step 5–8: 2 hours.
- Total: ~5–7 hours.
