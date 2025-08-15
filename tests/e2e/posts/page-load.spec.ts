import { test, expect } from '@playwright/test';
import { HomePage } from '../../pom/HomePage';
import { POST_TITLES } from '../testData';

test.describe('Posts • Page Load', () => {
  test('@smoke posts load and display correctly', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.postCards.first()).toBeVisible();

    const first = await home.getPostByTitle(POST_TITLES.first);
    await expect(first.title).toHaveText(new RegExp(POST_TITLES.first));
    await expect(first.content).toBeVisible();
    await expect(first.meta).toBeVisible();
  });
});
