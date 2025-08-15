# Test Design — Posts & Comments

This document extends the base scenarios from initial task with a comprehensive set of checks to approach full coverage
for the current scope (React app with mocked backend).

## Scope and Assumptions

- Frontend-only with in-memory mocked API: `getPosts`, `addComment`.
- No auth, no persistence across reloads.
- Comment author optional; defaults to "Anonymous".
- Comments append at the end in display order.

## Functional Coverage

### Posts

- [P1] Load posts list on first render (happy path).
- [P1] Render fields per post: title, content, author, timestamp.
- [P2] Empty state: no posts (simulate by starting with empty dataset).
- [P2] Multiple posts ordering (stable order as provided by mock).
- [P3] Long title/content truncation/overflow behavior (visually non-breaking, no overlap).

### Comments — Add & View

- [C1] Add comment with content + author (happy path) → appears immediately.
- [C1.1] Timestamp shown and parsable (locale formatting ok).
- [C2] Add comment with content only (no author) → displayed with "Anonymous".
- [C3] Validation: content is trimmed; whitespace-only rejected with inline error.
- [C4] Submit disabled while pending to prevent double submit (no duplicate comments upon rapid clicks).
- [C5] Multiple comments appended in order.
- [C6] Empty comments list shows proper empty-state text.
- [C7] Large comment content (e.g., 1k–2k chars) renders without layout break.
- [C8] Special characters & emoji render correctly.
- [C9] HTML/script in comment content is rendered as text (no HTML injection/XSS).
- [C10] Error path from API: simulate addComment failure → error message shown, no new comment rendered, button
  re-enabled.
- [C11] Targeted post update only: adding a comment to Post A must not change Post B.

## UX, Accessibility, and i18n

- [A1] Inputs have labels/aria-labels; form has accessible role.
- [A2] Keyboard-only flow: focus order, Enter/Mouseless submission works.
- [A3] Screen-reader: error message announced via role=alert.
- [A4] Color contrast for text and error message adequate.
- [A5] Locale/timezone sanity: timestamps display in local time without throwing; no invalid dates.

## Reliability & State

- [R1] Refresh does not persist new comments (by design); tests must not rely on persistence.
- [R2] Concurrency-lite: rapidly add two different comments to two different posts — both appear in correct places.

## Performance and Resilience (lightweight)

- [PR1] Simulated network delay does not block UI; loading state appears then disappears.
- [PR2] While pending, controls reflect loading (button text changes, disabled state).

## Cross-browser (optional if time permits)

- [X1] Smoke checks on Chromium, WebKit (Playwright projects).

---

## Proposed Test Cases (Playwright)

Below are test IDs mapped to possible e2e specs. Some may be implemented as data-driven within existing specs.

1. Page Load

   - [P1] Load posts and assert cards present, fields visible.
   - [P2] (Variant) Empty dataset → show "no posts" messaging.
   - [P3] (Variant) Long text renders without layout break.

2. Comment Addition

   - [C1] Add comment with author → visible with text + author.
   - [C2] Add comment without author → shows "Anonymous".
   - [C11] Add to Post A and verify Post B unaffected and both are visible.

3. Multiple Comments

   - [C5] Add two comments and ensure append order.

4. Empty Comment Validation

   - [C3] Whitespace-only → inline error; no comment added.
   - [C10] API failure path → error shown, no comment added, controls re-enabled.
   - [C7-LONG] Long comment length: if there is a code limit, test values above the limit; otherwise try ~1000
     characters and verify it renders and does not break layout.

5. UI & Accessibility

   - [A1] Inputs have expected accessible names/labels.
   - [A2] Keyboard submit (focus comment → type → Enter) works.
   - [A3] Error role=alert visible when validation fails.
   - [A5] Timestamps render with valid date strings (no "Invalid Date").

6. Content Safety & Unicode

   - [C8] Emoji in comment renders.
   - [C9] HTML/script tags in comment are escaped and shown as text (no execution).

7. Performance/Resilience (basic)
   - [PR1] Loading indicator shown then removed.
   - [PR2] Pending state disables submit and changes label.

---

## Mapping to Files/Structure

Current structure:

- Page Objects: `tests/pom/` (`HomePage.ts`, `PostCard.ts`).
- Specs: `tests/e2e/` grouped by scenario.

Guidelines:

- Keep specs focused and short for stability and parallelism.
- Group by feature of behavior:
  - `posts/page-load.spec.ts` → Posts load & empty states.
  - `posts/comments.spec.ts` → Single and multiple comments (author, anonymous, validation, errors, ordering).
  - `posts/ui-interactions.spec.ts` → A11y, keyboard, timestamp checks.
- If a file grows > ~200–300 lines, split into additional spec files per sub-feature or use data-driven tests.
- Reuse POM to avoid selector duplication.

---

## Potential Additions to Current Suite

- Extend `comment-add.spec.ts` with cases [C2], [C4], [C10], [C11].
- Extend `ui-interactions.spec.ts` with [A2], [A3], [A5], [C8], [C9].
- Add an `empty-posts.spec.ts` (optional) if we support switching dataset for testing.
- Add WebKit project in `playwright.config.ts` (optional cross-browser smoke).
