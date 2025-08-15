# Posts & Comments App

This project implements a simple React app with a mocked backend that displays posts and allows users to add comments.
It includes a comprehensive Playwright E2E test suite with Page Object Model (POM), randomized test data via faker, and
cross-browser smoke testing (Chromium and WebKit).

## Tech Stack

- React + TypeScript + Vite
- Mocked API (in-memory; no persistence)
- Playwright for E2E tests with POM
- @faker-js/faker for randomized test data

## Project Structure

- `src/` — application source
- `tests/` — Playwright tests and POM
  - `e2e/posts/` — tests grouped by feature (page-load, comments, UI interactions)
  - `pom/` — Page Objects (`HomePage`, `PostCard`)
  - `e2e/testData.ts` — shared test data generators and constants
- `playwright.config.ts` — root config with Chromium and WebKit projects
- `docs/Test Design - Posts and Comments.md` — detailed test design

## Prerequisites

- Node.js 18+ (recommended LTS)
- npm 9+

## Setup

Install dependencies and run the app.

```
npm ci
```

## Run the App

Start the Vite dev server (defaults to http://localhost:5173):

```
npm run dev
```

Optional: set `BASE_URL` for tests/POM (defaults to `http://localhost:5173`). Example:

```
export BASE_URL=http://localhost:5173
```

## Playwright Tests

Install Playwright browsers (only needed once):

```
npx playwright install --with-deps
```

Run all E2E tests (configured for Chromium and WebKit):

```
npm run test:e2e
```

Run only smoke tests (tagged with `@smoke`):

```
npm run test:e2e:smoke
```

Open the HTML report:

```
npx playwright show-report
```

## Cross-Browser Configuration

`playwright.config.ts` defines multiple projects (Chromium, WebKit) and sets `testDir` to `tests/e2e/posts`. To add
Firefox:

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
];
```

## Test Data and POM

- `tests/e2e/testData.ts`: `makeCommentText()`, `makeAuthor()`, `longText()`, `emojiPayload()`, `htmlPayload()`,
  `POST_TITLES`.
- `tests/pom/PostCard.ts`: helpers `addComment()`, `addAndAssert()`, `getCommentCount()` to keep specs concise.
- `tests/pom/HomePage.ts`: navigation and `getPostByTitle(title)`.

## AI Tool Usage

I used an AI coding assistant to:

- Design inital plan for development of the frontend application in `web/docs/Implementation Plan.md`.
- Design and document the test strategy captured in `web/docs/Test Design - Posts and Comments.md`.
- Introduce faker-based test data generators and centralize them in `tests/e2e/testData.ts`.
- Refactor tests for readability (POM helpers, `test.step` blocks, `@smoke` tags).
- Configure cross-browser runs in `playwright.config.ts` and validate across Chromium and WebKit.

This improved code quality, maintainability, and coverage while keeping runs fast and readable.
