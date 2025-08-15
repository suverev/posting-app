import { test, expect } from '@playwright/test';
import { HomePage } from '../../pom/HomePage';
import { makeAuthor, makeCommentText, longText, POST_TITLES } from '../testData';

// Combined: comment-add + multiple-comments + validation pieces

test.describe('Posts • Comments', () => {
  test('@smoke add a comment with author and verify it appears', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const comment = makeCommentText();
    const author = makeAuthor();
    await test.step('add and assert comment', async () => {
      await first.addAndAssert(comment, author);
    });
  });

  test('rapid double click on submit does not create duplicates', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const text = makeCommentText();
    await test.step('prepare inputs', async () => {
      await first.commentInput.fill(text);
      await first.authorInput.fill(makeAuthor());
    });

    await test.step('double click submit', async () => {
      await Promise.all([first.submitButton.click(), first.submitButton.click()]);
    });

    // Expect exactly one instance of the comment
    await expect(first.comments.filter({ hasText: text })).toHaveCount(1);
  });

  test('@smoke add a comment without author → shows Anonymous', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const text = makeCommentText();
    await test.step('add anonymous comment', async () => {
      await first.addAndAssert(text);
    });
  });

  test('add multiple comments and verify append order (basic visibility)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const a = makeCommentText();
    const b = makeCommentText();
    const author = makeAuthor();
    await test.step('add two comments and assert both', async () => {
      await first.addAndAssert(a, author);
      await first.addAndAssert(b, author);
    });
  });

  test('empty/whitespace-only comment shows inline error and no new comment', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    await test.step('submit empty comment', async () => {
      await first.submitButton.click();
    });

    await expect(first.error).toBeVisible();
    await expect(first.error).toHaveText(/cannot be empty/i);
  });

  test('long comment (~1000 chars) renders without breaking layout', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const text = longText(1000);
    const first = await home.getPostByTitle(POST_TITLES.first);
    await test.step('add and assert long comment', async () => {
      await first.addAndAssert(text, makeAuthor());
    });
  });

  test('adding comment to Post A does not affect Post B (isolation)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const textA = makeCommentText();
    const postA = await home.getPostByTitle(POST_TITLES.first);
    await postA.addComment(textA, makeAuthor());
    await postA.expectCommentVisible(textA);

    const postB = await home.getPostByTitle(POST_TITLES.second);
    // ensure B doesn't contain A's text
    await expect(postB.comments.filter({ hasText: textA })).toHaveCount(0);
  });
});
