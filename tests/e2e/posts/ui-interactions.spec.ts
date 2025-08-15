import { test, expect } from '@playwright/test';
import { HomePage } from '../../pom/HomePage';
import { emojiPayload, htmlPayload, makeCommentText, POST_TITLES } from '../testData';

test.describe('Posts • UI Interaction', () => {
  test('emoji in comment renders', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const text = emojiPayload();
    await first.addComment(text);
    await first.expectCommentVisible(text);
  });

  test('HTML/script tags are escaped and shown as text', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const htmlText = htmlPayload();
    await first.addComment(htmlText);
    await first.expectCommentVisible(htmlText);
  });

  test('keyboard submit via Enter works', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const text = makeCommentText();
    await first.commentInput.focus();
    await first.commentInput.type(text);
    await page.keyboard.press('Enter');
    await first.expectCommentVisible(text);
  });

  test('timestamp is valid (no "Invalid Date")', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    await expect(first.meta).not.toContainText(/Invalid Date/i);
  });

  test('reload resets in-memory comments (no persistence)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const first = await home.getPostByTitle(POST_TITLES.first);
    const text = makeCommentText();
    await first.addComment(text);
    await first.expectCommentVisible(text);

    await page.reload();

    // After reload, comment should not be present by design
    const firstAfter = await home.getPostByTitle(POST_TITLES.first);
    await expect(firstAfter.comments.filter({ hasText: text })).toHaveCount(0);
  });
});
