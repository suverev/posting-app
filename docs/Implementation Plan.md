# Implementation Plan

## Summary

- Build a small React app that lists posts and supports adding comments.
- Use in-memory mocks for all backend requests.
- Write Playwright E2E tests using the Page Object Model (POM).
- Keep structure clean, add clear scripts and documentation.

## Tech Stack

- Frontend: React (Vite + React + TypeScript or JavaScript; TS preferred for clarity)
- Styling: Minimal CSS (no framework required)
- Testing (E2E): Playwright
- Mocking: In-memory store + simple async wrappers to mimic network

## Project Structure

```
posting-app/
  ├─ src/
  │  ├─ app/
  │  │  ├─ App.tsx
  │  │  └─ routes.ts (optional if adding simple routing)
  │  ├─ components/
  │  │  ├─ PostList.tsx
  │  │  ├─ PostItem.tsx
  │  │  ├─ CommentList.tsx
  │  │  └─ CommentForm.tsx
  │  ├─ mocks/
  │  │  ├─ data.ts (initial posts + comments)
  │  │  └─ api.ts (async functions: getPosts, addComment)
  │  ├─ types/
  │  │  └─ models.ts (Post, Comment)
  │  ├─ lib/
  │  │  └─ time.ts (formatting helpers, optional)
  │  ├─ styles/
  │  │  └─ global.css
  │  └─ main.tsx
  ├─ tests/
  │  ├─ e2e/
  │  │  ├─ page-load.spec.ts
  │  │  ├─ comment-add.spec.ts
  │  │  ├─ multiple-comments.spec.ts
  │  │  ├─ empty-comment-validation.spec.ts
  │  │  └─ ui-interactions.spec.ts
  │  └─ pom/
  │     ├─ HomePage.ts
  │     ├─ PostCard.ts
  │     └─ PostDetailsPage.ts (or ModalPage if using modal)
  ├─ playwright.config.ts
  ├─ index.html
  ├─ package.json
  ├─ README.md
  └─ AI_USAGE.md (brief notes on AI assistance)
```

## Step-by-Step Plan

1. Initialize React project

- Create Vite app (TypeScript preferred):
  - npm create vite@latest posting-app -- --template react-ts
  - cd posting-app && npm install
- Add minimal CSS reset in `src/styles/global.css` and import in `main.tsx`.

2. Define domain models

- `src/types/models.ts`: `Post`, `Comment` with fields per spec (id, title, content, author, timestamp, comments:
  Comment[]).

3. Implement mock data and API

- `src/mocks/data.ts`: export initial posts dataset per example.
- `src/mocks/api.ts`:
  - In-memory array for posts (copied from data.ts).
  - `getPosts(): Promise<Post[]>` — simulate latency with setTimeout.
  - `addComment(postId, {content, author}): Promise<Comment>` — validate non-empty, push to in-memory store, return
    created comment with timestamp.
  - Optional failure paths for tests (e.g., reject on empty content).

4. Build UI components

- `PostList` — fetch posts via `getPosts()` on mount; render list of `PostItem`.
- `PostItem` — shows title, content, author, timestamp, `CommentList`, `CommentForm`.
- `CommentList` — shows existing comments in reverse chronological or append order (document choice for tests).
- `CommentForm` — input(s) for comment (content + author). Validate empty content. On submit, call `addComment`, update
  local state immediately for responsiveness.
- Keep simple and accessible: labels for inputs, `data-testid` on key elements (e.g., `post-card`, `comment-input`,
  `submit-comment`).

5. State management

- Keep local component state (no global store). Lift state in `PostList` if needed to trigger re-render on comment add.
- Ensure immediate UI update after successful `addComment` promise resolves.

6. Optional navigation

- Not strictly necessary. If desired: simple view-toggle (list vs. details) or anchor-based navigation per post. Cover
  in tests if added.

7. Error handling & validation

- Prevent submission when content is empty. Show small inline error.
- Disable submit while pending to avoid duplicate submissions. Simple loading state.

8. Accessibility & testability

- Add `aria-label`s and `role` where useful.
- Stable `data-testid` hooks for Playwright selectors.

9. Scripts & tooling

- Add scripts to `package.json`:
  - `dev`: vite
  - `build`: vite build
  - `preview`: vite preview
  - `test:e2e`: playwright test
  - `test:e2e:ui`: playwright test --ui
- Install Playwright: `npm i -D @playwright/test` and run `npx playwright install`.

10. Playwright config

- `playwright.config.ts`: baseURL http://localhost:5173, retries 0-2, reporter list/html, use headless true by default.

11. Page Object Model (POM)

- `tests/pom/HomePage.ts`:
  - locators: post cards, first post, add comment buttons.
  - actions: goTo(), getPostByTitle(title), addCommentToPost(title, content, author).
- `tests/pom/PostCard.ts`:
  - constructor accepts page and root locator for a card.
  - getters for title, content, author, timestamp, comment list, form inputs, submit.
  - methods: addComment(content, author), expectCommentVisible(text).
- `tests/pom/PostDetailsPage.ts` (optional if details view exists):
  - methods to assert post content and add comments.

12. E2E test scenarios

- `page-load.spec.ts`: verify posts render; assert fields visible.
- `comment-add.spec.ts`: add a comment; verify appears immediately after submission.
- `multiple-comments.spec.ts`: add several comments; verify order (define expected order: append at end; document).
- `empty-comment-validation.spec.ts`: submit empty; assert validation message and no new comment.
- `ui-interactions.spec.ts`: basic navigation or interactions (e.g., expand/collapse comments, view details if
  implemented).

13. Documentation

- `README.md`:
  - Setup: Node version, install steps, run dev, build, preview.
  - Testing: how to run Playwright, headless vs UI mode, baseURL.
  - Notes on data, validation, decisions (comment ordering).
- `AI_USAGE.md`:
  - Brief bullets on where AI assisted (project scaffolding, component skeletons, test POM outline, troubleshooting).

14. Quality bar & linting (optional, time-permitting)

- Add ESLint + Prettier with basic configs.
- Enforce simple rules (no unused vars, consistent imports).

15. Delivery checklist

- App runs: `npm run dev`.
- All tests pass locally: `npm run test:e2e`.
- README and AI_USAGE included.
- Screenshots (optional) placed in `docs/` and mentioned in README.

## Timeline (suggested ~2 hours)

- 0:00–0:20: Scaffold app, mock API, models.
- 0:20–0:50: Build UI components and interactions.
- 0:50–1:20: Playwright setup + POM.
- 1:20–1:50: Implement tests and stabilize selectors.
- 1:50–2:00: Docs, cleanup, final pass.
