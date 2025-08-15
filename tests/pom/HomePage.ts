import { Page, Locator, expect } from '@playwright/test';
import { PostCard } from './PostCard';

export class HomePage {
  readonly page: Page;
  readonly header: Locator;
  readonly postCards: Locator;
  private readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Posts' });
    this.postCards = page.getByTestId('post-card');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5173';
  }

  async goto() {
    await this.page.goto(this.baseUrl + '/');
    await expect(this.header).toBeVisible();
  }

  async getPostByTitle(title: string) {
    const card = this.page
      .getByTestId('post-card')
      .filter({ has: this.page.getByTestId('post-title').filter({ hasText: title }) });
    return new PostCard(this.page, card);
  }
}
